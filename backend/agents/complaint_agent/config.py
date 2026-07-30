from pydantic_settings import BaseSettings


class ComplaintSettings(BaseSettings):
    MONGODB_URI: str = "mongodb://localhost:27017"  # TODO: Replace with MongoDB Atlas URI
    DB_NAME: str = "public_welfare"
    COLLECTION_NAME: str = "complaints"
    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = ComplaintSettings()
