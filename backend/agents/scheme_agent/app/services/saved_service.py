import logging
from datetime import datetime, timezone
from fastapi import HTTPException, status

from app.core.database import get_db, SAVED_SCHEMES_COL, NOTIFICATIONS_COL
from app.services.scheme_service import get_scheme_by_id
from app.utils.helpers import doc_to_dict, to_object_id

logger = logging.getLogger(__name__)


async def save_scheme(user_id: str, scheme_id: str) -> dict:
    db = get_db()
    scheme = await get_scheme_by_id(scheme_id)

    existing = await db[SAVED_SCHEMES_COL].find_one({"user_id": user_id, "scheme_id": scheme_id})
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Scheme already saved")

    doc = {
        "user_id": user_id,
        "scheme_id": scheme_id,
        "scheme_name": scheme["name"],
        "saved_at": datetime.now(timezone.utc),
    }
    result = await db[SAVED_SCHEMES_COL].insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc_to_dict(doc)


async def get_saved_schemes(user_id: str) -> list[dict]:
    db = get_db()
    cursor = db[SAVED_SCHEMES_COL].find({"user_id": user_id}).sort("saved_at", -1)
    return [doc_to_dict(doc) async for doc in cursor]


async def delete_saved_scheme(user_id: str, saved_id: str) -> None:
    db = get_db()
    result = await db[SAVED_SCHEMES_COL].delete_one(
        {"_id": to_object_id(saved_id), "user_id": user_id}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Saved scheme not found")


async def get_notifications(user_id: str, unread_only: bool = False) -> list[dict]:
    db = get_db()
    query: dict = {"user_id": user_id}
    if unread_only:
        query["is_read"] = False
    cursor = db[NOTIFICATIONS_COL].find(query).sort("created_at", -1).limit(50)
    docs = [doc_to_dict(doc) async for doc in cursor]

    # Mark all as read
    await db[NOTIFICATIONS_COL].update_many(
        {"user_id": user_id, "is_read": False},
        {"$set": {"is_read": True}},
    )
    return docs
