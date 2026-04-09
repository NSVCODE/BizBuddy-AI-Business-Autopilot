# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: BizBuddy — AI Business Assistant

AI-powered multi-channel business assistant for small businesses (hackathon MVP). Supports restaurants, salons, clinics, retail stores, and more. Stack: React (Vite) + FastAPI + Supabase + Claude Haiku API.

**GitHub:** https://github.com/NSVCODE/AI-BizBuddy

## Running the project

### Backend (FastAPI) — port 8000
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# API docs: http://localhost:8000/docs
```

### Frontend (React + Vite) — port 5173
```bash
cd frontend
npm install
npm run dev
```

### WhatsApp service (whatsapp-web.js) — port 3001
```bash
cd whatsapp-service
npm install
npm start
# Scan QR from the dashboard → WhatsApp tab
```

### Instagram service (instagram-private-api) — port 3002
```bash
cd instagram-service
npm install
npm start
# Enter credentials in the dashboard → Instagram tab
```

### Git & GitHub
```bash
# gh CLI path must be set explicitly in bash on this machine:
export PATH="$PATH:/c/Program Files/GitHub CLI"

git add <files>
git commit -m "feat: ..."
git push
```
Always commit and push after meaningful changes. Use conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`.

### Environment Setup
1. Copy `.env.example` → `backend/.env` and fill in: `ANTHROPIC_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`
2. `frontend/.env` only needs `VITE_API_BASE_URL=http://localhost:8000`
3. Run `backend/supabase_schema.sql` in Supabase SQL Editor (includes seed demo data + FAQs table)
4. `instagram-service/.env`: `IG_USERNAME`, `IG_PASSWORD`, `FASTAPI_URL`, `IG_PORT=3002`

## Architecture

### Backend (`backend/app/`)
- `config/restaurant.py` — Static fallback config for LatteLune café (menu, hours, FAQs). Used only when no business is registered in Supabase.
- `services/ai_service.py` — Core AI brain. Claude `claude-haiku-4-5-20251001` with tool calling. `process_message(session_id, message, channel)` runs an agentic loop until `stop_reason == "end_turn"`. `build_system_prompt()` dynamically fetches the active business from Supabase and selects a persona from `TYPE_PERSONAS` dict based on business type. Custom FAQs injected per business from the `faqs` table.
- `services/booking_service.py` — Availability checks (max 3 bookings per slot), booking creation.
- `services/lead_service.py` — Lead upsert deduped by phone number.
- `routers/chat.py` — `POST /api/chat` main conversation endpoint.
- `routers/whatsapp.py` — `POST /api/whatsapp/incoming` (real WhatsApp), `POST /api/whatsapp/simulate`, `POST /api/whatsapp/missed-call`. Includes `_get_returning_customer_context(phone)` — on new sessions, fetches lead/booking by phone and injects greeting context. Sessions in-memory.
- `routers/analytics.py` — `GET /api/analytics/summary` — aggregates live stats from Supabase.
- `routers/business.py` — `GET /api/business/profile` — returns most recent business (single-tenant demo). `PUT /api/business/profile` — updates name/location/phone/email/description.
- `routers/faqs.py` — CRUD `/api/faqs` — create/list/update/delete custom FAQs per business. FAQs are injected into the AI system prompt and shown on the customer page.
- `db/supabase_client.py` — Singleton Supabase client (lazy-initialized from env vars).
- `models/schemas.py` — All Pydantic request/response models.

### Frontend (`frontend/src/`)
- `pages/Auth.jsx` — Login/signup. Brand shown as "BizBuddy" in Playfair Display blue. Footer: "Powered by Syntactic".
- `pages/Onboarding.jsx` — Business registration wizard (name, type, location, phone, email, description). Persists to Supabase `businesses` table.
- `pages/Home.jsx` — Dynamic customer-facing page. Fetches `/api/business/profile` on mount; renders type-specific tagline, features, stats, and contact info. Includes `<ChatWidget />`.
- `pages/Dashboard.jsx` — Admin panel. Nav: Overview / WhatsApp / Instagram / Leads / Bookings / Conversations / FAQs. Auto-refreshes every 30s. Brand: favicon.png + "BizBuddy" in Playfair Display.
- `components/ChatWidget/ChatBubble.jsx` — Floating button. Fetches business type and shows matching emoji (🍽️ / ✂️ / 🩺 / 🛍️ / 🔧 / 💬).
- `components/ChatWidget/ChatWindow.jsx` — Chat panel. All content (greeting, quick replies, emoji, header name) driven by `CHAT_CONFIGS[business.type]`. No hardcoded LatteLune references.
- `components/WhatsAppConnect/WhatsAppConnect.jsx` — QR scan panel for real WhatsApp.
- `components/WhatsAppSim/WhatsAppPanel.jsx` — Simulates WhatsApp conversations; "Simulate Missed Call" triggers auto follow-up.
- `services/api.js` — All Axios API calls. Reads `VITE_API_BASE_URL` from env.

### WhatsApp service (`whatsapp-service/`)
Node.js + whatsapp-web.js on port 3001.
- Scans QR from dashboard to connect a real WhatsApp number.
- `message` event: forwards to FastAPI `/api/whatsapp/incoming`, sends AI reply back.
- `call` event: auto-rejects and sends "Sorry we couldn't attend your call!" text.
- Follow-up logic: if customer's message contains service keywords and AI reply doesn't confirm a booking, a 10-second timeout fires a nudge message. Cancelled if customer replies first.

### Instagram service (`instagram-service/`)
Node.js + instagram-private-api on port 3002.
- `POST /configure` — accepts `{username, password}`, attempts IG login (called from dashboard UI).
- `GET /status` — returns `{ status, username }`.
- `POST /disconnect` — stops polling.
- Polls DM inbox every 6 seconds. On new text DM, forwards to FastAPI, sends AI reply back via IG thread.
- Seeds existing messages on startup to avoid replying to old DMs.

### Database (Supabase PostgreSQL)
Tables: `conversations`, `messages`, `leads`, `bookings`, `businesses`, `faqs`.
Full schema + seed data in `backend/supabase_schema.sql`.

Key RLS policies:
- `businesses`: public read (required for customer page + AI prompt without auth)
- `faqs`: public read (customer page and AI prompt)

## Key Design Decisions
- **Dynamic AI persona**: `build_system_prompt()` calls `_get_active_business()` at request time, picks from `TYPE_PERSONAS` dict by `business.type`. Menu section rendered only for `restaurant` type. Custom FAQs from DB override static FAQs.
- **`create_booking` also calls `capture_lead`**: every booking automatically creates/updates a lead record.
- **Lead dedup**: `lead_service.py` upserts by phone — same customer across web/WhatsApp/Instagram stays one lead.
- **Booking dedup in UI**: Dashboard deduplicates bookings by `phone|date|time` key, keeping the highest-status entry (confirmed > pending > cancelled > completed) to handle seed data repeats.
- **Returning customer greeting**: WhatsApp router checks leads table by phone on new sessions; if found, prepends context (name, past booking) to the first message so AI greets them by name.
- **Vite proxy**: `vite.config.js` proxies `/api/*` → 8000, `/wa-api/*` → 3001, `/ig-api/*` → 3002. All frontend calls use relative paths.
- **Instagram uses WhatsApp endpoint**: Instagram DMs are forwarded to `POST /api/whatsapp/incoming` with `phone: ig_<userId>` and `session_id: ig_<threadId>` — reuses the same AI + conversation history pipeline.
- **No Tailwind/UI library**: all styling is inline React styles or CSS classes defined in `index.css`. Palette: `--blue #2563eb`, `--beige #F5E6D3`, `--yellow #F9C74F`, `--brown #6B4226`. Dashboard uses Tailwind utility classes from `@import "tailwindcss"`.
- **Favicon**: `frontend/public/favicon.png` — hexagon crop of BizBuddy logo. Sidebar shows `favicon.png` (h-9 w-9) + "BizBuddy" in Playfair Display blue.
