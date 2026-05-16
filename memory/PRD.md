# MMRDA AI Land Acquisition & Title Validation Platform — PRD

## Original Problem Statement
Build a modern enterprise mockup web application for MMRDA (Mumbai Metropolitan Region Development Authority) demonstrating an AI-powered Land Title Validation and Acquisition Platform using Yavi.ai as the RAG engine. Clickable prototype / functional mockup with dummy data, mocked APIs, simulated AI outputs. Showcases land acquisition workflow, document ingestion, RAG-based title validation, government verification integrations, AI chatbot querying, and decision-support dashboard. Must feel investor / demo-ready for MMRDA leadership.

## User Choices (gathered)
- Scope: 5–6 most impactful screens first
- Auth: simple dummy/mock login (any credentials work, role-based UI)
- Chatbot: fully simulated/scripted responses (keyword-based)
- Theme: light enterprise theme with blue/teal accents
- Emphasis: RAG Pipeline + Chatbot

## Architecture
- **Frontend-only mockup** (React 19 + React Router 7 + Tailwind + shadcn/ui + recharts + lucide-react + sonner)
- **Backend**: stock template, untouched (no real APIs needed for mockup)
- **State**: localStorage for mock auth user
- **Data**: static JSON in `/src/data/mockData.js`

## User Personas
- **Legal Officer** — primary user, validates title clearances
- **Acquisition Officer** — drives project initiation
- **Survey Officer** — checks survey/cadastral consistency
- **Admin** — oversees platform, exports reports

## Implemented (07 Feb 2026)
- ✅ Login screen — split-screen, Mumbai skyline, role selector, MMRDA branding, Yavi.ai badge
- ✅ Dashboard — 6 KPIs (incl. dark AI Confidence panel), Acquisition by Zone bar chart, Clear vs Disputed pie, Verification trend area chart, Active project card + 3-project mini grid
- ✅ Project Workspace — 3-panel: documents list (6 docs incl. Marathi 7/12, Property Card, Aadhaar, Sale Deed, Mutation, EC), document viewer with OCR/Metadata/Ownership Chain tabs, dark AI Validation Summary panel with checks + risks
- ✅ RAG Pipeline — animated 9-stage flow (Upload→OCR→Metadata→Chunking→Embeddings→Yavi.ai Vector Store→Search→Rules→Decision), 4 stat cards, top semantic chunks card, embedding vector visualization
- ✅ AI Chatbot — Yavi.ai branded, scripted keyword responses (6 scripts + fallback), suggested prompts, typing animation, citations + cited snippet box, indexed sources sidebar with retrieval engine stats
- ✅ Title Validation — Yavi.ai decision card (status + confidence), validation checklist (7 rules), risk panel, workflow timeline, 6 Government API cards (MahaBhulekh, UIDAI, PAN/NSDL, IGRS, Encumbrance, GIS) with Verify Now actions

## Implemented (Iteration 2 — same day)
- ✅ **3 dummy properties**: MMRDA-2026-0142 (Conditional 92.7%, Bhiwandi), MMRDA-2026-0098 (Clear 96.4%, Uran-Raigad MTHL), MMRDA-2026-0117 (Disputed 71.2%, Andheri-W VBSL)
- ✅ **Project switcher** in app header (with localStorage persistence) — switches Workspace/Validation/Workflow/Valuation/Reports/Dashboard live
- ✅ **Projects page** (`/projects`) — summary counts + 3-card portfolio
- ✅ **Start New Project form** (`/projects/new`) — full RFCTLARR-style form + animated 5-stage Yavi.ai workspace provisioning panel
- ✅ **Land Valuation calculator** (`/valuation`) — RR rate × area × FSI × category multiplier × rural/urban factor + 100% solatium + 12% interest, computed live with bar chart breakdown
- ✅ **Workflow & Approvals page** (`/workflow`) — 7-stage timeline with done/active/pending/blocked states, owner + SLA + ETA per stage, 4 pending action cards
- ✅ **Reports page** (`/reports`) — 4 report cards with PDF/Excel export buttons, citation banner, audit trail of recent exports
- ✅ Sidebar updated: 9 enabled links + 2 placeholders (Legal Review, Settings)

## Implemented (Iteration 4 — Live LLM)
- ✅ **Yavi.ai chatbot now backed by Claude Sonnet 4.5** (`claude-sonnet-4-5-20250929` via Emergent universal LLM key + `emergentintegrations` library)
- ✅ Backend `POST /api/chat` endpoint with per-project grounded system prompt, JSON-structured response (answer + confidence + citations + model + session_id), defensive JSON parsing, error handling (400/422/502/503)
- ✅ Per-project RAG corpora mirrored on backend in `project_context.py` — citations always carry the correct `p1-`/`p2-`/`p3-` chunk prefix; no cross-project bleed
- ✅ Frontend Live/Scripted toggle pill, "Claude Sonnet 4.5" header sub-text, per-message badges (`Live · Claude Sonnet 4.5` vs `Scripted` vs `system`), Claude-flavoured typing indicator
- ✅ Graceful fallback to scripted responses when LLM unreachable
- ✅ Module-level logger moved above route handlers (post-test cleanup)

## Test Results
- Iteration 1: 11/11 (100%)
- Iteration 2: 28/28 (100%)
- Iteration 3: per-project isolation 100%
- Iteration 4: backend 7/7 pytest + frontend 100% — Claude calls all 3 projects with correct prefixed citations

## Backlog (P1 / P2)
- P1: Wire backend `/api/projects` + Mongo so Start-New-Project actually persists a 4th project
- P1: Real PDF/Excel report generators (pdfkit / SheetJS)
- P2: Persist chat history to Mongo + reuse session_id for multi-turn conversations
- P2: Multi-turn conversation memory with Claude
- P2: GIS map widget on workspace
- P2: Soft cap on message length (e.g. 2000 chars) to bound LLM cost

## Design Tokens
- Primary (Trust Blue): `#0A2540` · Cyan accent: `#06B6D4` · BG: `#F8FAFC`
- AI dark panel: `#0B1521` with cyan border + glow
- Fonts: Cabinet Grotesk (display), IBM Plex Sans (body), JetBrains Mono (mono)

## Backlog (P1 / P2)
- P1: Start New Project form screen (currently routes back to workspace)
- P1: Land Valuation calculator (Ready Reckoner with FSI + Solatium)
- P1: Workflow & Approval dedicated screen (currently embedded in Validation)
- P1: Reports screen (PDF/Excel export buttons, currently a toast)
- P2: Multiple projects list + filters
- P2: GIS map widget on workspace
- P2: Wire backend `/api/projects` and persist mock data to MongoDB

## Next Action Items
1. Run testing_agent_v3 to validate full demo flow
2. Connect GitHub / push if user requests
3. Optionally upgrade chatbot to real LLM (Claude / GPT) via Emergent LLM key for live Q&A demo
