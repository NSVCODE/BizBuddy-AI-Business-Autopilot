# ☕🌙 LatteLune AI BizBuddy

> **AI-powered multi-channel business assistant for LatteLune café**
> Built for the AI Business Autopilot Hackathon

---

## Quick Start

### 1. Prerequisites
- Python 3.11+
- Node.js 18+ (install from https://nodejs.org)
- Supabase account (free at https://supabase.com)
- Anthropic API key (free trial at https://console.anthropic.com)

---

### 2. Supabase Setup
1. Create a new Supabase project
2. Go to **SQL Editor** → paste and run `backend/supabase_schema.sql`
3. Copy your **Project URL** and **anon/public key** from Project Settings → API

---

### 3. Backend Setup
```bash
cd backend

# Create .env file
cp ../'.env.example' .env
# Edit .env — fill in ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_KEY

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API docs: http://localhost:8000/docs

---

### 4. Frontend Setup
```bash
cd frontend

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8000" > .env

npm install
npm run dev
```
App: http://localhost:5173

---

## Features

| Feature | Channel | Description |
|---------|---------|-------------|
| 💬 AI Chat Widget | Web | Floating chat on restaurant website |
| 📅 Table Booking | Web + WhatsApp | AI collects details, creates confirmed booking |
| 👥 Lead Capture | All | Auto-captures name, phone, email, inquiry type |
| 🍽️ Menu & FAQ | Web + WhatsApp | Context-aware answers from café knowledge base |
| 📱 WhatsApp Sim | Dashboard | Simulate incoming WhatsApp conversations |
| 📞 Missed Call | Dashboard | One click → automated WhatsApp follow-up |
| 📊 Dashboard | Admin | Real-time stats, leads table, bookings management |

---

## Demo Flow

1. **Web Chat**: Open `http://localhost:5173` → click ☕ chat bubble → try:
   - *"I want to book a table for 4 on Saturday at 7pm"*
   - *"What's on your menu?"*
   - *"Do you have WiFi?"*

2. **Dashboard**: Visit `http://localhost:5173/dashboard`
   - See all leads and bookings update in real-time
   - Open WhatsApp panel → send a simulated message
   - Click **Simulate Missed Call** → auto follow-up appears

---

## Project Structure

```
AI_BizBuddy/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entrypoint
│   │   ├── config/restaurant.py # LatteLune knowledge base
│   │   ├── services/ai_service.py  # Claude AI + tool calling
│   │   ├── routers/             # chat, leads, bookings, whatsapp, analytics
│   │   └── db/supabase_client.py
│   ├── supabase_schema.sql
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── pages/Home.jsx       # Restaurant website
        ├── pages/Dashboard.jsx  # Admin panel
        ├── components/ChatWidget/   # AI chat UI
        ├── components/WhatsAppSim/  # WhatsApp simulator
        └── services/api.js      # API client
```
