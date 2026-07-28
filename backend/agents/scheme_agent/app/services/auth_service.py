import logging
from datetime import datetime, timezone
from typing import Optional
from fastapi import HTTPException, status
from passlib.context import CryptContext
from bson import ObjectId

from app.core.database import get_db, USERS_COL
from app.core.security import create_access_token, create_refresh_token
from app.utils.helpers import doc_to_dict

logger = logging.getLogger(__name__)
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    return pwd_ctx.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)


async def register_user(name: str, email: str, password: str) -> dict:
    db = get_db()
    if await db[USERS_COL].find_one({"email": email}):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    doc = {
        "name": name,
        "email": email,
        "hashed_password": hash_password(password),
        "role": "citizen",
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    result = await db[USERS_COL].insert_one(doc)
    user_id = str(result.inserted_id)
    logger.info("New user registered: %s (%s)", email, user_id)
    return {
        "access_token": create_access_token(user_id, {"role": "citizen"}),
        "refresh_token": create_refresh_token(user_id),
        "user_id": user_id,
        "name": name,
        "email": email,
        "role": "citizen",
    }


async def login_user(email: str, password: str) -> dict:
    db = get_db()
    user = await db[USERS_COL].find_one({"email": email})
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    if not user.get("is_active", True):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")

    user_id = str(user["_id"])
    return {
        "access_token": create_access_token(user_id, {"role": user.get("role", "citizen")}),
        "refresh_token": create_refresh_token(user_id),
        "user_id": user_id,
        "name": user["name"],
        "email": user["email"],
        "role": user.get("role", "citizen"),
    }


async def get_user_by_id(user_id: str) -> Optional[dict]:
    db = get_db()
    try:
        doc = await db[USERS_COL].find_one({"_id": ObjectId(user_id)})
    except Exception:
        return None
    return doc_to_dict(doc) if doc else None


async def get_user_by_email(email: str) -> Optional[dict]:
    db = get_db()
    doc = await db[USERS_COL].find_one({"email": email})
    return doc_to_dict(doc) if doc else None
