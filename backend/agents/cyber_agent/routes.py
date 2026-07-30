"""
Cyber Agent — API Routes
"""
from typing import Optional

from fastapi import APIRouter, Query, status

from .constants import HISTORY_PAGE_SIZE_DEFAULT
from .schemas import (
    CyberDashboardResponse,
    PasswordCheckRequest,
    PasswordCheckResponse,
    PaginatedHistoryResponse,
    ScamDetectRequest,
    ScamDetectResponse,
    TipsResponse,
    URLScanRequest,
    URLScanResponse,
)
from .services import (
    check_breach,
    check_password,
    detect_scam,
    get_activity_log,
    get_categories,
    get_chat_answer,
    get_checklist,
    get_daily_tip,
    get_dashboard,
    get_history,
    get_security_score,
    get_threats,
    get_tips,
    scan_url,
)

router = APIRouter(prefix="/cyber-safety", tags=["Cyber Safety"])

# Keep old prefix working too
legacy_router = APIRouter(prefix="/cyber", tags=["Cyber Safety"])


from .schemas import (
    ActivityLogResponse,
    BreachCheckRequest,
    BreachCheckResponse,
    CategoriesResponse,
    ChatRequest,
    ChatResponse,
    ChecklistResponse,
    DailyTipResponse,
    ScoreRequest,
    ScoreResponse,
    ThreatsResponse,
)


@router.get("/categories", response_model=CategoriesResponse)
def categories():
    return get_categories()


@router.get("/threats", response_model=ThreatsResponse)
def threats():
    return get_threats()


@router.get("/daily-tip", response_model=DailyTipResponse)
def daily_tip():
    return get_daily_tip()


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest):
    return get_chat_answer(payload)


@router.post("/security-score", response_model=ScoreResponse)
def security_score(payload: ScoreRequest):
    return get_security_score(payload)


@router.post("/breach-check", response_model=BreachCheckResponse)
def breach_check(payload: BreachCheckRequest):
    return check_breach(payload)


@router.get("/activity-log", response_model=ActivityLogResponse)
def activity_log(limit: int = Query(20, ge=1, le=100)):
    return get_activity_log(limit)


@router.get("/checklist", response_model=ChecklistResponse)
def checklist():
    return get_checklist()


# ── Legacy /cyber routes (unchanged) ─────────────────────────────────────────

@legacy_router.post("/url-scan", response_model=URLScanResponse, status_code=status.HTTP_200_OK)
def url_scan(payload: URLScanRequest):
    return scan_url(payload)


@legacy_router.post("/password", response_model=PasswordCheckResponse, status_code=status.HTTP_200_OK)
def password_check(payload: PasswordCheckRequest):
    return check_password(payload)


@legacy_router.post("/scam", response_model=ScamDetectResponse, status_code=status.HTTP_200_OK)
def scam_detect(payload: ScamDetectRequest):
    return detect_scam(payload)


@legacy_router.get("/tips", response_model=TipsResponse)
def cyber_tips(category: Optional[str] = Query(None)):
    return get_tips(category)


@legacy_router.get("/history", response_model=PaginatedHistoryResponse)
def scan_history(
    scan_type: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(HISTORY_PAGE_SIZE_DEFAULT, ge=1, le=100),
):
    return get_history(scan_type, page, page_size)


@legacy_router.get("/dashboard", response_model=CyberDashboardResponse)
def dashboard():
    return get_dashboard()


@legacy_router.post("/breach-check", response_model=BreachCheckResponse)
def legacy_breach_check(payload: BreachCheckRequest):
    return check_breach(payload)


@legacy_router.get("/activity-log", response_model=ActivityLogResponse)
def legacy_activity_log(limit: int = Query(20, ge=1, le=100)):
    return get_activity_log(limit)


@legacy_router.get("/checklist", response_model=ChecklistResponse)
def legacy_checklist():
    return get_checklist()
