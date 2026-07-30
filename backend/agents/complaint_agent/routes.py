"""
Complaint Agent — API Routes
"""
from typing import Optional

from fastapi import APIRouter, Depends, Query, status

from .constants import (
    ComplaintCategory,
    ComplaintPriority,
    ComplaintStatus,
    PAGE_SIZE_DEFAULT,
)
from .schemas import (
    ComplaintCreateRequest,
    ComplaintResponse,
    ComplaintStatusUpdateRequest,
    ComplaintUpdateRequest,
    DashboardStatsResponse,
    MessageResponse,
    PaginatedComplaintsResponse,
    ResolutionEstimateResponse,
)
from .security import get_current_user
from .services import (
    ai_suggest_complaint,
    create_complaint,
    delete_complaint,
    estimate_resolution,
    get_analytics,
    get_complaint,
    get_complaint_timeline,
    get_dashboard_stats,
    list_complaints,
    search_complaints,
    update_complaint,
    update_complaint_status,
)

router = APIRouter(prefix="/complaints", tags=["Complaints"])


@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
def create(payload: ComplaintCreateRequest):
    """Submit a new citizen complaint."""
    return create_complaint(payload)


@router.get("", response_model=PaginatedComplaintsResponse)
def list_all(
    page: int = Query(1, ge=1),
    page_size: int = Query(PAGE_SIZE_DEFAULT, ge=1, le=100),
    status: Optional[ComplaintStatus] = None,
    category: Optional[ComplaintCategory] = None,
    priority: Optional[ComplaintPriority] = None,
):
    """List complaints with optional filters and pagination."""
    return list_complaints(page, page_size, status, category, priority)


@router.get("/dashboard", response_model=DashboardStatsResponse)
def dashboard():
    """Aggregate statistics for the complaint dashboard."""
    return get_dashboard_stats()


@router.get("/search", response_model=PaginatedComplaintsResponse)
def search(
    q: str = Query(..., min_length=2),
    page: int = Query(1, ge=1),
    page_size: int = Query(PAGE_SIZE_DEFAULT, ge=1, le=100),
):
    """Full-text search across complaint title and description."""
    return search_complaints(q, page, page_size)


@router.get("/analytics", response_model=dict)
def analytics():
    """Rich analytics data for charts and trends."""
    return get_analytics()


@router.get("/{complaint_id}/estimate", response_model=ResolutionEstimateResponse)
def resolution_estimate(complaint_id: str):
    """Return an AI-style resolution time estimate based only on the complaint's own fields."""
    return estimate_resolution(complaint_id)


@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_one(complaint_id: str):
    """Retrieve a single complaint by ID."""
    return get_complaint(complaint_id)


@router.put("/{complaint_id}", response_model=ComplaintResponse)
def update(complaint_id: str, payload: ComplaintUpdateRequest):
    """Update complaint details."""
    return update_complaint(complaint_id, payload)


@router.delete("/{complaint_id}", response_model=MessageResponse, status_code=status.HTTP_200_OK)
def delete(complaint_id: str):
    """Delete a complaint by ID."""
    delete_complaint(complaint_id)
    return {"message": f"Complaint '{complaint_id}' deleted successfully."}


@router.patch("/status", response_model=ComplaintResponse)
def patch_status(payload: ComplaintStatusUpdateRequest):
    """Update the status of a complaint (admin/officer action)."""
    return update_complaint_status(payload)


@router.post("/ai-suggest", response_model=dict)
def ai_suggest(payload: dict):
    """AI-powered category and priority suggestion from complaint text."""
    return ai_suggest_complaint(payload.get("text", ""))


@router.get("/{complaint_id}/timeline", response_model=dict)
def timeline(complaint_id: str):
    """Return status timeline/history for a complaint."""
    return get_complaint_timeline(complaint_id)
