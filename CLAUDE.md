# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: LatteLune AI BizBuddy

AI-powered multi-channel business assistant for LatteLune café (hackathon MVP). Stack: React (Vite) + FastAPI + Supabase + Claude Haiku API.

## Commands

### Backend (FastAPI)
```bash
# From project root
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# API docs at: http://localhost:8000/docs
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev     # starts at http://localhost:5173
npm run build
```

### Environment Setup
1. Copy `.env.example` → `backend/.env` and fill in keys
2. Copy `frontend/.env.example` → `frontend/.env`
3. Run `backend/supabase_schema.sql` in Supabase SQL Editor

## Architecture

### Backend (`backend/app/`)
- `main.py` — FastAPI app, CORS, router registration
- `config/restaurant.py` — All LatteLune knowledge: menu, hours, FAQs, AI persona. **Edit this to change café context.**
- `services/ai_service.py` — Core AI brain. Claude `claude-haiku-4-5-20251001` with tool calling. Manages conversation history in Supabase. Tools: `check_availability`, `create_booking`, `capture_lead`, `get_available_slots`, `get_menu`.
- `services/booking_service.py` — Availability logic, booking creation. Max 3 simultaneous bookings per slot.
- `services/lead_service.py` — Lead upsert (dedupes by phone number).
- `routers/chat.py` — `POST /api/chat` (main entry), conversation/message fetch endpoints.
- `routers/whatsapp.py` — Simulated WhatsApp: `POST /api/whatsapp/simulate` and `POST /api/whatsapp/missed-call`. Uses in-memory session map keyed by phone.
- `routers/analytics.py` — Aggregates stats from Supabase for the dashboard.
- `db/supabase_client.py` — Singleton Supabase client.
- `models/schemas.py` — All Pydantic models.

### Frontend (`frontend/src/`)
- `pages/Home.jsx` — LatteLune landing page with embedded `ChatWidget`
- `pages/Dashboard.jsx` — Admin panel: StatsBar + tabbed tables + WhatsApp simulator sidebar. Auto-refreshes every 30s.
- `components/ChatWidget/` — `ChatBubble` (floating button) + `ChatWindow` (slide-up panel with quick replies, typing indicator). Session ID is UUID-generated per browser visit.
- `components/Dashboard/` — `StatsBar`, `LeadsTable` (status editable inline), `BookingsTable` (confirm/cancel actions), `ConversationsPanel` (click to expand messages).
- `components/WhatsAppSim/WhatsAppPanel.jsx` — Simulates WhatsApp messages and missed call auto-follow-up. Maintains per-phone conversation state in local React state.
- `services/api.js` — All Axios calls to the backend.

### Database (Supabase)
Tables: `conversations`, `messages`, `leads`, `bookings`. Schema in `backend/supabase_schema.sql`.

## Key Design Decisions
- **Agentic loop** in `ai_service.py:process_message()`: keeps calling Claude until `stop_reason == "end_turn"`, allowing multi-step tool use in one user turn.
- **Lead deduplication**: `lead_service.py` upserts by phone number to avoid duplicates across channels.
- **`create_booking` also calls `capture_lead`**: ensures every booking has a corresponding lead record.
- **WhatsApp sessions**: stored in-memory dict in `routers/whatsapp.py` — resets on server restart (acceptable for demo).
- **Vite proxy**: `vite.config.js` proxies `/api/*` to `http://localhost:8000`, so frontend uses relative `/api/` paths via `VITE_API_BASE_URL`.
