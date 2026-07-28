import logging
from datetime import datetime, timezone
from typing import Optional
from fastapi import HTTPException, status
from bson import ObjectId

from app.core.database import get_db, SCHEMES_COL
from app.utils.helpers import doc_to_dict, to_object_id, slugify

logger = logging.getLogger(__name__)


async def create_scheme(data: dict, admin_id: str) -> dict:
    db = get_db()
    if await db[SCHEMES_COL].find_one({"slug": data["slug"]}):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Scheme with this slug already exists")

    doc = {
        **data,
        "is_active": True,
        "created_by": admin_id,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    result = await db[SCHEMES_COL].insert_one(doc)
    doc["_id"] = result.inserted_id
    logger.info("Scheme created: %s by admin %s", data["name"], admin_id)
    return doc_to_dict(doc)


async def update_scheme(scheme_id: str, data: dict, admin_id: str) -> dict:
    db = get_db()
    update_data = {k: v for k, v in data.items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)

    result = await db[SCHEMES_COL].find_one_and_update(
        {"_id": to_object_id(scheme_id)},
        {"$set": update_data},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scheme not found")
    logger.info("Scheme %s updated by admin %s", scheme_id, admin_id)
    return doc_to_dict(result)


async def delete_scheme(scheme_id: str, admin_id: str) -> None:
    db = get_db()
    result = await db[SCHEMES_COL].delete_one({"_id": to_object_id(scheme_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scheme not found")
    logger.info("Scheme %s deleted by admin %s", scheme_id, admin_id)


async def get_scheme_by_id(scheme_id: str) -> dict:
    db = get_db()
    doc = await db[SCHEMES_COL].find_one({"_id": to_object_id(scheme_id), "is_active": True})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scheme not found")
    return doc_to_dict(doc)


async def list_schemes(
    page: int = 1,
    page_size: int = 20,
    category: Optional[str] = None,
    state: Optional[str] = None,
    is_central: Optional[bool] = None,
    active_only: bool = True,
) -> dict:
    db = get_db()
    query: dict = {}
    if active_only:
        query["is_active"] = True
    if category:
        query["category"] = category
    if state:
        query["$or"] = [{"state": state}, {"state": None}]
    if is_central is not None:
        query["is_central"] = is_central

    total = await db[SCHEMES_COL].count_documents(query)
    skip = (page - 1) * page_size
    cursor = db[SCHEMES_COL].find(query).skip(skip).limit(page_size).sort("name", 1)
    schemes = [doc_to_dict(doc) async for doc in cursor]
    return {"total": total, "page": page, "page_size": page_size, "schemes": schemes}


async def search_schemes(query_text: str, page: int = 1, page_size: int = 20) -> dict:
    db = get_db()
    query = {
        "$text": {"$search": query_text},
        "is_active": True,
    }
    total = await db[SCHEMES_COL].count_documents(query)
    skip = (page - 1) * page_size
    cursor = (
        db[SCHEMES_COL]
        .find(query, {"score": {"$meta": "textScore"}})
        .sort([("score", {"$meta": "textScore"})])
        .skip(skip)
        .limit(page_size)
    )
    schemes = [doc_to_dict(doc) async for doc in cursor]
    return {"total": total, "page": page, "page_size": page_size, "schemes": schemes}


async def get_all_active_schemes() -> list[dict]:
    """Fetch all active schemes for recommendation engine."""
    db = get_db()
    cursor = db[SCHEMES_COL].find({"is_active": True})
    return [doc_to_dict(doc) async for doc in cursor]
