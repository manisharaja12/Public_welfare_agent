import logging
from datetime import datetime, timezone, timedelta

from app.core.database import get_db, USERS_COL, PROFILES_COL, SCHEMES_COL, RECOMMENDATIONS_COL, SAVED_SCHEMES_COL, NOTIFICATIONS_COL, ADMIN_LOGS_COL

logger = logging.getLogger(__name__)


async def get_all_users(page: int = 1, page_size: int = 20) -> dict:
    db = get_db()
    total = await db[USERS_COL].count_documents({})
    skip = (page - 1) * page_size
    cursor = db[USERS_COL].find({}, {"hashed_password": 0}).skip(skip).limit(page_size).sort("created_at", -1)
    users = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        if "created_at" in doc:
            doc["created_at"] = doc["created_at"].isoformat()
        users.append(doc)
    return {"total": total, "page": page, "page_size": page_size, "users": users}


async def get_analytics() -> dict:
    db = get_db()
    now = datetime.now(timezone.utc)
    last_30 = now - timedelta(days=30)

    total_users = await db[USERS_COL].count_documents({})
    active_users = await db[USERS_COL].count_documents({"is_active": True})
    total_schemes = await db[SCHEMES_COL].count_documents({"is_active": True})
    total_recommendations = await db[RECOMMENDATIONS_COL].count_documents({})
    total_saved = await db[SAVED_SCHEMES_COL].count_documents({})
    new_users_30d = await db[USERS_COL].count_documents({"created_at": {"$gte": last_30}})
    recommendations_30d = await db[RECOMMENDATIONS_COL].count_documents({"created_at": {"$gte": last_30}})

    # Scheme category distribution
    pipeline = [
        {"$match": {"is_active": True}},
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    category_dist = []
    async for doc in db[SCHEMES_COL].aggregate(pipeline):
        category_dist.append({"category": doc["_id"], "count": doc["count"]})

    # Top saved schemes
    top_saved_pipeline = [
        {"$group": {"_id": "$scheme_id", "scheme_name": {"$first": "$scheme_name"}, "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5},
    ]
    top_saved = []
    async for doc in db[SAVED_SCHEMES_COL].aggregate(top_saved_pipeline):
        top_saved.append({"scheme_id": doc["_id"], "scheme_name": doc["scheme_name"], "saves": doc["count"]})

    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_schemes": total_schemes,
        "total_recommendations": total_recommendations,
        "total_saved_schemes": total_saved,
        "new_users_last_30_days": new_users_30d,
        "recommendations_last_30_days": recommendations_30d,
        "scheme_category_distribution": category_dist,
        "top_saved_schemes": top_saved,
        "generated_at": now.isoformat(),
    }


async def log_admin_action(admin_id: str, action: str, target: str, details: dict = {}) -> None:
    db = get_db()
    await db[ADMIN_LOGS_COL].insert_one({
        "admin_id": admin_id,
        "action": action,
        "target": target,
        "details": details,
        "timestamp": datetime.now(timezone.utc),
    })
