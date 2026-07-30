import logging
from typing import Optional
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger(__name__)

_model = None


def _get_model():
    global _model
    if _model is None:
        key = settings.GEMINI_API_KEY.strip()
        if not key or key == "your-google-gemini-api-key-here":
            logger.warning("GEMINI_API_KEY not set — AI explanations will use fallback text.")
            return None
        try:
            genai.configure(api_key=key)
            _model = genai.GenerativeModel(settings.GEMINI_MODEL)
        except Exception as e:
            logger.error("Failed to initialise Gemini: %s", e)
            return None
    return _model


async def generate_eligibility_explanation(
    scheme_name: str,
    profile: dict,
    eligibility_score: float,
    matched_criteria: list[str],
    unmatched_criteria: list[str],
) -> str:
    """Use Gemini to generate a human-readable eligibility explanation."""
    model = _get_model()
    if model is None:
        return _fallback_explanation(scheme_name, eligibility_score, matched_criteria, unmatched_criteria)

    prompt = f"""
You are an AI assistant for the Indian Government Public Welfare Portal.

A citizen has been evaluated for the government scheme: "{scheme_name}".

Citizen Profile:
- Age: {profile.get('age')} years
- Gender: {profile.get('gender')}
- State: {profile.get('state')}
- Annual Income: ₹{profile.get('annual_income'):,.0f}
- Category: {profile.get('category')}
- Occupation: {profile.get('occupation')}
- Education: {profile.get('education')}
- Citizen Types: {', '.join(profile.get('citizen_types', []))}
- Disability: {'Yes' if profile.get('is_disabled') else 'No'}

Eligibility Score: {eligibility_score * 100:.0f}%

Matched Criteria: {', '.join(matched_criteria) if matched_criteria else 'None'}
Unmatched Criteria: {', '.join(unmatched_criteria) if unmatched_criteria else 'None'}

Write a clear, friendly, 2-3 sentence explanation in simple English telling the citizen:
1. Whether they are eligible or partially eligible
2. Which criteria they meet
3. What they may need to qualify fully (if any)

Keep it concise, positive, and helpful. Do not use bullet points.
"""
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logger.error("Gemini API error: %s", e)
        return _fallback_explanation(scheme_name, eligibility_score, matched_criteria, unmatched_criteria)


def _fallback_explanation(
    scheme_name: str,
    score: float,
    matched: list[str],
    unmatched: list[str],
) -> str:
    pct = int(score * 100)
    if pct >= 80:
        verdict = "You are highly eligible"
    elif pct >= 50:
        verdict = "You are partially eligible"
    else:
        verdict = "You may not fully qualify"

    parts = [f"{verdict} for {scheme_name} (score: {pct}%)."]
    if matched:
        parts.append(f"You meet: {', '.join(matched)}.")
    if unmatched:
        parts.append(f"Requirements not met: {', '.join(unmatched)}.")
    return " ".join(parts)


async def generate_scheme_summary(scheme: dict) -> str:
    """Generate a short AI summary for a scheme."""
    model = _get_model()
    if model is None:
        return scheme.get("description", "")

    prompt = f"""
Summarise the following Indian government scheme in 1-2 sentences for a citizen portal.
Scheme: {scheme.get('name')}
Description: {scheme.get('description')}
Benefits: {', '.join(scheme.get('benefits', []))}
Be concise and citizen-friendly.
"""
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logger.error("Gemini summary error: %s", e)
        return scheme.get("description", "")
