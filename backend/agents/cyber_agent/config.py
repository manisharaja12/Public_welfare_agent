from pydantic_settings import BaseSettings


class CyberSettings(BaseSettings):
    MONGODB_URI: str = "mongodb://localhost:27017"  # TODO: Replace with MongoDB Atlas URI
    DB_NAME: str = "public_welfare"
    SCAN_HISTORY_COLLECTION: str = "cyber_scan_history"
    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    GEMINI_API_KEY: str = ""  # TODO: Set Gemini API key in .env

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = CyberSettings()
