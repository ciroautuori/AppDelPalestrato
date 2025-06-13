from pydantic import BaseModel
from datetime import date
from typing import Optional

from app.schemas.exercise import ExerciseRead
from app.schemas.workout_log import WorkoutLogRead

class PersonalRecordBase(BaseModel):
    reps: int
    weight: float
    date_achieved: date

class PersonalRecordCreate(PersonalRecordBase):
    exercise_id: int
    # athlete_id will be set from the current user
    # workout_log_id is optional and can be set if the PR is part of a logged workout.
    # It's not explicitly in Create, suggesting it might be linked differently or after creation.
    # For now, sticking to the defined fields. If workout_log_id needs to be part of creation,
    # it should be added to PersonalRecordCreate. Based on requirements, it's in Read.

class PersonalRecordUpdate(BaseModel): # Inherits from BaseModel as per requirement, not PersonalRecordBase
    reps: Optional[int] = None
    weight: Optional[float] = None
    date_achieved: Optional[date] = None

class PersonalRecordRead(PersonalRecordBase):
    id: int
    athlete_id: int
    exercise: ExerciseRead
    workout_log_id: Optional[int] = None

    class Config:
        orm_mode = True

class WorkoutLogWithPRStatus(BaseModel):
    workout_log: WorkoutLogRead
    new_pr_achieved: bool
