"""
Placeholder repository layer for Cyber Agent.
TODO: Replace all in-memory operations with MongoDB Atlas (Motor async driver).
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Optional

# TODO: Replace with Motor AsyncIOMotorClient connected to MongoDB Atlas
_history: dict[str, dict] = {}
_activity_log: list[dict] = []
_error_log: list[dict] = []
_MAX_ACTIVITY_LOG = 500


def _now() -> datetime:
    return datetime.now(timezone.utc)


def db_save_scan(scan_type: str, input_data: str, result: dict) -> dict:
    """TODO: await collection.insert_one(record)"""
    scan_id = str(uuid.uuid4())
    record = {
        "id": scan_id,
        "scan_type": scan_type,
        "input": input_data,
        "result": result,
        "created_at": _now(),
    }
    _history[scan_id] = record
    db_log_activity(scan_type, input_data[:50], "completed")
    return record


def db_get_history(scan_type: str | None, skip: int, limit: int) -> tuple[list[dict], int]:
    """TODO: await collection.find(filter).skip(skip).limit(limit)"""
    results = [
        h for h in _history.values()
        if scan_type is None or h["scan_type"] == scan_type
    ]
    results.sort(key=lambda x: x["created_at"], reverse=True)
    return results[skip: skip + limit], len(results)


def db_dashboard_stats() -> dict:
    """TODO: Use MongoDB aggregation pipeline."""
    all_scans = list(_history.values())
    by_type: dict[str, int] = {}
    for s in all_scans:
        by_type[s["scan_type"]] = by_type.get(s["scan_type"], 0) + 1
    return {"total_scans": len(all_scans), "by_type": by_type}


# ── Activity Logging ─────────────────────────────────────────────────────────

def db_log_activity(action: str, detail: str, status: str = "completed") -> dict:
    """Log user activity for history tracking."""
    record = {
        "id": str(uuid.uuid4()),
        "action": action,
        "detail": detail,
        "status": status,
        "created_at": _now().isoformat(),
    }
    _activity_log.append(record)
    # Trim old entries
    if len(_activity_log) > _MAX_ACTIVITY_LOG:
        _activity_log[:] = _activity_log[-_MAX_ACTIVITY_LOG:]
    return record


def db_get_activity_log(limit: int = 20) -> list[dict]:
    """Get recent activity log entries."""
    return list(reversed(_activity_log[-limit:]))


def db_log_error(endpoint: str, error: str, detail: Optional[str] = None) -> None:
    """Log backend errors for debugging."""
    _error_log.append({
        "id": str(uuid.uuid4()),
        "endpoint": endpoint,
        "error": error,
        "detail": detail,
        "created_at": _now().isoformat(),
    })
    if len(_error_log) > 100:
        _error_log[:] = _error_log[-100:]
