import re
from fastapi import HTTPException, status

from .exceptions import InvalidEmailError

_URL_RE = re.compile(
    r"^(https?://)?"
    r"(([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,})"
    r"(:\d+)?"
    r"(/[^\s]*)?$"
)

_EMAIL_RE = re.compile(
    r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
)


def validate_url(url: str) -> str:
    url = url.strip()
    if not _URL_RE.match(url):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid URL format.",
        )
    return url


def validate_email(email: str) -> str:
    """Validate and return a sanitized email address."""
    email = email.strip().lower()
    if not _EMAIL_RE.match(email):
        raise InvalidEmailError()
    return email


def validate_non_empty(value: str, field: str = "input") -> str:
    if not value.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"'{field}' must not be empty.",
        )
    return value.strip()


def validate_page_params(page: int, page_size: int, max_size: int = 100) -> tuple[int, int]:
    if page < 1:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="page must be >= 1.")
    if not (1 <= page_size <= max_size):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"page_size must be between 1 and {max_size}.",
        )
    return page, page_size
