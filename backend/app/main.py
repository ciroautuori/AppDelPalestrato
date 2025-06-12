from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.init_db import init_db
from app.routers import auth, users, exercises, plans, workout_logs, nutrition_plans

app = FastAPI(
    title="AppDelPalestrato",
    description="Backend API for AppDelPalestrato - A Fitness Training Management System",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(
    exercises.router, prefix="/api/v1/exercises", tags=["exercises"])
app.include_router(plans.router, prefix="/api/v1/plans", tags=["plans"])
app.include_router(workout_logs.router,
                   prefix="/api/v1/workout-logs", tags=["workout-logs"])
app.include_router(nutrition_plans.router,
                   prefix="/api/v1/nutrition-plans", tags=["nutrition-plans"])


@app.on_event("startup")
async def startup_event():
    db = next(get_db())
    init_db(db)


@app.get("/")
async def root():
    return {"message": "Welcome to AppDelPalestrato API"}
