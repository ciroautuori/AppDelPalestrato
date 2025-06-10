from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    COACH = "coach"
    ATHLETE = "athlete"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    coach_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Relationships
    athletes = relationship("User", backref="coach", remote_side=[id])

    # Relationships for created content
    created_exercises = relationship("Exercise", back_populates="created_by")
    created_plans = relationship("Plan", back_populates="created_by")
    assigned_plans = relationship("PlanAssignment", back_populates="athlete")
    assigned_by_plans = relationship(
        "PlanAssignment", back_populates="assigned_by")
    workout_logs = relationship("WorkoutLog", back_populates="athlete")
