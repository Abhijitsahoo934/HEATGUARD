from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api.v1.router import api_router
import os

# Create database tables automatically for hackathon speed
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HEATGUARD EDGE API",
    description="Decentralized Edge-AI Heat Intelligence & Municipal Command System",
    version="1.0.0"
)

# Enable CORS for Next.js frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {
        "system": "HEATGUARD EDGE",
        "status": "ONLINE",
        "tagline": "Local heat-risk screening for connected DHT22 telemetry.",
        "mode": "API",
    }

@app.get("/api/v1/health")
def health_check():
    return {
        "database": "UNKNOWN",
        "hardware_link": "NOT VERIFIED",
        "model": "NOT LOADED",
    }