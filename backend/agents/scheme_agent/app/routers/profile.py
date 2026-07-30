from fastapi import APIRouter, Depends
from app.schemas.profile import ProfileCreateRequest, ProfileUpdateRequest, ProfileResponse
from app.services.profile_service import create_profile, update_profile, get_profile, delete_profile
from app.core.security import get_current_user

router = APIRouter(prefix="/api/profile", tags=["Citizen Profile"])


@router.post("", response_model=ProfileResponse, status_code=201)
async def create(body: ProfileCreateRequest, current_user: dict = Depends(get_current_user)):
    """Create citizen profile."""
    return await create_profile(current_user["id"], body.model_dump())


@router.put("", response_model=ProfileResponse)
async def update(body: ProfileUpdateRequest, current_user: dict = Depends(get_current_user)):
    """Update citizen profile."""
    return await update_profile(current_user["id"], body.model_dump(exclude_none=True))


@router.get("", response_model=ProfileResponse)
async def get(current_user: dict = Depends(get_current_user)):
    """Get citizen profile."""
    return await get_profile(current_user["id"])


@router.delete("", status_code=204)
async def delete(current_user: dict = Depends(get_current_user)):
    """Delete citizen profile."""
    await delete_profile(current_user["id"])
