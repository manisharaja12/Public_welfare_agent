from pydantic import BaseModel, Field
from typing import Optional
from app.models.scheme import EligibilityCriteria


class SchemeCreateRequest(BaseModel):
    name: str = Field(..., min_length=3)
    slug: str = Field(..., min_length=3)
    description: str = Field(..., min_length=10)
    category: str
    tags: list[str] = []
    ministry: str
    eligibility_criteria: EligibilityCriteria
    benefits: list[str] = []
    required_documents: list[str] = []
    application_process: list[str] = []
    official_website: Optional[str] = None
    apply_link: Optional[str] = None
    last_date: Optional[str] = None
    is_central: bool = True
    state: Optional[str] = None


class SchemeUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[list[str]] = None
    ministry: Optional[str] = None
    eligibility_criteria: Optional[EligibilityCriteria] = None
    benefits: Optional[list[str]] = None
    required_documents: Optional[list[str]] = None
    application_process: Optional[list[str]] = None
    official_website: Optional[str] = None
    apply_link: Optional[str] = None
    last_date: Optional[str] = None
    is_active: Optional[bool] = None


class SchemeResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    category: str
    tags: list[str]
    ministry: str
    eligibility_criteria: dict
    benefits: list[str]
    required_documents: list[str]
    application_process: list[str]
    official_website: Optional[str]
    apply_link: Optional[str]
    last_date: Optional[str]
    is_central: bool
    state: Optional[str]
    is_active: bool
    created_at: str


class SchemeListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    schemes: list[SchemeResponse]


class RecommendRequest(BaseModel):
    force_refresh: bool = False          # bypass cache and re-run AI


class RecommendedSchemeOut(BaseModel):
    scheme_id: str
    scheme_name: str
    eligibility_score: float
    eligibility_explanation: str
    benefits: list[str]
    required_documents: list[str]
    application_process: list[str]
    official_website: Optional[str]
    apply_link: Optional[str]
    last_date: Optional[str]
    category: str
    ministry: str


class RecommendationResponse(BaseModel):
    recommendation_id: str
    total_schemes: int
    recommendations: list[RecommendedSchemeOut]
    generated_at: str


class SaveSchemeRequest(BaseModel):
    scheme_id: str


class SavedSchemeResponse(BaseModel):
    id: str
    scheme_id: str
    scheme_name: str
    saved_at: str


class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    type: str
    is_read: bool
    created_at: str
