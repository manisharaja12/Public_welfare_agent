from __future__ import annotations

import csv
import hashlib
import io
import logging
import re
import time
from datetime import datetime, timezone
from typing import Any, Callable, Optional

from fastapi import HTTPException, status

logger = logging.getLogger(__name__)


# ── Time ─────────────────────────────────────────────────────────────────────

def utc_now() -> datetime:
    return datetime.now(timezone.utc)


# ── Error Response Builder ───────────────────────────────────────────────────

def build_error_response(code: int, message: str) -> dict:
    return {"error": {"code": code, "message": message}}


# ── Pagination ───────────────────────────────────────────────────────────────

def paginate(items: list, page: int, page_size: int) -> dict:
    start = (page - 1) * page_size
    return {
        "total": len(items),
        "page": page,
        "page_size": page_size,
        "data": items[start: start + page_size],
    }


# ── HTML Sanitization / XSS Prevention ───────────────────────────────────────

# Strip anything that looks like an HTML/JS tag or event handler
_HTML_TAG_RE = re.compile(r"<[^>]*>", re.IGNORECASE)
_SCRIPT_RE = re.compile(r"<script[^>]*>.*?</script>", re.IGNORECASE | re.DOTALL)
_EVENT_HANDLER_RE = re.compile(r"\bon\w+\s*=\s*(['\"]).*?\1", re.IGNORECASE)
_JAVASCRIPT_PROTO_RE = re.compile(r"javascript\s*:", re.IGNORECASE)


def sanitize_html(text: str, max_length: int = 2000) -> str:
    """
    Strip malicious HTML/JS from user input to prevent XSS.
    Also truncates to max_length.
    """
    if not text:
        return ""
    # Remove entire script blocks first
    cleaned = _SCRIPT_RE.sub("", text)
    # Strip remaining HTML tags
    cleaned = _HTML_TAG_RE.sub("", cleaned)
    # Remove event handlers like onclick="..."
    cleaned = _EVENT_HANDLER_RE.sub("", cleaned)
    # Remove javascript: protocol
    cleaned = _JAVASCRIPT_PROTO_RE.sub("", cleaned)
    # Normalise whitespace
    cleaned = " ".join(cleaned.split())
    return cleaned[:max_length]


# ── CSV Export Generator ─────────────────────────────────────────────────────

def generate_csv(complaints: list[dict]) -> str:
    """
    Generate a CSV string from a list of complaint dicts.
    Returns a UTF-8 BOM-prefixed string for Excel compatibility.
    """
    if not complaints:
        return "\ufeff" + "ID,Title,Category,Priority,Status,Location,Assigned To,Created At,Updated At\n"

    output = io.StringIO()
    output.write("\ufeff")  # BOM for Excel
    writer = csv.writer(output, quoting=csv.QUOTE_ALL)

    headers = [
        "ID", "Title", "Description", "Category", "Priority", "Status",
        "Location", "Citizen Name", "Citizen Contact", "Assigned To",
        "Remarks", "Created At", "Updated At",
    ]
    writer.writerow(headers)

    date_fmt = "%d %b %Y %H:%M UTC"
    for c in complaints:
        writer.writerow([
            c.get("id", ""),
            c.get("title", ""),
            c.get("description", ""),
            c.get("category", ""),
            c.get("priority", ""),
            c.get("status", ""),
            c.get("location", ""),
            c.get("citizen_name", ""),
            c.get("citizen_contact", ""),
            c.get("assigned_to", ""),
            c.get("remarks", ""),
            c.get("created_at", "").strftime(date_fmt) if hasattr(c.get("created_at"), "strftime") else str(c.get("created_at", "")),
            c.get("updated_at", "").strftime(date_fmt) if hasattr(c.get("updated_at"), "strftime") else str(c.get("updated_at", "")),
        ])

    return output.getvalue()


def generate_json_export(complaints: list[dict]) -> list[dict]:
    """Format complaint list for JSON export (ISO datetime strings)."""
    result = []
    for c in complaints:
        item = {k: v for k, v in c.items()}
        if isinstance(item.get("created_at"), datetime):
            item["created_at"] = item["created_at"].isoformat()
        if isinstance(item.get("updated_at"), datetime):
            item["updated_at"] = item["updated_at"].isoformat()
        result.append(item)
    return result


# ── Simple TTL Cache ─────────────────────────────────────────────────────────

class TimedCache:
    """
    Thread-safe (for single-process ASGI) TTL cache.
    NOT for distributed use — fine for this single-server deployment.
    """

    def __init__(self, default_ttl: float = 30.0):
        self._default_ttl = default_ttl
        self._store: dict[str, tuple[float, Any]] = {}

    def _key(self, prefix: str, *args) -> str:
        raw = f"{prefix}:{':'.join(str(a) for a in args)}"
        return hashlib.md5(raw.encode()).hexdigest()

    def get(self, prefix: str, *args) -> Optional[Any]:
        key = self._key(prefix, *args)
        entry = self._store.get(key)
        if entry is None:
            return None
        expires_at, value = entry
        if time.monotonic() > expires_at:
            del self._store[key]
            return None
        return value

    def set(self, value: Any, prefix: str, *args, ttl: Optional[float] = None) -> None:
        key = self._key(prefix, *args)
        expires_at = time.monotonic() + (ttl if ttl is not None else self._default_ttl)
        self._store[key] = (expires_at, value)

    def invalidate(self, prefix: str, *args) -> None:
        key = self._key(prefix, *args)
        self._store.pop(key, None)

    def invalidate_all(self) -> None:
        self._store.clear()


# Shared cache instances
dashboard_cache = TimedCache(default_ttl=30.0)
analytics_cache = TimedCache(default_ttl=30.0)
