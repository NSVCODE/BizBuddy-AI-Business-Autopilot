from fastapi import APIRouter
from app.models.schemas import AnalyticsSummary
from app.db.supabase_client import get_supabase
from app.services.ai_service import _get_active_business
from datetime import date

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
async def get_summary():
    db = get_supabase()
    today = date.today().isoformat()

    leads_result = db.table("leads").select("id, source, status, created_at").execute()
    all_leads = leads_result.data or []

    bookings_result = db.table("bookings").select("id, status, date").execute()
    all_bookings = bookings_result.data or []

    convs_result = db.table("conversations").select("id").execute()
    total_convs = len(convs_result.data or [])

    new_today = sum(1 for l in all_leads if l["created_at"][:10] == today)
    bookings_today = sum(1 for b in all_bookings if b["date"] == today)

    biz = _get_active_business()
    biz_id = biz.get("id") if biz else None

    return AnalyticsSummary(
        business_id=biz_id,
        total_leads=len(all_leads),
        new_leads_today=new_today,
        bookings_today=bookings_today,
        total_bookings=len(all_bookings),
        active_conversations=total_convs,
        web_chat_leads=sum(1 for l in all_leads if l["source"] == "web_chat"),
        whatsapp_leads=sum(1 for l in all_leads if l["source"] == "whatsapp"),
        missed_call_leads=sum(1 for l in all_leads if l["source"] == "missed_call"),
        confirmed_bookings=sum(1 for b in all_bookings if b["status"] == "confirmed"),
        pending_bookings=sum(1 for b in all_bookings if b["status"] == "pending"),
    )
