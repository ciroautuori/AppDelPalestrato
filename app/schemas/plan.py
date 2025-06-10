from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.plan import PlanDifficulty, PlanAssignmentStatus


class PlanExerciseDetailsBase(BaseModel):
    exercise_id: int
    sets: str
    reps: str
    rest_time_seconds: int
    notes_for_exercise_in_plan: Optional[str] = None
    order_in_plan: int


class PlanExerciseDetailsCreate(PlanExerciseDetailsBase):
    pass


class PlanExerciseDetailsUpdate(PlanExerciseDetailsBase):
    exercise_id: Optional[int] = None
    sets: Optional[str] = None
    reps: Optional[str] = None
    rest_time_seconds: Optional[int] = None
    order_in_plan: Optional[int] = None


class PlanExerciseDetailsInDB(PlanExerciseDetailsBase):
    id: int
    plan_id: int

    class Config:
        from_attributes = True


class PlanExerciseDetails(PlanExerciseDetailsInDB):
    pass


class PlanBase(BaseModel):
    name: str
    description: Optional[str] = None
    difficulty_level: PlanDifficulty


class PlanCreate(PlanBase):
    exercise_details: List[PlanExerciseDetailsCreate]


class PlanUpdate(PlanBase):
    name: Optional[str] = None
    difficulty_level: Optional[PlanDifficulty] = None


class PlanInDB(PlanBase):
    id: int
    created_by_user_id: int

    class Config:
        from_attributes = True


class Plan(PlanInDB):
    exercise_details: List[PlanExerciseDetails]


class PlanAssignmentBase(BaseModel):
    plan_id: int
    athlete_id: int
    start_date: Optional[datetime] = None


class PlanAssignmentCreate(PlanAssignmentBase):
    pass


class PlanAssignmentUpdate(BaseModel):
    status: Optional[PlanAssignmentStatus] = None
    start_date: Optional[datetime] = None


class PlanAssignmentInDB(PlanAssignmentBase):
    id: int
    assigned_by_coach_id: int
    assigned_date: datetime
    status: PlanAssignmentStatus

    class Config:
        from_attributes = True


class PlanAssignment(PlanAssignmentInDB):
    pass
