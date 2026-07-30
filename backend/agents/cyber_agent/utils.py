"""
Cyber Agent — Utility helpers
Rule-based analysis used by services.py until Gemini integration is added.
"""
import functools
import math
import re
import time
from collections import defaultdict
from datetime import datetime, timezone
from typing import Any, Callable, Optional

from fastapi import HTTPException, Request, status
from urllib.parse import urlparse

from .constants import RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_SECONDS


# ── Rate Limiter ─────────────────────────────────────────────────────────────

_rate_limit_store: dict[str, list[float]] = defaultdict(list)


def rate_limit(max_requests: int = RATE_LIMIT_MAX_REQUESTS, window_seconds: int = RATE_LIMIT_WINDOW_SECONDS):
    """Decorator to rate-limit endpoint calls per client IP."""
    def decorator(func: Callable):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            request: Optional[Request] = None
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            if request is None and "request" in kwargs:
                request = kwargs["request"]

            if request:
                client_ip = request.client.host if request.client else "unknown"
                now = time.time()
                window_start = now - window_seconds
                _rate_limit_store[client_ip] = [t for t in _rate_limit_store[client_ip] if t > window_start]
                if len(_rate_limit_store[client_ip]) >= max_requests:
                    raise HTTPException(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        detail="Rate limit exceeded. Please try again later.",
                    )
                _rate_limit_store[client_ip].append(now)

            return func(*args, **kwargs)
        return wrapper
    return decorator


# ── Simple In-Memory Cache ───────────────────────────────────────────────────

_cache_store: dict[str, tuple[Any, float]] = {}


def cached(ttl_seconds: int = 300):
    """Decorator to cache function results with a TTL."""
    def decorator(func: Callable):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            key = f"{func.__name__}:{str(args)}:{str(sorted(kwargs.items()))}"
            now = time.time()
            if key in _cache_store:
                result, expiry = _cache_store[key]
                if now < expiry:
                    return result
            result = func(*args, **kwargs)
            _cache_store[key] = (result, now + ttl_seconds)
            return result
        return wrapper
    return decorator


def invalidate_cache(pattern: Optional[str] = None):
    """Invalidate cache entries matching a key pattern prefix."""
    global _cache_store
    if pattern is None:
        _cache_store.clear()
    else:
        _cache_store = {k: v for k, v in _cache_store.items() if not k.startswith(pattern)}

# ── URL Analysis ─────────────────────────────────────────────────────────────

_SUSPICIOUS_KEYWORDS = [
    "login", "verify", "secure", "account", "update", "confirm",
    "banking", "paypal", "amazon", "apple", "microsoft", "support",
    "free", "prize", "winner", "click", "urgent", "password", "reset",
    "unlock", "validate", "restore", "recover", "claim", "bonus",
    "investment", "crypto", "wallet", "signin", "webscr",
]

_SUSPICIOUS_TLDS = {".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".club", ".work", ".loan", ".download", ".date"}

# Common domains targeted by typosquatters
_TYPOSQUAT_DOMAINS = {
    "google.com", "facebook.com", "youtube.com", "amazon.com",
    "paypal.com", "microsoft.com", "apple.com", "instagram.com",
    "gmail.com", "outlook.com", "netflix.com", "whatsapp.com",
    "telegram.org", "twitter.com", "linkedin.com",
}

_URL_SHORTENERS = {
    "bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly",
    "is.gd", "buff.ly", "tiny.cc", "shorturl.at", "rb.gy",
}


def _detect_typosquatting(hostname: str) -> list[str]:
    """Detect potential typosquatting of popular domains."""
    results = []
    hostname = hostname.lower()
    for domain in _TYPOSQUAT_DOMAINS:
        # Check if domain is similar but not exact
        if hostname == domain:
            continue
        # Check common typosquatting techniques
        base = domain.split(".")[0]
        tld = "." + domain.split(".")[-1]
        if base in hostname and hostname != domain:
            if hostname != f"www.{domain}":
                results.append(f"Possible typosquatting of {domain}")
    return results


def extract_url_features(url: str) -> dict:
    parsed = urlparse(url if "://" in url else f"http://{url}")
    hostname = parsed.hostname or ""
    path = parsed.path or ""
    full = url.lower()

    features = {
        "has_ip": bool(re.match(r"^\d{1,3}(\.\d{1,3}){3}$", hostname)),
        "long_url": len(url) > 75,
        "suspicious_keywords": [kw for kw in _SUSPICIOUS_KEYWORDS if kw in full],
        "suspicious_tld": any(hostname.endswith(tld) for tld in _SUSPICIOUS_TLDS),
        "has_at_symbol": "@" in url,
        "multiple_subdomains": hostname.count(".") > 2,
        "uses_https": url.startswith("https://"),
        "has_redirect": "//" in path,
        "excessive_hyphens": hostname.count("-") > 2,
        "is_shortened": any(shortener in hostname for shortener in _URL_SHORTENERS),
        "typosquatting": _detect_typosquatting(hostname),
    }
    return features


# ── Password Analysis ─────────────────────────────────────────────────────────

def password_entropy(password: str) -> float:
    charset = 0
    if re.search(r"[a-z]", password):
        charset += 26
    if re.search(r"[A-Z]", password):
        charset += 26
    if re.search(r"\d", password):
        charset += 10
    if re.search(r"[^a-zA-Z0-9]", password):
        charset += 32
    return len(password) * math.log2(charset) if charset else 0


_COMMON_PASSWORDS = {
    "password", "123456", "password1", "qwerty", "abc123",
    "letmein", "monkey", "1234567890", "iloveyou", "admin",
    "welcome", "master", "sunshine", "princess", "football",
    "shadow", "trustno1", "dragon", "baseball", "ashley",
}


def is_common_password(password: str) -> bool:
    return password.lower() in _COMMON_PASSWORDS


# Keyboard walking patterns (adjacent keys on QWERTY keyboard)
_KEYBOARD_ROWS = [
    set("qwertyuiop"),
    set("asdfghjkl"),
    set("zxcvbnm"),
]

_SEQUENTIAL_CHARS = set("abcdefghijklmnopqrstuvwxyz")


def _has_keyboard_pattern(password: str) -> bool:
    """Detect sequential keyboard patterns like 'qwerty' or 'asdf'."""
    lower = password.lower()
    for min_len in (4, 5, 6):
        for i in range(len(lower) - min_len + 1):
            segment = lower[i:i + min_len]
            for row in _KEYBOARD_ROWS:
                if all(c in row for c in segment):
                    return True
            # Check reverse keyboard patterns too
            for row in _KEYBOARD_ROWS:
                if all(c in row for c in segment[::-1]):
                    return True
    return False


def _has_sequential_chars(password: str) -> bool:
    """Detect sequential characters like 'abcd' or '1234'."""
    lower = password.lower()
    for min_len in (4, 5, 6):
        for i in range(len(lower) - min_len + 1):
            segment = lower[i:i + min_len]
            if segment in _SEQUENTIAL_CHARS or segment[::-1] in _SEQUENTIAL_CHARS:
                return True
            if segment.isdigit():
                nums = [int(c) for c in segment]
                if all(nums[j] == nums[0] + j for j in range(min_len)):
                    return True
                if all(nums[j] == nums[0] - j for j in range(min_len)):
                    return True
    return False


def _has_repeated_chars(password: str) -> bool:
    """Detect repeated characters like 'aaaa' or '1111'."""
    for min_len in (3, 4):
        for i in range(len(password) - min_len + 1):
            if len(set(password[i:i + min_len])) == 1:
                return True
    return False


def analyze_password_patterns(password: str) -> list[str]:
    """Analyze a password for weak patterns. Returns list of issues found."""
    issues = []
    if _has_keyboard_pattern(password):
        issues.append("Contains a keyboard pattern (e.g. qwerty, asdf)")
    if _has_sequential_chars(password):
        issues.append("Contains sequential characters (e.g. abcd, 1234)")
    if _has_repeated_chars(password):
        issues.append("Contains repeated characters (e.g. aaaa, 1111)")
    return issues


# ── Scam Detection ────────────────────────────────────────────────────────────

_SCAM_PATTERNS: dict[str, list[str]] = {
    "Phishing": [
        "verify your account", "click here", "login", "confirm your",
        "update your details", "unlock your account", "account suspended",
        "security alert", "unusual activity", "sign in", "validate your",
        "account compromised",
    ],
    "Lottery": [
        "you have won", "congratulations", "claim your prize",
        "lottery winner", "free gift", "you are selected",
        "winning notification", "lucky winner",
    ],
    "Impersonation": [
        "irs", "police", "government", "bank of", "official notice",
        "legal notice", "court", "lawsuit", "arrest warrant",
        "tax refund", "government agency",
    ],
    "Financial Fraud": [
        "send money", "wire transfer", "bitcoin", "investment opportunity",
        "double your money", "guaranteed returns", "crypto investment",
        "pyramid scheme", "get rich quick", "no risk",
    ],
    "Job Scam": [
        "work from home", "earn per day", "no experience needed",
        "part time job", "hiring now", "registration fee",
        "processing fee", "easy money", "data entry job",
    ],
    "Tech Support": [
        "your computer", "virus detected", "call microsoft",
        "windows support", "tech support", "malware alert",
        "computer infected", "security breach detected",
    ],
    "Romance Scam": [
        "soulmate", "dating", "love", "foreign", "military",
        "deployed", "gift card", "travel to meet",
    ],
    "Social Engineering": [
        "urgent help", "family emergency", "please send",
        "can you keep", "secret", "confidential",
        "do not tell anyone", "kindly do",
    ],
}


def detect_scam_patterns(message: str) -> tuple[str, list[str], float]:
    """Returns (scam_type, highlighted_words, confidence)."""
    lower = message.lower()
    best_type = "None"
    best_hits: list[str] = []
    best_score = 0.0

    for scam_type, patterns in _SCAM_PATTERNS.items():
        hits = [p for p in patterns if p in lower]
        score = len(hits) / len(patterns)
        if score > best_score:
            best_score = score
            best_type = scam_type
            best_hits = hits

    return best_type, best_hits, round(min(best_score * 2, 1.0), 2)
