"""
Rule-based + weighted eligibility scoring engine.
Each criterion contributes a weight; the final score is 0.0–1.0.
"""
from typing import Optional


EDUCATION_RANK = {
    "No Education": 0,
    "Primary": 1,
    "Secondary": 2,
    "Higher Secondary": 3,
    "Graduate": 4,
    "Post Graduate": 5,
    "Doctorate": 6,
}


def compute_eligibility(profile: dict, criteria: dict) -> tuple[float, list[str], list[str]]:
    """
    Returns (score, matched_criteria, unmatched_criteria).
    score is between 0.0 and 1.0.
    """
    checks: list[tuple[str, bool, float]] = []   # (label, passed, weight)

    # Age
    min_age = criteria.get("min_age")
    max_age = criteria.get("max_age")
    age = profile.get("age", 0)
    if min_age is not None or max_age is not None:
        lo = min_age or 0
        hi = max_age or 150
        passed = lo <= age <= hi
        checks.append((f"Age {lo}–{hi} years", passed, 1.5))

    # Gender
    allowed_genders = criteria.get("gender")
    if allowed_genders:
        passed = profile.get("gender", "").lower() in [g.lower() for g in allowed_genders]
        checks.append((f"Gender: {'/'.join(allowed_genders)}", passed, 1.2))

    # Income
    max_income = criteria.get("max_annual_income")
    if max_income is not None:
        passed = profile.get("annual_income", 0) <= max_income
        checks.append((f"Annual income ≤ ₹{max_income:,.0f}", passed, 2.0))

    # Category
    allowed_cats = criteria.get("categories")
    if allowed_cats:
        passed = profile.get("category", "") in allowed_cats
        checks.append((f"Category: {'/'.join(allowed_cats)}", passed, 1.5))

    # Citizen types
    allowed_types = criteria.get("citizen_types")
    if allowed_types:
        profile_types = set(profile.get("citizen_types", []))
        passed = bool(profile_types & set(allowed_types))
        checks.append((f"Citizen type: {'/'.join(allowed_types)}", passed, 1.5))

    # State
    allowed_states = criteria.get("states")
    if allowed_states:
        passed = profile.get("state", "") in allowed_states
        checks.append((f"State: {'/'.join(allowed_states)}", passed, 1.0))

    # Education
    min_edu = criteria.get("min_education")
    if min_edu:
        profile_rank = EDUCATION_RANK.get(profile.get("education", "No Education"), 0)
        required_rank = EDUCATION_RANK.get(min_edu, 0)
        passed = profile_rank >= required_rank
        checks.append((f"Education ≥ {min_edu}", passed, 1.0))

    # Disability
    req_disability = criteria.get("requires_disability")
    if req_disability is not None:
        passed = profile.get("is_disabled", False) == req_disability
        checks.append(("Disability status", passed, 1.0))

    # Occupation
    allowed_occupations = criteria.get("occupation_types")
    if allowed_occupations:
        passed = profile.get("occupation", "").lower() in [o.lower() for o in allowed_occupations]
        checks.append((f"Occupation: {'/'.join(allowed_occupations)}", passed, 1.0))

    if not checks:
        return 1.0, ["Open to all citizens"], []

    total_weight = sum(w for _, _, w in checks)
    earned_weight = sum(w for _, passed, w in checks if passed)
    score = round(earned_weight / total_weight, 4) if total_weight else 0.0

    matched = [label for label, passed, _ in checks if passed]
    unmatched = [label for label, passed, _ in checks if not passed]
    return score, matched, unmatched
