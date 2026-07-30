import logging
import os
import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import HTTPException, UploadFile
from app.core.database import get_db, HOUSES_COL
from app.core.config import settings
from app.schemas.house import HouseRegisterRequest, HouseSearchRequest
from app.utils.helpers import doc_to_dict, to_object_id

logger = logging.getLogger(__name__)


async def register_house(data: HouseRegisterRequest, owner_id: str, images: list[UploadFile]) -> dict:
    db = get_db()
    image_paths = []
    for img in images:
        if img.filename:
            ext = img.filename.rsplit(".", 1)[-1]
            filename = f"{uuid.uuid4()}.{ext}"
            save_path = os.path.join(settings.UPLOAD_DIR, filename)
            os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
            content = await img.read()
            with open(save_path, "wb") as f:
                f.write(content)
            image_paths.append(f"/uploads/{filename}")

    doc = {
        **data.model_dump(),
        "owner_id": owner_id,
        "images": image_paths,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    result = await db[HOUSES_COL].insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc_to_dict(doc)


async def get_all_houses() -> list:
    db = get_db()
    cursor = db[HOUSES_COL].find({"is_active": True}).sort("created_at", -1)
    return [doc_to_dict(d) async for d in cursor]


async def get_house_by_id(house_id: str) -> dict:
    db = get_db()
    doc = await db[HOUSES_COL].find_one({"_id": to_object_id(house_id), "is_active": True})
    if not doc:
        raise HTTPException(status_code=404, detail="Property not found")
    return doc_to_dict(doc)


async def search_houses(filters: HouseSearchRequest) -> list:
    db = get_db()
    query: dict = {"is_active": True}

    if filters.state:
        query["state"] = {"$regex": filters.state, "$options": "i"}
    if filters.district:
        query["district"] = {"$regex": filters.district, "$options": "i"}
    if filters.city:
        query["city"] = {"$regex": filters.city, "$options": "i"}
    if filters.area:
        query["area"] = {"$regex": filters.area, "$options": "i"}
    if filters.house_type:
        query["house_type"] = filters.house_type
    if filters.min_budget is not None or filters.max_budget is not None:
        rent_filter = {}
        if filters.min_budget is not None:
            rent_filter["$gte"] = filters.min_budget
        if filters.max_budget is not None:
            rent_filter["$lte"] = filters.max_budget
        query["monthly_rent"] = rent_filter

    cursor = db[HOUSES_COL].find(query).sort("created_at", -1)
    return [doc_to_dict(d) async for d in cursor]


async def get_dashboard() -> dict:
    db = get_db()
    total = await db[HOUSES_COL].count_documents({"is_active": True})
    total_pg = await db[HOUSES_COL].count_documents({"is_active": True, "house_type": "PG"})
    total_hostel = await db[HOUSES_COL].count_documents({"is_active": True, "house_type": "Hostel"})
    total_houses = await db[HOUSES_COL].count_documents({"is_active": True, "house_type": {"$in": ["House", "Apartment", "Villa"]}})

    recent_cursor = db[HOUSES_COL].find({"is_active": True}).sort("created_at", -1).limit(6)
    recent = [doc_to_dict(d) async for d in recent_cursor]

    return {
        "total_properties": total,
        "total_houses": total_houses,
        "total_pgs": total_pg,
        "total_hostels": total_hostel,
        "recently_added": recent,
    }
