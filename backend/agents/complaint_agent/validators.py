"""
Complaint Agent — Validators
Input validation, sanitization, and status transition rules.
"""
import re
from typing import Optional

from fastapi import HTTPException, status

from .constants import (
    ComplaintCategory,
    ComplaintPriority,
    ComplaintStatus,
)
from .utils import sanitize_html

# ── Compiled Regex Patterns ──────────────────────────────────────────────────

_PHONE_RE = re.compile(r"^\+?[\d\s\-]{7,20}$")
_LOCATION_RE = re.compile(r"^[a-zA-Z0-9\s\-,.#/]+$", re.UNICODE)
_ALPHANUMERIC_SPACE_RE = re.compile(r"^[a-zA-Z0-9\s\-_.,!?()]+$", re.UNICODE)


# ── Status Transition Validation ─────────────────────────────────────────────

# Valid status flow: Submitted -> Assigned -> Under Review -> In Progress -> Resolved -> Closed
# Rejection can happen from Submitted, Assigned, Under Review, In Progress
_VALID_TRANSITIONS: dict[str, set[str]] = {
    ComplaintStatus.SUBMITTED: {
        ComplaintStatus.ASSIGNED,
        ComplaintStatus.REJECTED,
    },
    ComplaintStatus.ASSIGNED: {
        ComplaintStatus.UNDER_REVIEW,
        ComplaintStatus.REJECTED,
    },
    ComplaintStatus.UNDER_REVIEW: {
        ComplaintStatus.IN_PROGRESS,
        ComplaintStatus.REJECTED,
    },
    ComplaintStatus.IN_PROGRESS: {
        ComplaintStatus.RESOLVED,
        ComplaintStatus.REJECTED,
    },
    ComplaintStatus.RESOLVED: {
        ComplaintStatus.CLOSED,
    },
    ComplaintStatus.CLOSED: set(),  # Terminal — no transitions allowed
    ComplaintStatus.REJECTED: set(),  # Terminal — no transitions allowed
}


def validate_status_transition(current_status: str, target_status: str) -> None:
    """
    Validate that the status transition from current to target is allowed.
    Raises HTTPException 422 if the transition is invalid.
    """
    allowed = _VALID_TRANSITIONS.get(current_status)
    if allowed is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unknown current status: '{current_status}'.",
        )
    if target_status == current_status:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Complaint is already '{current_status}'.",
        )
    if target_status not in allowed:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                f"Cannot transition from '{current_status}' to '{target_status}'. "
                f"Allowed transitions from '{current_status}': {', '.join(sorted(allowed)) or 'none (terminal status)'}."
            ),
        )


# ── Contact Validation ───────────────────────────────────────────────────────

def validate_contact(contact: Optional[str]) -> Optional[str]:
    if contact is None:
        return None
    if not _PHONE_RE.match(contact):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid contact number format. Must be 7-20 digits, optionally with +, spaces, or dashes.",
        )
    return contact.strip()


# ── Page Params Validation ───────────────────────────────────────────────────

def validate_page_params(page: int, page_size: int, max_size: int = 100) -> tuple[int, int]:
    if page < 1:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="page must be >= 1.")
    if not (1 <= page_size <= max_size):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"page_size must be between 1 and {max_size}.",
        )
    return page, page_size


# ── Search Query Validation ──────────────────────────────────────────────────

def validate_search_query(query: str) -> str:
    query = query.strip()
    if not query:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Search query must not be empty.",
        )
    if len(query) < 2:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Search query must be at least 2 characters.",
        )
    if len(query) > 200:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Search query too long (max 200 characters).",
        )
    # Sanitize search query — strip XSS
    return sanitize_html(query, max_length=200)


# ── Input Sanitization ───────────────────────────────────────────────────────

def validate_and_sanitize_title(title: str) -> str:
    """Sanitize and validate complaint title."""
    cleaned = sanitize_html(title, max_length=200)
    if not cleaned or len(cleaned) < 5:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Title must be at least 5 characters after sanitization.",
        )
    return cleaned


def validate_and_sanitize_description(description: str) -> str:
    """Sanitize and validate complaint description."""
    cleaned = sanitize_html(description, max_length=2000)
    if not cleaned or len(cleaned) < 10:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Description must be at least 10 characters after sanitization.",
        )
    return cleaned


# ── Location Validation ──────────────────────────────────────────────────────

def validate_location(location: Optional[str]) -> Optional[str]:
    """Validate and sanitize location field."""
    if location is None or not location.strip():
        return None
    cleaned = sanitize_html(location.strip(), max_length=300)
    if not _LOCATION_RE.match(cleaned):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Location contains invalid characters. Use letters, numbers, spaces, commas, or hyphens.",
        )
    return cleaned


# ── AI Suggest Input Validation ──────────────────────────────────────────────

def validate_ai_suggest_text(text: str) -> str:
    """Validate and sanitize AI suggest input."""
    if not text or not text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Text is required for AI suggestion.",
        )
    cleaned = sanitize_html(text.strip(), max_length=5000)
    if len(cleaned) < 5:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="At least 5 characters of text are needed for AI suggestion.",
        )
    return cleaned


# ── Export Format Validation ─────────────────────────────────────────────────

_VALID_EXPORT_FORMATS = {"csv", "json"}


def validate_export_format(fmt: str) -> str:
    fmt = fmt.strip().lower()
    if fmt not in _VALID_EXPORT_FORMATS:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid export format '{fmt}'. Supported: csv, json.",
        )
    return fmt
