from sqlalchemy import Column, Integer, Float, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db.base_class import Base # Corrected import

class PersonalRecord(Base):
    __tablename__ = "personal_record" # Corrected table name

    id = Column(Integer, primary_key=True, index=True)
    athlete_id = Column(Integer, ForeignKey("user.id"), index=True) # Corrected ForeignKey, added index
    exercise_id = Column(Integer, ForeignKey("exercise.id"), index=True) # Corrected ForeignKey, added index
    reps = Column(Integer)
    weight = Column(Float)
    date_achieved = Column(Date) # Removed default and nullable=False
    workout_log_id = Column(Integer, ForeignKey("workoutlog.id"), index=True) # Corrected ForeignKey, added index

    athlete = relationship("User", back_populates="personal_records")
    exercise = relationship("Exercise", back_populates="personal_records")
    workout_log = relationship("WorkoutLog", back_populates="personal_records")

    __table_args__ = (
        UniqueConstraint("athlete_id", "exercise_id", "reps", name="uix_athlete_exercise_reps"), # Corrected constraint name
    )
