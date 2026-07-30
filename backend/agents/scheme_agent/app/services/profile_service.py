import logging
from datetime import datetime, timezone
from typing import Optional
from fastapi import HTTPException, status
from bson import ObjectId

from app.core.database import get_db, PROFILES_COL
from app.utils.helpers import doc_to_dict

logger = logging.getLogger(__name__)


async def create_profile(user_id: str, data: dict) -> dict:
    db = get_db()
    if await db[PROFILES_COL].find_one({"user_id": user_id}):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Profile already exists. Use PUT to update.")

    doc = {
        **data,
        "user_id": user_id,
        "aadhaar_verified": False,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    result = await db[PROFILES_COL].insert_one(doc)
    doc["_id"] = result.inserted_id
    logger.info("Profile created for user %s", user_id)
    return doc_to_dict(doc)


async def update_profile(user_id: str, data: dict) -> dict:
    db = get_db()
    update_data = {k: v for k, v in data.items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)

    result = await db[PROFILES_COL].find_one_and_update(
        {"user_id": user_id},
        {"$set": update_data},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found. Create one first.")
    return doc_to_dict(result)


async def get_profile(user_id: str) -> dict:
    db = get_db()
    doc = await db[PROFILES_COL].find_one({"user_id": user_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return doc_to_dict(doc)


async def delete_profile(user_id: str) -> None:
    db = get_db()
    result = await db[PROFILES_COL].delete_one({"user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    logger.info("Profile deleted for user %s", user_id)


async def get_profile_raw(user_id: str) -> Optional[dict]:
    """Return raw dict without raising (used internally)."""
    db = get_db()
    doc = await db[PROFILES_COL].find_one({"user_id": user_id})
    return doc_to_dict(doc) if doc else None
