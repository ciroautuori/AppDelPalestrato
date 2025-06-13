from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    muscle_group = Column(String, nullable=False)
    video_url = Column(String, nullable=True)
    created_by_user_id = Column(
        Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    created_by = relationship("User", back_populates="created_exercises")
    plan_exercise_details = relationship(
        "PlanExerciseDetails", back_populates="exercise")
    personal_records = relationship(
        "PersonalRecord", back_populates="exercise")
