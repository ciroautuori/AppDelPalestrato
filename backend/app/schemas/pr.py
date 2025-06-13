from pydantic import BaseModel
from typing import Optional
import datetime

# Import Exercise for nesting in PersonalRecordRead
# Assuming Exercise schema can be used as ExerciseRead for now
from app.schemas.exercise import Exercise

class PersonalRecordBase(BaseModel):
    exercise_id: int
    reps: int
    weight: float
    date_achieved: datetime.date
    workout_log_id: Optional[int] = None

class PersonalRecordCreate(PersonalRecordBase):
    pass

class PersonalRecordUpdate(BaseModel):
    exercise_id: Optional[int] = None
    reps: Optional[int] = None
    weight: Optional[float] = None
    date_achieved: Optional[datetime.date] = None
    workout_log_id: Optional[int] = None

class PersonalRecordRead(PersonalRecordBase):
    id: int
    athlete_id: int
    exercise: Exercise # Nested exercise information, using Exercise schema

    class Config:
        orm_mode = True
