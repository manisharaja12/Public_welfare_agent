from fastapi import APIRouter, Depends
from app.schemas.scheme import RecommendRequest, RecommendationResponse
from app.services.recommendation_service import generate_recommendations, get_recommendation_history
from app.core.security import get_current_user

router = APIRouter(prefix="/api", tags=["Recommendations"])


@router.post("/recommend", response_model=RecommendationResponse)
async def recommend(
    body: RecommendRequest = RecommendRequest(),
    current_user: dict = Depends(get_current_user),
):
    """
    Generate AI-powered scheme recommendations based on citizen profile.
    Results are cached; use force_refresh=true to regenerate.
    """
    result = await generate_recommendations(current_user["id"], body.force_refresh)
    return {
        "recommendation_id": result["id"],
        "total_schemes": result["total_schemes"],
        "recommendations": result["recommendations"],
        "generated_at": result["created_at"],
    }


@router.get("/history")
async def history(current_user: dict = Depends(get_current_user)):
    """Get recommendation history for the current user."""
    return await get_recommendation_history(current_user["id"])
