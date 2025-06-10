from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


class WorkoutLog(Base):
    __tablename__ = "workout_logs"

    id = Column(Integer, primary_key=True, index=True)
    plan_assignment_id = Column(Integer, ForeignKey(
        "plan_assignments.id"), nullable=False)
    plan_exercise_details_id = Column(Integer, ForeignKey(
        "plan_exercise_details.id"), nullable=False)
    athlete_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date_performed = Column(DateTime, default=datetime.utcnow)
    sets_performed = Column(Integer, nullable=False)
    reps_performed_per_set = Column(
        ARRAY(Integer), nullable=False)  # e.g., [10, 9, 8]
    # e.g., ["50", "50", "55"]
    weight_used_per_set = Column(ARRAY(String), nullable=False)
    rest_taken_per_set = Column(
        ARRAY(Integer), nullable=True)  # e.g., [60, 60, 60]
    athlete_notes = Column(String)
    duration_seconds = Column(Integer)

    # Relationships
    plan_assignment = relationship(
        "PlanAssignment", back_populates="workout_logs")
    plan_exercise_details = relationship(
        "PlanExerciseDetails", back_populates="workout_logs")
    athlete = relationship("User", back_populates="workout_logs")
