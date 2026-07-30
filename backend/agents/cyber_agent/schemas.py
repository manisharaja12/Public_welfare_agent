from datetime import datetime
from typing import Any, List, Optional
from pydantic import BaseModel, Field

from .constants import PasswordStrength, ScanChannel, ScamType, ThreatLevel


# ── URL Scan ──────────────────────────────────────────────────────────────────

class URLScanRequest(BaseModel):
    url: str = Field(..., min_length=5, max_length=2048)


class URLScanResponse(BaseModel):
    url: str
    risk_score: float = Field(..., ge=0.0, le=100.0)
    threat_level: ThreatLevel
    reasons: List[str]
    recommendation: str


# ── Password Checker ──────────────────────────────────────────────────────────

class PasswordCheckRequest(BaseModel):
    password: str = Field(..., min_length=1, max_length=256)


class PasswordCheckResponse(BaseModel):
    strength: PasswordStrength
    score: int = Field(..., ge=0, le=100)
    suggestions: List[str]
    estimated_crack_time: str


# ── Scam Detection ────────────────────────────────────────────────────────────

class ScamDetectRequest(BaseModel):
    message: str = Field(..., min_length=5, max_length=5000)
    channel: ScanChannel = ScanChannel.SMS


class ScamDetectResponse(BaseModel):
    scam_type: ScamType
    confidence: float = Field(..., ge=0.0, le=1.0)
    highlighted_words: List[str]
    recommendation: str
    is_scam: bool


# ── Tips ──────────────────────────────────────────────────────────────────────

class CyberTip(BaseModel):
    id: int
    category: str
    tip: str


class TipsResponse(BaseModel):
    tips: List[CyberTip]


# ── History ───────────────────────────────────────────────────────────────────

class ScanHistoryItem(BaseModel):
    id: str
    scan_type: str
    input: str
    result: dict[str, Any]
    created_at: datetime


class PaginatedHistoryResponse(BaseModel):
    total: int
    page: int
    page_size: int
    data: List[ScanHistoryItem]


# ── Dashboard ─────────────────────────────────────────────────────────────────

class CyberDashboardResponse(BaseModel):
    total_scans: int
    by_type: dict[str, int]


# ── Categories ────────────────────────────────────────────────────────────────

class CyberCategory(BaseModel):
    id: str
    title: str
    description: str
    severity: str
    prevention_tips: List[str]
    icon: str
    filter_tag: str


class CategoriesResponse(BaseModel):
    categories: List[CyberCategory]


# ── Threats ───────────────────────────────────────────────────────────────────

class ThreatCard(BaseModel):
    id: str
    title: str
    description: str
    warning_signs: List[str]
    what_to_do: List[str]
    severity: str


class ThreatsResponse(BaseModel):
    threats: List[ThreatCard]


# ── Daily Tip ─────────────────────────────────────────────────────────────────

class DailyTipResponse(BaseModel):
    tip: str
    category: str
    day_index: int


# ── Chat ──────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=1000)


class ChatResponse(BaseModel):
    answer: str
    topic: str
    tips: List[str]


# ── Score ─────────────────────────────────────────────────────────────────────

class ScoreRequest(BaseModel):
    answers: dict[str, bool]


class ScoreResponse(BaseModel):
    score: int
    level: str
    recommendations: List[str]


# ── Breach Check ──────────────────────────────────────────────────────────────

class BreachCheckRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=320, pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")


class BreachSource(BaseModel):
    name: str
    year: int
    data_type: str


class BreachCheckResponse(BaseModel):
    email: str
    is_breached: bool
    breach_count: int = 0
    sources: List[BreachSource] = []
    recommendation: str = ""


# ── Activity Log ──────────────────────────────────────────────────────────────

class ActivityLogItem(BaseModel):
    id: str
    action: str
    detail: str
    status: str
    created_at: str


class ActivityLogResponse(BaseModel):
    activities: List[ActivityLogItem]


# ── Security Checklist ────────────────────────────────────────────────────────

class ChecklistItem(BaseModel):
    id: str
    category: str
    title: str
    description: str
    severity: str  # "Critical" | "High" | "Medium" | "Low"
    icon: str


class ChecklistResponse(BaseModel):
    checklist: List[ChecklistItem]
    total_count: int
    completed_count: int = 0
