from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from agents.complaint_agent.routes import router as complaint_router
from agents.cyber_agent.routes import router as cyber_router, legacy_router as cyber_legacy_router

app = FastAPI(
    title="AI Public Welfare Multi-Agent System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    complaint_router,
    prefix="/complaints",
    tags=["Complaint Agent"]
)

app.include_router(cyber_router)
app.include_router(cyber_legacy_router)

@app.get("/")
def root():
    return {
        "status": "success",
        "message": "Backend is running"
    }
