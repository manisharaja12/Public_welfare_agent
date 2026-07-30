from enum import Enum


class ThreatLevel(str, Enum):
    SAFE = "Safe"
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class PasswordStrength(str, Enum):
    VERY_WEAK = "Very Weak"
    WEAK = "Weak"
    FAIR = "Fair"
    STRONG = "Strong"
    VERY_STRONG = "Very Strong"


class ScamType(str, Enum):
    PHISHING = "Phishing"
    LOTTERY = "Lottery"
    IMPERSONATION = "Impersonation"
    FINANCIAL_FRAUD = "Financial Fraud"
    JOB_SCAM = "Job Scam"
    ROMANCE_SCAM = "Romance Scam"
    TECH_SUPPORT = "Tech Support"
    UNKNOWN = "Unknown"
    NONE = "None"


class ScanChannel(str, Enum):
    SMS = "SMS"
    EMAIL = "Email"
    WHATSAPP = "WhatsApp"


HISTORY_PAGE_SIZE_DEFAULT = 10
HISTORY_PAGE_SIZE_MAX = 100

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS = 30
RATE_LIMIT_WINDOW_SECONDS = 60

# Cache TTL (seconds)
CACHE_TTL_TIPS = 3600
CACHE_TTL_CATEGORIES = 7200
CACHE_TTL_THREATS = 7200
CACHE_TTL_DAILY_TIP = 300
