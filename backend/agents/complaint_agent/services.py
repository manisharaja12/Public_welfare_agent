"""
Complaint Agent — Service Layer
All business logic lives here; routes stay thin.
"""
import logging
from typing import Any, Optional

from .constants import ComplaintStatus, ComplaintPriority, ComplaintCategory, PAGE_SIZE_DEFAULT
from .database import (
    db_create_complaint,
    db_dashboard_stats,
    db_delete_complaint,
    db_get_complaint,
    db_list_complaints,
    db_search_complaints,
    db_update_complaint,
)
from .exceptions import ComplaintAlreadyClosedError, ComplaintNotFoundError
from .schemas import (
    ComplaintCreateRequest,
    ComplaintStatusUpdateRequest,
    ComplaintUpdateRequest,
)
from .validators import validate_contact, validate_page_params, validate_search_query

logger = logging.getLogger(__name__)

_TERMINAL_STATUSES = {ComplaintStatus.CLOSED.value, ComplaintStatus.REJECTED.value}

# Timeline store — must be defined before create_complaint uses it
_timelines: dict[str, list] = {}


def _record_timeline_event(complaint_id: str, status: str, note: str = "") -> None:
    from .database import _now
    if complaint_id not in _timelines:
        _timelines[complaint_id] = []
    _timelines[complaint_id].append({
        "status": status,
        "timestamp": _now().isoformat(),
        "note": note,
    })


def create_complaint(payload: ComplaintCreateRequest) -> dict:
    validate_contact(payload.citizen_contact)
    data = payload.model_dump()
    data["status"] = ComplaintStatus.SUBMITTED.value
    record = db_create_complaint(data)
    _record_timeline_event(record["id"], ComplaintStatus.SUBMITTED.value, "Complaint submitted by citizen")
    logger.info("Complaint created: %s", record["id"])
    return record


def get_complaint(complaint_id: str) -> dict:
    record = db_get_complaint(complaint_id)
    if not record:
        raise ComplaintNotFoundError(complaint_id)
    return record


def list_complaints(
    page: int,
    page_size: int,
    status: Optional[str],
    category: Optional[str],
    priority: Optional[str],
) -> dict:
    page, page_size = validate_page_params(page, page_size)
    skip = (page - 1) * page_size
    filters: dict[str, Any] = {"status": status, "category": category, "priority": priority}
    data, total = db_list_complaints(filters, skip, page_size)
    return {"total": total, "page": page, "page_size": page_size, "data": data}


def update_complaint(complaint_id: str, payload: ComplaintUpdateRequest) -> dict:
    existing = get_complaint(complaint_id)
    if existing["status"] in _TERMINAL_STATUSES:
        raise ComplaintAlreadyClosedError()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    record = db_update_complaint(complaint_id, updates)
    logger.info("Complaint updated: %s", complaint_id)
    return record


def delete_complaint(complaint_id: str) -> bool:
    get_complaint(complaint_id)  # raises 404 if missing
    deleted = db_delete_complaint(complaint_id)
    logger.info("Complaint deleted: %s", complaint_id)
    return deleted


def update_complaint_status(payload: ComplaintStatusUpdateRequest) -> dict:
    existing = get_complaint(payload.complaint_id)
    if existing["status"] in _TERMINAL_STATUSES:
        raise ComplaintAlreadyClosedError()
    updates: dict[str, Any] = {"status": payload.status}
    if payload.remarks:
        updates["remarks"] = payload.remarks
    if payload.assigned_to:
        updates["assigned_to"] = payload.assigned_to
    record = db_update_complaint(payload.complaint_id, updates)
    _record_timeline_event(payload.complaint_id, payload.status, payload.remarks or "")
    logger.info("Complaint %s status → %s", payload.complaint_id, payload.status)
    return record


def search_complaints(query: str, page: int, page_size: int) -> dict:
    query = validate_search_query(query)
    page, page_size = validate_page_params(page, page_size)
    skip = (page - 1) * page_size
    data, total = db_search_complaints(query, skip, page_size)
    return {"total": total, "page": page, "page_size": page_size, "data": data}


def get_dashboard_stats() -> dict:
    return db_dashboard_stats()


# ── Analytics ─────────────────────────────────────────────────────────────────

def get_analytics() -> dict:
    from .database import _store
    all_c = list(_store.values())
    # Last 7 days trend
    from datetime import timedelta
    from .database import _now
    today = _now().date()
    trend = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        label = day.strftime("%d %b")
        count = sum(1 for c in all_c if c["created_at"].date() == day)
        trend.append({"day": label, "count": count})

    by_category = {}
    by_priority = {}
    by_status = {}
    resolution_times = []
    for c in all_c:
        by_category[c["category"]] = by_category.get(c["category"], 0) + 1
        by_priority[c["priority"]] = by_priority.get(c["priority"], 0) + 1
        by_status[c["status"]] = by_status.get(c["status"], 0) + 1
        if c["status"] == ComplaintStatus.RESOLVED.value:
            delta = (c["updated_at"] - c["created_at"]).days
            resolution_times.append(delta)

    avg_resolution = round(sum(resolution_times) / len(resolution_times), 1) if resolution_times else 0
    total = len(all_c)
    resolved = by_status.get(ComplaintStatus.RESOLVED.value, 0)
    resolution_rate = round((resolved / total * 100), 1) if total else 0

    return {
        "trend": trend,
        "by_category": [{"name": k, "value": v} for k, v in by_category.items()],
        "by_priority": [{"name": k, "value": v} for k, v in by_priority.items()],
        "by_status": [{"name": k, "value": v} for k, v in by_status.items()],
        "avg_resolution_days": avg_resolution,
        "resolution_rate": resolution_rate,
        "total": total,
    }


# ── AI Suggest ────────────────────────────────────────────────────────────────

_SUGGEST_RULES = [
    (["road", "pothole", "crack", "pavement", "bridge", "footpath"], "Road Damage", "High"),
    (["water", "pipe", "leak", "supply", "tap", "drainage", "flood"], "Water Leakage", "High"),
    (["light", "street light", "lamp", "dark", "bulb"], "Street Light", "Medium"),
    (["garbage", "waste", "trash", "litter", "dump", "smell", "sanitation"], "Garbage", "Medium"),
    (["electricity", "power", "outage", "wire", "electric", "voltage"], "Electricity", "High"),
    (["traffic", "signal", "jam", "accident", "speed", "parking"], "Traffic", "Medium"),
    (["property", "park", "bench", "vandal", "graffiti", "public"], "Public Property", "Low"),
    (["illegal", "dumping", "construction", "debris", "rubble"], "Illegal Dumping", "Medium"),
    (["drain", "sewer", "overflow", "blocked", "clog"], "Drainage", "High"),
]


def ai_suggest_complaint(text: str) -> dict:
    if not text or len(text.strip()) < 5:
        return {"category": "Other", "priority": "Medium", "confidence": 0.0, "reason": "Not enough text to analyse."}
    lower = text.lower()
    best_cat, best_pri, best_hits = "Other", "Medium", 0
    for keywords, cat, pri in _SUGGEST_RULES:
        hits = sum(1 for kw in keywords if kw in lower)
        if hits > best_hits:
            best_hits, best_cat, best_pri = hits, cat, pri
    confidence = min(round(best_hits / 3, 2), 1.0)
    reason = f"Detected keywords suggest '{best_cat}' with '{best_pri}' priority." if best_hits else "No strong keywords found — defaulting to Other/Medium."
    return {"category": best_cat, "priority": best_pri, "confidence": confidence, "reason": reason}


# ── Timeline ──────────────────────────────────────────────────────────────────

def get_complaint_timeline(complaint_id: str) -> dict:
    get_complaint(complaint_id)  # raises 404 if missing
    events = _timelines.get(complaint_id, [])
    if not events:
        c = get_complaint(complaint_id)
        events = [{"status": c["status"], "timestamp": c["created_at"].isoformat(), "note": "Complaint submitted"}]
    return {"complaint_id": complaint_id, "events": events}


# Resolution estimate tables — based solely on complaint fields, no external data
_PRIORITY_DAYS: dict[str, tuple[int, int]] = {
    ComplaintPriority.CRITICAL: (1, 2),
    ComplaintPriority.HIGH:     (2, 4),
    ComplaintPriority.MEDIUM:   (4, 7),
    ComplaintPriority.LOW:      (7, 14),
}

_CATEGORY_EXTRA_DAYS: dict[str, int] = {
    ComplaintCategory.ROAD_DAMAGE:     2,
    ComplaintCategory.DRAINAGE:        2,
    ComplaintCategory.WATER_LEAKAGE:   1,
    ComplaintCategory.ELECTRICITY:     1,
    ComplaintCategory.STREET_LIGHT:    1,
    ComplaintCategory.GARBAGE:         0,
    ComplaintCategory.TRAFFIC:         1,
    ComplaintCategory.PUBLIC_PROPERTY: 3,
    ComplaintCategory.ILLEGAL_DUMPING: 2,
    ComplaintCategory.OTHER:           1,
}

_TERMINAL_ESTIMATE = "This complaint has been closed and requires no further action."


def estimate_resolution(complaint_id: str) -> dict:
    """Return a resolution time estimate derived only from the complaint's own fields."""
    complaint = get_complaint(complaint_id)  # raises 404 if missing

    status = complaint.get("status", "")
    priority = complaint.get("priority", "")
    category = complaint.get("category", "")
    location = complaint.get("location") or ""

    # Terminal statuses — no estimate needed
    if status in (ComplaintStatus.RESOLVED.value, ComplaintStatus.CLOSED.value, ComplaintStatus.REJECTED.value):
        return {
            "complaint_id": complaint_id,
            "estimate": _TERMINAL_ESTIMATE,
            "reasons": [f"Complaint status is '{status}'." ],
            "disclaimer": "This is a system-generated status, not an estimate.",
        }

    # Need at least priority and category to estimate
    if not priority or not category:
        return {
            "complaint_id": complaint_id,
            "estimate": "Not enough information to estimate.",
            "reasons": ["Priority or category is missing from this complaint."],
            "disclaimer": "Provide category and priority for an estimate.",
        }

    base_low, base_high = _PRIORITY_DAYS.get(priority, (4, 7))
    extra = _CATEGORY_EXTRA_DAYS.get(category, 1)
    low  = base_low  + extra
    high = base_high + extra

    reasons: list[str] = [
        f"Priority is '{priority}' — sets the base resolution window.",
        f"Category '{category}' adds {extra} day(s) for typical field work.",
    ]
    if status in (ComplaintStatus.ASSIGNED.value, ComplaintStatus.UNDER_REVIEW.value, ComplaintStatus.IN_PROGRESS.value):
        low  = max(1, low  - 1)
        high = max(1, high - 2)
        reasons.append(f"Status '{status}' indicates work has already started — window reduced.")
    if location.strip():
        reasons.append("Location provided — helps field teams respond faster.")
    else:
        low  += 1
        high += 1
        reasons.append("No location provided — may delay field team dispatch by ~1 day.")

    return {
        "complaint_id": complaint_id,
        "estimate": f"{low}\u2013{high} days",
        "reasons": reasons,
        "disclaimer": "This is only an estimate based on complaint details. It is not a guarantee.",
    }
