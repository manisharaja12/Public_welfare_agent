from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="Donation Agent",
    version="1.0.0",
    description="Donation Agent — Part of the Public Welfare Multi-Agent System",
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
    return {"status": "healthy", "service": "Donation Agent", "version": "1.0.0"}


@app.get("/", tags=["Health"])
async def root():
    return {"message": "Welcome to Donation Agent", "docs": "/docs"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8005)
