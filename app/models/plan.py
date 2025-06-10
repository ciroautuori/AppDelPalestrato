from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from app.core.database import Base


class PlanDifficulty(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class PlanAssignmentStatus(str, enum.Enum):
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    difficulty_level = Column(Enum(PlanDifficulty), nullable=False)
    created_by_user_id = Column(
        Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    created_by = relationship("User", back_populates="created_plans")
    exercise_details = relationship(
        "PlanExerciseDetails", back_populates="plan")
    assignments = relationship("PlanAssignment", back_populates="plan")


class PlanExerciseDetails(Base):
    __tablename__ = "plan_exercise_details"

    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    sets = Column(String, nullable=False)  # e.g., "3-4"
    reps = Column(String, nullable=False)  # e.g., "8-12"
    rest_time_seconds = Column(Integer, nullable=False)
    notes_for_exercise_in_plan = Column(String)
    order_in_plan = Column(Integer, nullable=False)

    # Relationships
    plan = relationship("Plan", back_populates="exercise_details")
    exercise = relationship("Exercise", back_populates="plan_exercise_details")
    workout_logs = relationship(
        "WorkoutLog", back_populates="plan_exercise_details")


class PlanAssignment(Base):
    __tablename__ = "plan_assignments"

    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=False)
    athlete_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_by_coach_id = Column(
        Integer, ForeignKey("users.id"), nullable=False)
    assigned_date = Column(DateTime, default=datetime.utcnow)
    start_date = Column(DateTime, nullable=True)
    status = Column(Enum(PlanAssignmentStatus),
                    default=PlanAssignmentStatus.ASSIGNED)

    # Relationships
    plan = relationship("Plan", back_populates="assignments")
    athlete = relationship("User", foreign_keys=[
                           athlete_id], back_populates="assigned_plans")
    assigned_by = relationship("User", foreign_keys=[
                               assigned_by_coach_id], back_populates="assigned_by_plans")
    workout_logs = relationship("WorkoutLog", back_populates="plan_assignment")
