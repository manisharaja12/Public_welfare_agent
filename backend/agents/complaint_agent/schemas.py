"""
Complaint Agent — Pydantic Schemas
Request/Response models with automatic input sanitization via field validators.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field, field_validator

from .constants import ComplaintCategory, ComplaintPriority, ComplaintStatus
from .utils import sanitize_html


# ── Request Schemas ──────────────────────────────────────────────────────────


class ComplaintCreateRequest(BaseModel):
    """Schema for creating a new complaint."""
    title: str = Field(..., min_length=5, max_length=200, description="Complaint title")
    description: str = Field(..., min_length=10, max_length=2000, description="Detailed description")
    category: ComplaintCategory = Field(..., description="Complaint category")
    priority: ComplaintPriority = Field(default=ComplaintPriority.MEDIUM, description="Priority level")
    location: Optional[str] = Field(None, max_length=300, description="Location of the complaint")
    citizen_name: Optional[str] = Field(None, max_length=100, description="Citizen name")
    citizen_contact: Optional[str] = Field(None, max_length=20, description="Citizen contact number")

    @field_validator("title", "description", "location", "citizen_name", mode="before")
    @classmethod
    def sanitize_text_fields(cls, v: Any) -> Any:
        if isinstance(v, str):
            return sanitize_html(v)
        return v

    class Config:
        use_enum_values = True


class ComplaintUpdateRequest(BaseModel):
    """Schema for updating an existing complaint."""
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    description: Optional[str] = Field(None, min_length=10, max_length=2000)
    category: Optional[ComplaintCategory] = None
    priority: Optional[ComplaintPriority] = None
    location: Optional[str] = Field(None, max_length=300)
    citizen_name: Optional[str] = Field(None, max_length=100)
    citizen_contact: Optional[str] = Field(None, max_length=20)

    @field_validator("title", "description", "location", "citizen_name", mode="before")
    @classmethod
    def sanitize_text_fields(cls, v: Any) -> Any:
        if isinstance(v, str):
            return sanitize_html(v)
        return v

    class Config:
        use_enum_values = True


class ComplaintStatusUpdateRequest(BaseModel):
    """Schema for updating complaint status (admin/officer action)."""
    complaint_id: str = Field(..., description="ID of the complaint to update")
    status: ComplaintStatus = Field(..., description="New status")
    remarks: Optional[str] = Field(None, max_length=500, description="Status change remarks")
    assigned_to: Optional[str] = Field(None, max_length=100, description="Officer assigned to the complaint")

    @field_validator("remarks", mode="before")
    @classmethod
    def sanitize_remarks(cls, v: Any) -> Any:
        if isinstance(v, str):
            return sanitize_html(v)
        return v

    class Config:
        use_enum_values = True


# ── Response Schemas ─────────────────────────────────────────────────────────


class ComplaintResponse(BaseModel):
    """Schema for complaint data returned to the client."""
    id: str
    title: str
    description: str
    category: str
    priority: str
    status: str = ComplaintStatus.SUBMITTED
    location: Optional[str] = None
    citizen_name: Optional[str] = None
    citizen_contact: Optional[str] = None
    assigned_to: Optional[str] = None
    remarks: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PaginatedComplaintsResponse(BaseModel):
    """Schema for paginated complaint list response."""
    total: int
    page: int
    page_size: int
    data: list[ComplaintResponse]


class DashboardStatsResponse(BaseModel):
    """Schema for dashboard statistics."""
    total: int
    resolved: int
    pending: int
    in_progress: int
    by_status: dict[str, int] = {}
    by_category: dict[str, int] = {}
    by_priority: dict[str, int] = {}


class ResolutionEstimateResponse(BaseModel):
    """Schema for resolution time estimate."""
    complaint_id: str
    estimate: str
    reasons: list[str] = []
    disclaimer: str = "This is only an estimate based on complaint details. It is not a guarantee."


class MessageResponse(BaseModel):
    """Simple message response."""
    message: str

