from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import re
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage
from project_context import PROJECT_CONTEXT, build_system_prompt


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging early so route handlers can use the module-level logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# ---------------------------------------------------------------------------
# Yavi.ai live LLM chat endpoint (Claude Sonnet 4.5 via Emergent universal key)
# ---------------------------------------------------------------------------

class Citation(BaseModel):
    doc: str
    chunk: str
    line: str


class ChatRequest(BaseModel):
    project_id: str
    message: str


class ChatResponse(BaseModel):
    answer: str
    confidence: int
    citations: List[Citation]
    model: str
    session_id: str


_JSON_FENCE_RE = re.compile(r"```(?:json)?\s*(\{.*\})\s*```", re.DOTALL)


def _parse_llm_json(raw: str) -> dict:
    """Best-effort extraction of the JSON object from an LLM response."""
    if not raw:
        return {}
    text = raw.strip()
    # Strip ```json ... ``` fences if present
    fenced = _JSON_FENCE_RE.search(text)
    if fenced:
        text = fenced.group(1)
    # Otherwise grab the first {...} block
    if not text.startswith("{"):
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            text = text[start : end + 1]
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {}


@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_yavi(req: ChatRequest):
    """Free-form RAG chat answering questions about the active project."""
    if req.project_id not in PROJECT_CONTEXT:
        raise HTTPException(status_code=400, detail=f"Unknown project_id: {req.project_id}")
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="message is required")

    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="EMERGENT_LLM_KEY not configured")

    system_prompt = build_system_prompt(req.project_id)
    session_id = f"mmrda-{req.project_id}-{uuid.uuid4().hex[:8]}"

    chat = LlmChat(
        api_key=api_key,
        session_id=session_id,
        system_message=system_prompt,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    try:
        raw = await chat.send_message(UserMessage(text=req.message.strip()))
    except Exception as exc:
        logger.exception("Claude chat call failed")
        raise HTTPException(status_code=502, detail=f"LLM call failed: {exc}")

    parsed = _parse_llm_json(raw)
    answer = parsed.get("answer") or (raw.strip() if raw else "")
    if not answer:
        answer = "I couldn't generate a grounded response — please retry."

    confidence_raw = parsed.get("confidence", 80)
    try:
        confidence = max(0, min(99, int(confidence_raw)))
    except (TypeError, ValueError):
        confidence = 80

    citations: List[Citation] = []
    for c in parsed.get("citations", []) or []:
        if not isinstance(c, dict):
            continue
        citations.append(Citation(
            doc=str(c.get("doc", ""))[:200],
            chunk=str(c.get("chunk", ""))[:80],
            line=str(c.get("line", ""))[:400],
        ))

    return ChatResponse(
        answer=answer,
        confidence=confidence,
        citations=citations,
        model="claude-sonnet-4-5-20250929",
        session_id=session_id,
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()