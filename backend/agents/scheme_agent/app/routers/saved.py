from fastapi import APIRouter, Depends
from app.schemas.scheme import SaveSchemeRequest, SavedSchemeResponse, NotificationResponse
from app.services.saved_service import save_scheme, get_saved_schemes, delete_saved_scheme, get_notifications
from app.core.security import get_current_user

router = APIRouter(prefix="/api", tags=["Saved Schemes & Notifications"])


@router.post("/saved", response_model=SavedSchemeResponse, status_code=201)
async def save(body: SaveSchemeRequest, current_user: dict = Depends(get_current_user)):
    """Save a scheme to favourites."""
    return await save_scheme(current_user["id"], body.scheme_id)


@router.get("/saved", response_model=list[SavedSchemeResponse])
async def get_saved(current_user: dict = Depends(get_current_user)):
    """Get all saved schemes."""
    return await get_saved_schemes(current_user["id"])


@router.delete("/saved/{saved_id}", status_code=204)
async def delete_saved(saved_id: str, current_user: dict = Depends(get_current_user)):
    """Remove a scheme from favourites."""
    await delete_saved_scheme(current_user["id"], saved_id)


@router.get("/notifications", response_model=list[NotificationResponse])
async def notifications(current_user: dict = Depends(get_current_user)):
    """Get notifications (marks them as read on fetch)."""
    return await get_notifications(current_user["id"])
