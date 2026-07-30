"""
JWT Security — Complaint Agent
TODO: Wire up real user lookup from MongoDB Atlas.
"""
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from .config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/complaints/token", auto_error=False)


def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    return jwt.encode({"sub": subject, "exp": expire}, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> Optional[dict]:
    """
    Dependency — returns decoded token payload or None (unauthenticated allowed for now).
    TODO: Enforce authentication once user collection is ready in MongoDB Atlas.
    """
    if token is None:
        return None
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token.")
