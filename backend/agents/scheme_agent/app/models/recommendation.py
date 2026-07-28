from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field


class RecommendedScheme(BaseModel):
    scheme_id: str
    scheme_name: str
    eligibility_score: float          # 0.0 – 1.0
    eligibility_explanation: str      # Gemini-generated
    benefits: list[str]
    required_documents: list[str]
    application_process: list[str]
    official_website: Optional[str]
    apply_link: Optional[str]
    last_date: Optional[str]
    category: str
    ministry: str


class RecommendationModel(BaseModel):
    id: Optional[str] = None
    user_id: str
    profile_snapshot: dict             # profile at time of recommendation
    recommendations: list[RecommendedScheme]
    total_schemes: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SavedSchemeModel(BaseModel):
    id: Optional[str] = None
    user_id: str
    scheme_id: str
    scheme_name: str
    saved_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class NotificationModel(BaseModel):
    id: Optional[str] = None
    user_id: str
    title: str
    message: str
    type: str = "info"                 # info | success | warning | alert
    is_read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
