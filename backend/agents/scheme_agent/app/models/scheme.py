from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field, HttpUrl


class EligibilityCriteria(BaseModel):
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    gender: Optional[list[str]] = None          # ["male","female","other"] or None = all
    max_annual_income: Optional[float] = None
    categories: Optional[list[str]] = None      # SC/ST/OBC/General/EWS
    citizen_types: Optional[list[str]] = None   # Student/Farmer/etc.
    states: Optional[list[str]] = None          # None = all India
    min_education: Optional[str] = None
    requires_disability: Optional[bool] = None
    occupation_types: Optional[list[str]] = None


class GovernmentSchemeModel(BaseModel):
    id: Optional[str] = None
    name: str
    slug: str
    description: str
    category: str                               # Agriculture/Education/Health/Housing/etc.
    tags: list[str] = []
    ministry: str
    eligibility_criteria: EligibilityCriteria
    benefits: list[str] = []
    required_documents: list[str] = []
    application_process: list[str] = []
    official_website: Optional[str] = None
    apply_link: Optional[str] = None
    last_date: Optional[str] = None             # "31 March 2026" or "Ongoing"
    is_central: bool = True                     # Central vs State scheme
    state: Optional[str] = None                 # For state-specific schemes
    is_active: bool = True
    created_by: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
