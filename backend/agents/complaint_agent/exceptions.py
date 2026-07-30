"""
Complaint Agent — Custom Exceptions
All HTTP exceptions used across the complaint module.
"""

from fastapi import HTTPException, status


class ComplaintNotFoundError(HTTPException):
    def __init__(self, complaint_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint '{complaint_id}' not found.",
        )


class ComplaintAlreadyClosedError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Complaint is already closed or rejected.",
        )


class InvalidStatusTransitionError(HTTPException):
    def __init__(self, current: str, target: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Cannot transition from '{current}' to '{target}'.",
        )


class UnauthorizedComplaintAccessError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to access this complaint.",
        )


class ComplaintExportError(HTTPException):
    def __init__(self, detail: str = "Failed to export complaints."):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
        )


class ComplaintSearchEmptyError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query must not be empty.",
        )


class ComplaintValidationError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail,
        )
