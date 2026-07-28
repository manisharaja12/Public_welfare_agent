from pydantic import BaseModel, Field
from typing import Optional
from app.models.profile import Gender, Category, CitizenType, EducationLevel


class ProfileCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(..., ge=1, le=120)
    gender: Gender
    state: str = Field(..., min_length=2)
    district: str = Field(..., min_length=2)
    annual_income: float = Field(..., ge=0)
    occupation: str = Field(..., min_length=2)
    education: EducationLevel
    is_disabled: bool = False
    disability_percentage: Optional[int] = Field(None, ge=0, le=100)
    category: Category
    citizen_types: list[CitizenType] = []


class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    age: Optional[int] = Field(None, ge=1, le=120)
    gender: Optional[Gender] = None
    state: Optional[str] = None
    district: Optional[str] = None
    annual_income: Optional[float] = Field(None, ge=0)
    occupation: Optional[str] = None
    education: Optional[EducationLevel] = None
    is_disabled: Optional[bool] = None
    disability_percentage: Optional[int] = Field(None, ge=0, le=100)
    category: Optional[Category] = None
    citizen_types: Optional[list[CitizenType]] = None


class ProfileResponse(BaseModel):
    id: str
    user_id: str
    name: str
    age: int
    gender: str
    state: str
    district: str
    annual_income: float
    occupation: str
    education: str
    is_disabled: bool
    disability_percentage: Optional[int]
    category: str
    citizen_types: list[str]
    aadhaar_verified: bool
    created_at: str
    updated_at: str
