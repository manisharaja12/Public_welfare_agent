from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field
from enum import Enum


class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"


class Category(str, Enum):
    general = "General"
    sc = "SC"
    st = "ST"
    obc = "OBC"
    ews = "EWS"


class CitizenType(str, Enum):
    student = "Student"
    farmer = "Farmer"
    woman = "Woman"
    senior_citizen = "Senior Citizen"
    entrepreneur = "Entrepreneur"
    unemployed = "Unemployed"
    salaried = "Salaried"
    self_employed = "Self Employed"
    differently_abled = "Differently Abled"
    bpl = "BPL"


class EducationLevel(str, Enum):
    no_education = "No Education"
    primary = "Primary"
    secondary = "Secondary"
    higher_secondary = "Higher Secondary"
    graduate = "Graduate"
    post_graduate = "Post Graduate"
    doctorate = "Doctorate"


class CitizenProfileModel(BaseModel):
    id: Optional[str] = None
    user_id: str
    name: str
    age: int
    gender: Gender
    state: str
    district: str
    annual_income: float
    occupation: str
    education: EducationLevel
    is_disabled: bool = False
    disability_percentage: Optional[int] = None
    category: Category
    citizen_types: list[CitizenType] = []
    aadhaar_verified: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
