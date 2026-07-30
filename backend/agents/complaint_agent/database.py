"""
Placeholder repository layer for Complaint Agent.
TODO: Replace all in-memory operations with MongoDB Atlas (Motor async driver).
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from .constants import ComplaintStatus

# TODO: Replace with Motor AsyncIOMotorClient connected to MongoDB Atlas
_store: dict[str, dict] = {}


def _now() -> datetime:
    return datetime.now(timezone.utc)


def db_create_complaint(data: dict) -> dict:
    """TODO: await collection.insert_one(data)"""
    complaint_id = str(uuid.uuid4())
    record = {
        "assigned_to": None,
        "remarks": None,
        **data,
        "id": complaint_id,
        "created_at": _now(),
        "updated_at": _now(),
    }
    _store[complaint_id] = record
    return record


def db_get_complaint(complaint_id: str) -> dict | None:
    """TODO: await collection.find_one({"_id": ObjectId(complaint_id)})"""
    return _store.get(complaint_id)


def db_list_complaints(
    filters: dict[str, Any], skip: int, limit: int
) -> tuple[list[dict], int]:
    """TODO: await collection.find(filters).skip(skip).limit(limit), await collection.count_documents(filters)"""
    results = [
        c for c in _store.values()
        if all(c.get(k) == v for k, v in filters.items() if v is not None)
    ]
    return results[skip: skip + limit], len(results)


def db_update_complaint(complaint_id: str, data: dict) -> dict | None:
    """TODO: await collection.find_one_and_update({"_id": ObjectId(complaint_id)}, {"$set": data}, return_document=True)"""
    if complaint_id not in _store:
        return None
    _store[complaint_id].update({**data, "updated_at": _now()})
    return _store[complaint_id]


def db_delete_complaint(complaint_id: str) -> bool:
    """TODO: await collection.delete_one({"_id": ObjectId(complaint_id)})"""
    return _store.pop(complaint_id, None) is not None


def db_search_complaints(query: str, skip: int, limit: int) -> tuple[list[dict], int]:
    """TODO: await collection.find({"$text": {"$search": query}}).skip(skip).limit(limit)"""
    q = query.lower()
    results = [
        c for c in _store.values()
        if q in c.get("title", "").lower() or q in c.get("description", "").lower()
    ]
    return results[skip: skip + limit], len(results)


def db_dashboard_stats() -> dict:
    """TODO: Use MongoDB aggregation pipeline for real stats."""
    all_complaints = list(_store.values())
    total = len(all_complaints)
    by_status: dict[str, int] = {}
    by_category: dict[str, int] = {}
    by_priority: dict[str, int] = {}

    for c in all_complaints:
        by_status[c["status"]] = by_status.get(c["status"], 0) + 1
        by_category[c["category"]] = by_category.get(c["category"], 0) + 1
        by_priority[c["priority"]] = by_priority.get(c["priority"], 0) + 1

    resolved  = by_status.get(ComplaintStatus.RESOLVED.value, 0)
    pending   = by_status.get(ComplaintStatus.SUBMITTED.value, 0)
    in_progress = (
        by_status.get(ComplaintStatus.IN_PROGRESS.value, 0)
        + by_status.get(ComplaintStatus.ASSIGNED.value, 0)
        + by_status.get(ComplaintStatus.UNDER_REVIEW.value, 0)
    )
    return {
        "total": total,
        "resolved": resolved,
        "pending": pending,
        "in_progress": in_progress,
        "by_status": by_status,
        "by_category": by_category,
        "by_priority": by_priority,
    }
