from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class WorkoutLogBase(BaseModel):
    plan_assignment_id: int
    plan_exercise_details_id: int
    sets_performed: int
    reps_performed_per_set: List[int]
    weight_used_per_set: List[str]
    rest_taken_per_set: Optional[List[int]] = None
    athlete_notes: Optional[str] = None
    duration_seconds: Optional[int] = None


class WorkoutLogCreate(WorkoutLogBase):
    pass


class WorkoutLogUpdate(BaseModel):
    sets_performed: Optional[int] = None
    reps_performed_per_set: Optional[List[int]] = None
    weight_used_per_set: Optional[List[str]] = None
    rest_taken_per_set: Optional[List[int]] = None
    athlete_notes: Optional[str] = None
    duration_seconds: Optional[int] = None


class WorkoutLogInDB(WorkoutLogBase):
    id: int
    athlete_id: int
    date_performed: datetime

    class Config:
        from_attributes = True


class WorkoutLog(WorkoutLogInDB):
    pass


# Schema for returning workout log along with PR status
class WorkoutLogWithPRStatus(WorkoutLog):
    new_pr_achieved: bool
