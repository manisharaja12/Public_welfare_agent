from datetime import datetime
from typing import Any
from pydantic import BaseModel


class ScanRecord(BaseModel):
    id: str
    scan_type: str
    input: str
    result: dict[str, Any]
    created_at: datetime
