"""Backend tests — Iteration 4: /api/chat live LLM endpoint (Claude Sonnet 4.5)."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://govtech-mmrda-demo.preview.emergentagent.com").rstrip("/")
TIMEOUT = 60  # Claude calls take 4-10s; give some headroom

PROJECT_PREFIX = {
    "MMRDA-2026-0142": "p1-",
    "MMRDA-2026-0098": "p2-",
    "MMRDA-2026-0117": "p3-",
}


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Live LLM happy-path per project ----------
@pytest.mark.parametrize("project_id,question", [
    ("MMRDA-2026-0142", "What is the outstanding mortgage amount on this parcel?"),
    ("MMRDA-2026-0098", "Is the title clear and what is the confidence?"),
    ("MMRDA-2026-0117", "Why is the title disputed?"),
])
def test_chat_live_per_project(api, project_id, question):
    r = api.post(f"{BASE_URL}/api/chat",
                 json={"project_id": project_id, "message": question},
                 timeout=TIMEOUT)
    assert r.status_code == 200, f"{project_id} -> {r.status_code} {r.text[:300]}"
    data = r.json()
    # answer non-empty
    assert isinstance(data.get("answer"), str) and len(data["answer"].strip()) > 0
    # model field MUST equal claude-sonnet-4-5-20250929
    assert data.get("model") == "claude-sonnet-4-5-20250929"
    # session_id present
    assert isinstance(data.get("session_id"), str) and len(data["session_id"]) > 0
    # confidence integer in range
    assert isinstance(data.get("confidence"), int)
    assert 0 <= data["confidence"] <= 99
    # at least one citation
    cits = data.get("citations") or []
    assert len(cits) >= 1, f"No citations returned for {project_id}: {data}"
    # citation chunk id starts with the correct project prefix
    prefix = PROJECT_PREFIX[project_id]
    assert any(c.get("chunk", "").startswith(prefix) for c in cits), \
        f"No citation chunk starts with {prefix} for {project_id}: {cits}"


# ---------- Error handling ----------
def test_chat_unknown_project_id(api):
    r = api.post(f"{BASE_URL}/api/chat",
                 json={"project_id": "MMRDA-2026-9999", "message": "hello"},
                 timeout=15)
    assert r.status_code == 400
    body = r.json()
    detail = (body.get("detail") or "").lower()
    assert "unknown" in detail and "project" in detail


def test_chat_empty_message(api):
    r = api.post(f"{BASE_URL}/api/chat",
                 json={"project_id": "MMRDA-2026-0142", "message": "   "},
                 timeout=15)
    assert r.status_code == 400


def test_chat_missing_fields(api):
    r = api.post(f"{BASE_URL}/api/chat", json={}, timeout=15)
    assert r.status_code in (400, 422)


# ---------- Smoke / regression ----------
def test_root_api(api):
    r = api.get(f"{BASE_URL}/api/", timeout=15)
    assert r.status_code == 200
    assert r.json().get("message") == "Hello World"
