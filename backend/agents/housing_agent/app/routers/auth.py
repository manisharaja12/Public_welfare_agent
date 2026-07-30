import logging
import traceback
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.auth import RegisterRequest, LoginRequest, UserResponse
from app.services.auth_service import register_user, login_user
from app.core.security import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
logger = logging.getLogger(__name__)


@router.post("/register", status_code=201)
async def register(body: RegisterRequest):
    try:
        result = await register_user(body.name, body.email, body.password, body.role, body.mobile)
        return {**result, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Register error: %s", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@router.post("/login")
async def login(body: LoginRequest):
    try:
        result = await login_user(body.email, body.password)
        return {**result, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Login error: %s", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


@router.get("/me", response_model=UserResponse)
async def me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user.get("role", "user"),
        "mobile": current_user.get("mobile", ""),
        "is_active": current_user.get("is_active", True),
        "created_at": current_user.get("created_at", ""),
    }
