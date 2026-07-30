from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from .constants import ComplaintCategory, ComplaintPriority, ComplaintStatus


class ComplaintModel(BaseModel):
    id: str
    title: str
    description: str
    category: ComplaintCategory
    priority: ComplaintPriority
    status: ComplaintStatus = ComplaintStatus.SUBMITTED
    location: Optional[str] = None
    citizen_name: Optional[str] = None
    citizen_contact: Optional[str] = None
    assigned_to: Optional[str] = None
    remarks: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        use_enum_values = True
