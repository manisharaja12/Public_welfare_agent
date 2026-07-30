from pydantic import BaseModel, Field
from typing import Optional, List, Literal


class HouseRegisterRequest(BaseModel):
    owner_name: str = Field(..., min_length=2, max_length=100)
    mobile: str = Field(..., min_length=10, max_length=15)
    email: str
    house_type: Literal["House", "Apartment", "Villa", "PG", "Hostel"]
    property_name: Optional[str] = None
    address: str
    area: str
    city: str
    district: str
    state: str
    pincode: str = Field(..., min_length=6, max_length=6)
    google_map_link: Optional[str] = None
    monthly_rent: float = Field(..., gt=0)
    advance_deposit: float = Field(..., ge=0)
    bedrooms: int = Field(..., ge=0)
    bathrooms: int = Field(..., ge=0)
    furnished: Literal["Furnished", "Semi-Furnished", "Unfurnished"]
    parking: bool = False
    available_from: str
    description: Optional[str] = None


class HouseSearchRequest(BaseModel):
    state: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    house_type: Optional[Literal["House", "Apartment", "Villa", "PG", "Hostel"]] = None
    min_budget: Optional[float] = None
    max_budget: Optional[float] = None
