from pydantic import BaseModel, HttpUrl
from typing import Optional


class ExerciseBase(BaseModel):
    name: str
    description: Optional[str] = None
    muscle_group: str
    video_url: Optional[HttpUrl] = None


class ExerciseCreate(ExerciseBase):
    pass


class ExerciseUpdate(ExerciseBase):
    name: Optional[str] = None
    muscle_group: Optional[str] = None


class ExerciseInDB(ExerciseBase):
    id: int
    created_by_user_id: int

    class Config:
        from_attributes = True


class Exercise(ExerciseInDB):
    pass
