from enum import Enum


class ComplaintCategory(str, Enum):
    ROAD_DAMAGE = "Road Damage"
    GARBAGE = "Garbage"
    WATER_LEAKAGE = "Water Leakage"
    STREET_LIGHT = "Street Light"
    DRAINAGE = "Drainage"
    ELECTRICITY = "Electricity"
    TRAFFIC = "Traffic"
    PUBLIC_PROPERTY = "Public Property"
    ILLEGAL_DUMPING = "Illegal Dumping"
    OTHER = "Other"


class ComplaintStatus(str, Enum):
    SUBMITTED = "Submitted"
    ASSIGNED = "Assigned"
    UNDER_REVIEW = "Under Review"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    CLOSED = "Closed"
    REJECTED = "Rejected"


class ComplaintPriority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


PAGE_SIZE_DEFAULT = 10
PAGE_SIZE_MAX = 100
