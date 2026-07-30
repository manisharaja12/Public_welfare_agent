import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

logger = logging.getLogger(__name__)

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None

# ── Collection name constants ──────────────────────────────────
HOUSES_COL = "houses"
USERS_COL  = "housing_users"


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
    await db[HOUSES_COL].create_index([("city", 1), ("district", 1), ("state", 1)])
    await db[HOUSES_COL].create_index("house_type")
    await db[HOUSES_COL].create_index("is_active")
    await db[HOUSES_COL].create_index("created_at")
    logger.info("MongoDB indexes ensured")
