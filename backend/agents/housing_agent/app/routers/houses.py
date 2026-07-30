import logging
import traceback
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from fastapi.responses import JSONResponse
from typing import Optional, List
from app.schemas.house import HouseRegisterRequest, HouseSearchRequest
from app.services.house_service import (
    register_house, get_all_houses, get_house_by_id, search_houses, get_dashboard
)
from app.core.security import get_current_user, get_optional_user

router = APIRouter(prefix="/api", tags=["Housing"])
logger = logging.getLogger(__name__)


@router.get("/housing/dashboard")
async def dashboard():
    try:
        data = await get_dashboard()
        return data
    except Exception as e:
        logger.error("Dashboard error: %s", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/houses")
async def list_houses():
    try:
        houses = await get_all_houses()
        return {"houses": houses, "total": len(houses)}
    except Exception as e:
        logger.error("List houses error: %s", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/houses/{house_id}")
async def get_house(house_id: str):
    try:
        return await get_house_by_id(house_id)
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Get house error: %s", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/houses/search")
async def search(filters: HouseSearchRequest):
    try:
        results = await search_houses(filters)
        return {"houses": results, "total": len(results)}
    except Exception as e:
        logger.error("Search error: %s", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/houses/register", status_code=201)
async def register_property(
    owner_name: str = Form(...),
    mobile: str = Form(...),
    email: str = Form(...),
    house_type: str = Form(...),
    property_name: Optional[str] = Form(None),
    address: str = Form(...),
    area: str = Form(...),
    city: str = Form(...),
    district: str = Form(...),
    state: str = Form(...),
    pincode: str = Form(...),
    google_map_link: Optional[str] = Form(None),
    monthly_rent: float = Form(...),
    advance_deposit: float = Form(...),
    bedrooms: int = Form(...),
    bathrooms: int = Form(...),
    furnished: str = Form(...),
    parking: bool = Form(False),
    available_from: str = Form(...),
    description: Optional[str] = Form(None),
    images: List[UploadFile] = File(default=[]),
    current_user: dict = Depends(get_optional_user),
):
    try:
        data = HouseRegisterRequest(
            owner_name=owner_name, mobile=mobile, email=email,
            house_type=house_type, property_name=property_name,
            address=address, area=area, city=city, district=district,
            state=state, pincode=pincode, google_map_link=google_map_link,
            monthly_rent=monthly_rent, advance_deposit=advance_deposit,
            bedrooms=bedrooms, bathrooms=bathrooms, furnished=furnished,
            parking=parking, available_from=available_from, description=description,
        )
        user_id = current_user["id"] if current_user else "guest"
        result = await register_house(data, user_id, images)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Register house error: %s", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
