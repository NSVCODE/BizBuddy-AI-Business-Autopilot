# 🤖 BizBuddy

> An AI-powered multi-channel business assistant that handles customer conversations, bookings, and lead capture across Web, WhatsApp, and Instagram — automatically.

![License](https://img.shields.io/badge/license-MIT-blue)
![Stack](https://img.shields.io/badge/stack-FastAPI%20%7C%20React%20%7C%20Supabase-green)
![Status](https://img.shields.io/badge/status-Active-brightgreen)

---

## 📌 Problem Statement

Small businesses — restaurants, salons, clinics, retail shops — lose customers daily because they cannot respond to inquiries fast enough. A customer who messages on WhatsApp at 9 PM asking to book an appointment, or a website visitor who wants to know today's menu, often gets no reply until the next morning — by which point they have already moved on. Hiring staff to monitor every channel 24/7 is not financially realistic for small businesses. BizBuddy solves this by deploying an AI assistant that handles conversations, captures leads, and confirms bookings across Web, WhatsApp, and Instagram simultaneously — with no human intervention required.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🧠 AI Conversation Engine | Claude Haiku-powered assistant with tool calling; responds contextually across all channels |
| 📅 Booking System | AI collects name, date, time, and party size through natural conversation and confirms bookings |
| 👥 Lead Capture | Auto-captures customer name, phone, email, and inquiry type from every conversation |
| ❓ Custom FAQs | Business owners add FAQs via dashboard; injected live into the AI system prompt |
| 💬 Web Chat Widget | Floating chat bubble on the customer-facing page, styled per business type |
| 📱 WhatsApp Integration | Real WhatsApp via QR scan (whatsapp-web.js) plus a simulation mode for testing |
| 📸 Instagram DM Integration | Polls Instagram DMs every 6 seconds and replies automatically via AI |
| 📞 Missed Call Follow-up | Auto-sends a WhatsApp follow-up message when a call is missed |
| 🔄 Returning Customer Recognition | On WhatsApp, greets returning customers by name with their past booking context |
| 🏢 Multi-Business Type Support | Distinct AI personas and UI configs for restaurants, salons, clinics, retail, and more |
| 📊 Admin Dashboard | Unified panel for leads, bookings, conversations, analytics, and channel management |

---

## 🏗️ Tech Stack

### Frontend
- ⚛️ React.js (Vite) — Component-based UI with file-based routing
- 🎨 Inline styles + CSS variables — No Tailwind/UI library dependency
- 🔗 Axios — API communication via Vite proxy
- 📊 Custom stat cards — Real-time analytics display

### Backend
- 🐍 FastAPI (Python) — REST API framework
- 🤖 Anthropic Claude Haiku (`claude-haiku-4-5-20251001`) — AI engine with tool calling
- 🗄️ Supabase (PostgreSQL) — Database + Row Level Security
- 🔌 supabase-py — Python Supabase client

### Channel Services
- 📱 whatsapp-web.js (Node.js) — Real WhatsApp messaging on port 3001
- 📸 instagram-private-api (Node.js) — Instagram DM polling on port 3002

---

## 📂 Project Structure

```
AI_BizBuddy/
├── backend/
│   ├── app/
│   │   ├── main.py                        # FastAPI entry point, CORS config, router registration
│   │   ├── config/
│   │   │   └── restaurant.py              # Static fallback config (used when no business in DB)
│   │   ├── services/
│   │   │   ├── ai_service.py              # Core AI brain — Claude tool calling, dynamic system prompt, persona selection
│   │   │   ├── booking_service.py         # Availability checks, booking creation (max 3 per slot)
│   │   │   └── lead_service.py            # Lead upsert deduped by phone number
│   │   ├── routers/
│   │   │   ├── chat.py                    # POST /api/chat — main web chat endpoint
│   │   │   ├── whatsapp.py                # WhatsApp incoming, simulate, missed-call endpoints
│   │   │   ├── analytics.py               # GET /api/analytics/summary — live Supabase aggregation
│   │   │   ├── business.py                # GET/PUT /api/business/profile
│   │   │   └── faqs.py                    # CRUD /api/faqs — custom FAQs per business
│   │   ├── db/
│   │   │   └── supabase_client.py         # Singleton Supabase client (lazy-initialized)
│   │   └── models/
│   │       └── schemas.py                 # All Pydantic request/response models
│   ├── supabase_schema.sql                # Full DB schema + seed data + RLS policies
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   └── favicon.png                    # BizBuddy hexagon logo
│   └── src/
│       ├── pages/
│       │   ├── Auth.jsx                   # Login / signup page
│       │   ├── Onboarding.jsx             # Business registration wizard
│       │   ├── Home.jsx                   # Dynamic customer-facing page with ChatWidget
│       │   └── Dashboard.jsx              # Admin panel (Overview, WhatsApp, Instagram, Leads, Bookings, Conversations, FAQs)
│       ├── components/
│       │   ├── ChatWidget/
│       │   │   ├── ChatBubble.jsx         # Floating button — emoji driven by business type
│       │   │   └── ChatWindow.jsx         # Chat panel — content driven by CHAT_CONFIGS per business type
│       │   ├── WhatsAppConnect/
│       │   │   └── WhatsAppConnect.jsx    # QR scan panel for real WhatsApp
│       │   └── WhatsAppSim/
│       │       └── WhatsAppPanel.jsx      # Simulated WhatsApp conversation tester
│       ├── services/
│       │   └── api.js                     # All Axios calls, reads VITE_API_BASE_URL
│       └── index.css                      # Global styles, CSS variables (--blue, --beige, --yellow, --brown)
│
├── whatsapp-service/
│   ├── index.js                           # whatsapp-web.js server — QR, message handler, call rejection, follow-up nudge
│   └── package.json
│
├── instagram-service/
│   ├── index.js                           # instagram-private-api server — login, DM polling, AI reply
│   └── package.json
│
├── .env.example                           # Environment variable template
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Supabase account (free at https://supabase.com)
- Anthropic API key (free trial at https://console.anthropic.com)

### 1. Clone the Repository

```bash
git clone https://github.com/NSVCODE/AI-BizBuddy.git
cd AI-BizBuddy
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Go to **SQL Editor** → paste and run the contents of `backend/supabase_schema.sql`
3. Copy your **Project URL** and **anon/public key** from Project Settings → API

### 3. Backend Setup

```bash
cd backend
cp ../.env.example .env
# Edit .env — fill in ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_KEY

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`  
API docs available at `http://localhost:8000/docs`

### 4. Frontend Setup

```bash
cd frontend
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### 5. WhatsApp Service (optional — for real WhatsApp)

```bash
cd whatsapp-service
npm install
npm start
```

Service runs at `http://localhost:3001`. Scan the QR code from Dashboard → WhatsApp tab.

### 6. Instagram Service (optional — for Instagram DMs)

```bash
cd instagram-service
# Create .env with: IG_USERNAME, IG_PASSWORD, FASTAPI_URL=http://localhost:8000, IG_PORT=3002
npm install
npm start
```

Service runs at `http://localhost:3002`. Enter credentials from Dashboard → Instagram tab.

---

## 🧠 How It Works

### Web Chat Flow

1. Customer opens the business homepage and clicks the floating chat bubble
2. `ChatWindow.jsx` opens and sends messages to `POST /api/chat`
3. `ai_service.py` fetches the active business from Supabase, builds a dynamic system prompt with the business persona, menu (if restaurant), and custom FAQs
4. Claude Haiku runs an agentic loop — if the customer wants to book, it calls `create_booking` tool; if it needs to capture info, it calls `capture_lead`
5. Booking and lead records are written to Supabase; AI reply is returned to the frontend

### WhatsApp Flow

1. A real WhatsApp message arrives at the `whatsapp-service` via `whatsapp-web.js`
2. Service forwards it to `POST /api/whatsapp/incoming` with the sender's phone and a session ID
3. On new sessions, `_get_returning_customer_context()` looks up the phone in leads/bookings and prepends a greeting context so the AI can address the customer by name
4. AI processes the message through the same agentic pipeline and returns a reply
5. `whatsapp-service` sends the reply back to the customer's WhatsApp number
6. If the customer mentioned a service keyword but no booking was confirmed, a 10-second follow-up nudge is sent automatically

### Missed Call Flow

1. `whatsapp-service` listens for `call` events, auto-rejects, and sends an initial sorry message
2. Dashboard "Simulate Missed Call" button calls `POST /api/whatsapp/missed-call`
3. AI generates a proactive follow-up message offering to help and is sent to the customer

### Instagram DM Flow

1. `instagram-service` polls the DM inbox every 6 seconds
2. On a new text DM, it forwards to `POST /api/whatsapp/incoming` with `phone: ig_<userId>` and `session_id: ig_<threadId>`
3. The same AI pipeline handles the message; reply is sent back via the Instagram thread

### Business Onboarding Flow

1. New user signs up via `Auth.jsx`, then completes the `Onboarding.jsx` wizard
2. Business record (name, type, location, phone, email, description) is written to the `businesses` Supabase table
3. On the next AI request, `build_system_prompt()` fetches this business and selects the matching persona from `TYPE_PERSONAS` — the assistant's tone and knowledge base update automatically

---

## 📈 Scalability

- **Stateless AI sessions**: conversation sessions are held in-memory per process; these can be migrated to Redis to support horizontal scaling across multiple backend instances with no code changes to the AI pipeline
- **Supabase as managed infrastructure**: PostgreSQL with RLS handles concurrent reads/writes without custom connection pooling; Supabase scales vertically and supports read replicas for high-traffic deployments
- **Decoupled channel services**: WhatsApp and Instagram services are independent Node.js processes that communicate over HTTP — they can be deployed, scaled, or replaced independently without touching the AI core
- **Multi-tenant ready**: the database schema already stores `business_id` on all tables; the current single-tenant demo can be extended to full multi-tenancy by scoping all queries to the authenticated user's business
- **Docker-ready architecture**: each of the three services (backend, whatsapp-service, instagram-service) plus the frontend build can be containerized independently and deployed behind a reverse proxy or orchestrated with Docker Compose

---

## 💡 Feasibility

BizBuddy is built entirely on production-grade, actively maintained tools. FastAPI and React are industry-standard frameworks with large ecosystems. Supabase provides a fully managed PostgreSQL database with built-in authentication and RLS — no custom database infrastructure is required. The AI layer uses Anthropic's Claude API, which requires only an API key and has a free trial tier suitable for demos. The WhatsApp and Instagram integrations use existing open-source libraries (`whatsapp-web.js`, `instagram-private-api`) that abstract the protocol complexity. Taking this project to production would require: a cloud host for the three services (e.g. Railway, Render, or a VPS), a Supabase project, and a business WhatsApp number for QR authentication.

---

## 🌟 Novelty

Existing small business tools typically address one channel at a time — a WhatsApp bot, a booking widget, or a CRM — each requiring separate setup, separate configuration, and separate monitoring. BizBuddy unifies all three channels (Web, WhatsApp, Instagram) through a single AI pipeline with shared conversation history, lead deduplication by phone number, and a single admin dashboard. The dynamic persona system means one deployment serves any business type — a restaurant gets a different AI tone, greeting, and capability set than a salon or clinic, all driven by a single database record. The returning customer recognition feature — where the AI greets a WhatsApp customer by name based on their prior lead or booking — is a specific UX detail not commonly found in small-business chatbot tools.

---

## 🔧 Feature Depth

- **AI tool calling loop**: `ai_service.py` runs a full agentic loop until `stop_reason == "end_turn"` — the AI can chain multiple tool calls (e.g., check availability, then create booking, then capture lead) in a single user turn
- **Booking conflict prevention**: `booking_service.py` enforces a maximum of 3 bookings per time slot before rejecting new ones
- **Lead deduplication**: `lead_service.py` upserts by phone number — the same customer messaging from web and WhatsApp stays as one lead record, not two
- **Booking deduplication in UI**: Dashboard deduplicates bookings by `phone|date|time` key, keeping the highest-status entry (confirmed > pending > cancelled > completed) to handle seed data edge cases
- **Custom FAQs**: businesses add FAQs via the dashboard; these are fetched at request time and injected into the AI system prompt, overriding the static fallback config
- **Business type personas**: `TYPE_PERSONAS` dict in `ai_service.py` defines distinct assistant identities for restaurant, salon, clinic, retail, and service businesses — menu section is only rendered for the `restaurant` type
- **Instagram reuses WhatsApp pipeline**: Instagram DMs are forwarded to the WhatsApp endpoint with a prefixed `ig_` phone and session ID — no duplicate AI logic, full conversation history support

---

## ⚠️ Ethical Use & Disclaimer

BizBuddy uses AI-generated content to interact with real customers on behalf of businesses. Businesses deploying this assistant are responsible for:

- Ensuring customers are informed they may be interacting with an AI
- Complying with applicable data protection laws (GDPR, PDPA, etc.) when collecting customer names, phone numbers, and emails
- Not using the WhatsApp or Instagram integrations in violation of the respective platform's Terms of Service

This project is submitted as a hackathon MVP and is not production-hardened. Use responsibly.

---

## 📜 License

Licensed under the [MIT License](LICENSE).

---

## 🧩 Author

**VAISHNAVE N S**  
🔗 [GitHub — NSVCODE/AI-BizBuddy](https://github.com/NSVCODE/AI-BizBuddy)
