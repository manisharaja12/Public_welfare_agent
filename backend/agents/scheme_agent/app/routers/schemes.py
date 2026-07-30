from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.schemas.scheme import SchemeResponse, SchemeListResponse
from app.services.scheme_service import get_scheme_by_id, list_schemes, search_schemes
from app.core.security import get_current_user

router = APIRouter(prefix="/api/schemes", tags=["Government Schemes"])


@router.get("", response_model=SchemeListResponse)
async def get_schemes(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    is_central: Optional[bool] = Query(None),
    current_user: dict = Depends(get_current_user),
):
    """List all active government schemes with optional filters."""
    return await list_schemes(page, page_size, category, state, is_central)


@router.get("/search", response_model=SchemeListResponse)
async def search(
    q: str = Query(..., min_length=2),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    """Full-text search across scheme names, descriptions, and tags."""
    return await search_schemes(q, page, page_size)


@router.get("/{scheme_id}", response_model=SchemeResponse)
async def get_scheme(scheme_id: str, current_user: dict = Depends(get_current_user)):
    """Get a single scheme by ID."""
    return await get_scheme_by_id(scheme_id)
