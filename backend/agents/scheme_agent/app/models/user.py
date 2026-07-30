from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId


class UserModel(BaseModel):
    id: Optional[str] = None
    name: str
    email: EmailStr
    hashed_password: str
    role: str = "citizen"          # citizen | admin
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
