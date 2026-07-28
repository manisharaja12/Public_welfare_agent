from fastapi import APIRouter, Depends, Query
from app.schemas.scheme import SchemeCreateRequest, SchemeUpdateRequest, SchemeResponse
from app.services.scheme_service import create_scheme, update_scheme, delete_scheme
from app.services.admin_service import get_all_users, get_analytics, log_admin_action
from app.core.security import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.post("/schemes", response_model=SchemeResponse, status_code=201)
async def add_scheme(body: SchemeCreateRequest, admin: dict = Depends(get_current_admin)):
    """Add a new government scheme."""
    result = await create_scheme(body.model_dump(), admin["id"])
    await log_admin_action(admin["id"], "CREATE_SCHEME", result["id"], {"name": result["name"]})
    return result


@router.put("/schemes/{scheme_id}", response_model=SchemeResponse)
async def edit_scheme(
    scheme_id: str,
    body: SchemeUpdateRequest,
    admin: dict = Depends(get_current_admin),
):
    """Update an existing scheme."""
    result = await update_scheme(scheme_id, body.model_dump(exclude_none=True), admin["id"])
    await log_admin_action(admin["id"], "UPDATE_SCHEME", scheme_id)
    return result


@router.delete("/schemes/{scheme_id}", status_code=204)
async def remove_scheme(scheme_id: str, admin: dict = Depends(get_current_admin)):
    """Delete a scheme permanently."""
    await delete_scheme(scheme_id, admin["id"])
    await log_admin_action(admin["id"], "DELETE_SCHEME", scheme_id)


@router.get("/users")
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin: dict = Depends(get_current_admin),
):
    """List all registered citizens."""
    return await get_all_users(page, page_size)


@router.get("/analytics")
async def analytics(admin: dict = Depends(get_current_admin)):
    """Platform-wide analytics dashboard data."""
    return await get_analytics()
