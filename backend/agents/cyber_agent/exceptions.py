from fastapi import HTTPException, status


class CyberSafetyError(HTTPException):
    """Base exception for Cyber Safety agent errors."""


class InvalidURLError(CyberSafetyError):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The provided URL is not valid.",
        )


class EmptyInputError(CyberSafetyError):
    def __init__(self, field: str = "input"):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"'{field}' must not be empty.",
        )


class ScanHistoryNotFoundError(CyberSafetyError):
    def __init__(self, scan_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scan record '{scan_id}' not found.",
        )


class BreachCheckError(CyberSafetyError):
    def __init__(self, detail: str = "Breach check failed."):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail,
        )


class InvalidEmailError(CyberSafetyError):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The provided email address is not valid.",
        )
