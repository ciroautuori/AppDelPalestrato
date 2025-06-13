from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, Enum, desc
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base
from app.models.pr import PersonalRecord


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
    created_nutrition_plans = relationship(
        "NutritionPlan", back_populates="created_by")

    # Plan assignments
    assigned_plans = relationship(
        "PlanAssignment",
        back_populates="athlete",
        foreign_keys="PlanAssignment.athlete_id"
    )
    assigned_by_plans = relationship(
        "PlanAssignment",
        back_populates="assigned_by",
        foreign_keys="PlanAssignment.assigned_by_coach_id"
    )

    # Nutrition plan assignments
    assigned_nutrition_plans = relationship(
        "NutritionPlanAssignment",
        back_populates="athlete",
        foreign_keys="NutritionPlanAssignment.athlete_id"
    )
    assigned_by_nutrition_plans = relationship(
        "NutritionPlanAssignment",
        back_populates="assigned_by",
        foreign_keys="NutritionPlanAssignment.assigned_by_coach_id"
    )

    workout_logs = relationship("WorkoutLog", back_populates="athlete")
    personal_records = relationship("PersonalRecord", back_populates="athlete", order_by=desc(PersonalRecord.date_achieved))
