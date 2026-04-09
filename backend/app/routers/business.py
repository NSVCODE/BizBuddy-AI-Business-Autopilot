from fastapi import APIRouter
from app.db.supabase_client import get_supabase

router = APIRouter(prefix="/api/business", tags=["business"])


@router.get("/debug")
async def debug_businesses():
    """Temporary debug: see what's in the businesses table."""
    try:
        db = get_supabase()
        result = db.table("businesses").select("id, name, type, created_at").order("created_at", desc=True).execute()
        return {"count": len(result.data or []), "rows": result.data}
    except Exception as e:
        return {"error": str(e)}


@router.get("/profile")
async def get_business_profile(id: str | None = None, user_id: str | None = None):
    """
    Returns the active business profile for the customer-facing page.
    Priority: ?id= > ?user_id= > most recently created.
    """
    db = get_supabase()
    query = db.table("businesses").select("id, name, type, location, phone, email, description")

    if id:
        query = query.eq("id", id)
    elif user_id:
        query = query.eq("user_id", user_id)
    else:
        query = query.order("created_at", desc=True).limit(1)

    result = query.execute()
    if not result.data:
        return None
    return result.data[0]
