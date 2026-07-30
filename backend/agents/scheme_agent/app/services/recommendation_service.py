import logging
from datetime import datetime, timezone
from fastapi import HTTPException, status

from app.core.database import get_db, RECOMMENDATIONS_COL, HISTORY_COL, NOTIFICATIONS_COL
from app.services.profile_service import get_profile_raw
from app.services.scheme_service import get_all_active_schemes
from app.ai.eligibility_engine import compute_eligibility
from app.ai.gemini_client import generate_eligibility_explanation
from app.utils.helpers import doc_to_dict

logger = logging.getLogger(__name__)

MIN_SCORE_THRESHOLD = 0.30   # Only recommend schemes with score >= 30%


async def generate_recommendations(user_id: str, force_refresh: bool = False) -> dict:
    db = get_db()

    # Return cached result if available and not forced
    if not force_refresh:
        cached = await db[RECOMMENDATIONS_COL].find_one(
            {"user_id": user_id},
            sort=[("created_at", -1)],
        )
        if cached:
            logger.info("Returning cached recommendations for user %s", user_id)
            return doc_to_dict(cached)

    # Fetch profile
    profile = await get_profile_raw(user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please complete your citizen profile before requesting recommendations.",
        )

    # Fetch all active schemes
    schemes = await get_all_active_schemes()
    if not schemes:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No schemes available in database.")

    # Score each scheme
    scored: list[dict] = []
    for scheme in schemes:
        criteria = scheme.get("eligibility_criteria", {})
        score, matched, unmatched = compute_eligibility(profile, criteria)
        if score < MIN_SCORE_THRESHOLD:
            continue

        explanation = await generate_eligibility_explanation(
            scheme_name=scheme["name"],
            profile=profile,
            eligibility_score=score,
            matched_criteria=matched,
            unmatched_criteria=unmatched,
        )

        scored.append({
            "scheme_id": scheme["id"],
            "scheme_name": scheme["name"],
            "eligibility_score": score,
            "eligibility_explanation": explanation,
            "benefits": scheme.get("benefits", []),
            "required_documents": scheme.get("required_documents", []),
            "application_process": scheme.get("application_process", []),
            "official_website": scheme.get("official_website"),
            "apply_link": scheme.get("apply_link"),
            "last_date": scheme.get("last_date"),
            "category": scheme.get("category", ""),
            "ministry": scheme.get("ministry", ""),
        })

    # Sort by score descending
    scored.sort(key=lambda x: x["eligibility_score"], reverse=True)

    rec_doc = {
        "user_id": user_id,
        "profile_snapshot": profile,
        "recommendations": scored,
        "total_schemes": len(scored),
        "created_at": datetime.now(timezone.utc),
    }

    result = await db[RECOMMENDATIONS_COL].insert_one(rec_doc)
    rec_doc["_id"] = result.inserted_id

    # Save to history
    await db[HISTORY_COL].insert_one({
        "user_id": user_id,
        "recommendation_id": str(result.inserted_id),
        "total_schemes": len(scored),
        "created_at": datetime.now(timezone.utc),
    })

    # Push notification
    await db[NOTIFICATIONS_COL].insert_one({
        "user_id": user_id,
        "title": "New Scheme Recommendations Ready",
        "message": f"We found {len(scored)} government schemes matching your profile.",
        "type": "success",
        "is_read": False,
        "created_at": datetime.now(timezone.utc),
    })

    logger.info("Generated %d recommendations for user %s", len(scored), user_id)
    return doc_to_dict(rec_doc)


async def get_recommendation_history(user_id: str, limit: int = 10) -> list[dict]:
    db = get_db()
    cursor = db[HISTORY_COL].find({"user_id": user_id}).sort("created_at", -1).limit(limit)
    return [doc_to_dict(doc) async for doc in cursor]
