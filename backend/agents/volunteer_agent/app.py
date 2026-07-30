from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="Volunteer Agent",
    version="1.0.0",
    description="Community Volunteer Agent — Part of the Public Welfare Multi-Agent System",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy", "service": "Volunteer Agent", "version": "1.0.0"}


@app.get("/", tags=["Health"])
async def root():
    return {"message": "Welcome to Volunteer Agent", "docs": "/docs"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8004)
