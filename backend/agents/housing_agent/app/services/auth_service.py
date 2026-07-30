import logging
import hashlib
import os
from datetime import datetime, timezone
from fastapi import HTTPException
from bson import ObjectId
from app.core.database import get_db, USERS_COL
from app.core.security import create_access_token, create_refresh_token
from app.utils.helpers import doc_to_dict

logger = logging.getLogger(__name__)


def hash_password(plain):
    salt = os.urandom(32)
    key = hashlib.pbkdf2_hmac("sha256", plain.encode(), salt, 100000)
    return salt.hex() + ":" + key.hex()


def verify_password(plain, hashed):
    try:
        salt_hex, key_hex = hashed.split(":")
        key = hashlib.pbkdf2_hmac("sha256", plain.encode(), bytes.fromhex(salt_hex), 100000)
        return key.hex() == key_hex
    except Exception:
        return False


async def register_user(name, email, password, role, mobile):
    db = get_db()
    if await db[USERS_COL].find_one({"email": email}):
        raise HTTPException(status_code=409, detail="Email already registered")
    result = await db[USERS_COL].insert_one({
        "name": name, "email": email, "mobile": mobile,
        "hashed_password": hash_password(password),
        "role": role, "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    })
    user_id = str(result.inserted_id)
    return {
        "access_token": create_access_token(user_id, {"role": role}),
        "refresh_token": create_refresh_token(user_id),
        "user_id": user_id, "name": name, "email": email, "role": role,
    }


async def login_user(email, password):
    db = get_db()
    user = await db[USERS_COL].find_one({"email": email})
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account is deactivated")
    user_id = str(user["_id"])
    role = user.get("role", "user")
    return {
        "access_token": create_access_token(user_id, {"role": role}),
        "refresh_token": create_refresh_token(user_id),
        "user_id": user_id, "name": user["name"], "email": user["email"], "role": role,
    }


async def get_user_by_id(user_id):
    db = get_db()
    try:
        doc = await db[USERS_COL].find_one({"_id": ObjectId(user_id)})
    except Exception:
        return None
    return doc_to_dict(doc) if doc else None
