from sqlalchemy import Column, Integer, String, ForeignKey, Date, Float, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base
import datetime


class PersonalRecord(Base):
    __tablename__ = "personal_records"

    id = Column(Integer, primary_key=True, index=True)
    athlete_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    reps = Column(Integer, nullable=False)
    weight = Column(Float, nullable=False)
    date_achieved = Column(Date, nullable=False, default=datetime.date.today)
    workout_log_id = Column(Integer, ForeignKey(
        "workout_logs.id"), nullable=True)

    # Relationships
    athlete = relationship("User", back_populates="personal_records")
    exercise = relationship("Exercise", back_populates="personal_records")
    workout_log = relationship("WorkoutLog", back_populates="personal_records")

    __table_args__ = (UniqueConstraint(
        'athlete_id', 'exercise_id', 'reps', name='uq_athlete_exercise_reps'),)
