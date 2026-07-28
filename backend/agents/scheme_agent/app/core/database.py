import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

logger = logging.getLogger(__name__)

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None

# ── Collection name constants ──────────────────────────────────
USERS_COL         = "users"
PROFILES_COL      = "citizen_profiles"
SCHEMES_COL       = "government_schemes"
RECOMMENDATIONS_COL = "recommendations"
SAVED_SCHEMES_COL = "saved_schemes"
NOTIFICATIONS_COL = "notifications"
HISTORY_COL       = "recommendation_history"
ADMIN_LOGS_COL    = "admin_logs"


async def connect_db() -> None:
    global _client, _db
    _client = AsyncIOMotorClient(settings.MONGODB_URL)
    _db = _client[settings.MONGODB_DB_NAME]
    await _create_indexes()
    logger.info("MongoDB connected: %s / %s", settings.MONGODB_URL, settings.MONGODB_DB_NAME)


async def close_db() -> None:
    global _client
    if _client:
        _client.close()
        logger.info("MongoDB connection closed")


def get_db() -> AsyncIOMotorDatabase:
    if _db is None:
        raise RuntimeError("Database not initialised. Call connect_db() first.")
    return _db


async def _create_indexes() -> None:
    db = get_db()
    await db[USERS_COL].create_index("email", unique=True)
    await db[PROFILES_COL].create_index("user_id", unique=True)
    await db[SCHEMES_COL].create_index([("name", "text"), ("description", "text"), ("tags", "text")])
    await db[SCHEMES_COL].create_index("is_active")
    await db[SAVED_SCHEMES_COL].create_index([("user_id", 1), ("scheme_id", 1)], unique=True)
    await db[RECOMMENDATIONS_COL].create_index([("user_id", 1), ("created_at", -1)])
    await db[NOTIFICATIONS_COL].create_index([("user_id", 1), ("is_read", 1)])
    await db[HISTORY_COL].create_index([("user_id", 1), ("created_at", -1)])
    logger.info("MongoDB indexes ensured")
