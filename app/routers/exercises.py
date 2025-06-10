from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any

from app.core.database import get_db
from app.core.security import oauth2_scheme, verify_token
from app.models.user import User, UserRole
from app.models.exercise import Exercise
from app.schemas.exercise import Exercise as ExerciseSchema, ExerciseCreate, ExerciseUpdate
from app.routers.users import get_current_active_user, check_admin_permission, check_coach_permission

router = APIRouter()


@router.get("/", response_model=List[ExerciseSchema])
def read_exercises(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve exercises.
    """
    exercises = db.query(Exercise).offset(skip).limit(limit).all()
    return exercises


@router.post("/", response_model=ExerciseSchema)
def create_exercise(
    *,
    db: Session = Depends(get_db),
    exercise_in: ExerciseCreate,
    current_user: User = Depends(check_coach_permission),
) -> Any:
    """
    Create new exercise.
    """
    exercise = Exercise(
        **exercise_in.dict(),
        created_by_user_id=current_user.id
    )
    db.add(exercise)
    db.commit()
    db.refresh(exercise)
    return exercise


@router.put("/{exercise_id}", response_model=ExerciseSchema)
def update_exercise(
    *,
    db: Session = Depends(get_db),
    exercise_id: int,
    exercise_in: ExerciseUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update an exercise.
    """
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )

    # Only admin or the creator can update the exercise
    if current_user.role != UserRole.ADMIN and exercise.created_by_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    for field, value in exercise_in.dict(exclude_unset=True).items():
        setattr(exercise, field, value)

    db.add(exercise)
    db.commit()
    db.refresh(exercise)
    return exercise


@router.delete("/{exercise_id}", response_model=ExerciseSchema)
def delete_exercise(
    *,
    db: Session = Depends(get_db),
    exercise_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete an exercise.
    """
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )

    # Only admin or the creator can delete the exercise
    if current_user.role != UserRole.ADMIN and exercise.created_by_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    db.delete(exercise)
    db.commit()
    return exercise
