from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from datetime import datetime

from app.core.database import get_db
from app.core.security import oauth2_scheme, verify_token
from app.models.user import User, UserRole
from app.models.workout_log import WorkoutLog
from app.models.plan import PlanAssignment
from app.schemas.workout_log import WorkoutLog as WorkoutLogSchema, WorkoutLogCreate, WorkoutLogUpdate
from app.routers.users import get_current_active_user, check_admin_permission, check_coach_permission

router = APIRouter()


@router.get("/", response_model=List[WorkoutLogSchema])
def read_workout_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
    plan_assignment_id: int = None,
    start_date: datetime = None,
    end_date: datetime = None,
) -> Any:
    """
    Retrieve workout logs.
    """
    query = db.query(WorkoutLog)

    if current_user.role == UserRole.ADMIN:
        pass  # Admin can see all logs
    elif current_user.role == UserRole.COACH:
        # Coach can only see logs of their athletes (using direct query)
        managed_athletes = db.query(User).filter(
            User.coach_id == current_user.id).all()
        athlete_ids = [athlete.id for athlete in managed_athletes]
        query = query.filter(WorkoutLog.athlete_id.in_(athlete_ids))
    else:  # ATHLETE
        # Athletes can only see their own logs
        query = query.filter(WorkoutLog.athlete_id == current_user.id)

    # Apply filters
    if plan_assignment_id:
        query = query.filter(
            WorkoutLog.plan_assignment_id == plan_assignment_id)
    if start_date:
        query = query.filter(WorkoutLog.date_performed >= start_date)
    if end_date:
        query = query.filter(WorkoutLog.date_performed <= end_date)

    workout_logs = query.order_by(
        WorkoutLog.date_performed.desc()).offset(skip).limit(limit).all()
    return workout_logs


@router.post("/", response_model=WorkoutLogSchema)
def create_workout_log(
    *,
    db: Session = Depends(get_db),
    workout_log_in: WorkoutLogCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create new workout log.
    """
    # Verify the plan assignment exists and is active
    assignment = db.query(PlanAssignment).filter(
        PlanAssignment.id == workout_log_in.plan_assignment_id,
        PlanAssignment.athlete_id == current_user.id,
        PlanAssignment.status.in_(["assigned", "in_progress"])
    ).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active plan assignment not found"
        )

    workout_log = WorkoutLog(
        **workout_log_in.dict(),
        athlete_id=current_user.id
    )
    db.add(workout_log)
    db.commit()
    db.refresh(workout_log)
    return workout_log


@router.put("/{workout_log_id}", response_model=WorkoutLogSchema)
def update_workout_log(
    *,
    db: Session = Depends(get_db),
    workout_log_id: int,
    workout_log_in: WorkoutLogUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update a workout log.
    """
    workout_log = db.query(WorkoutLog).filter(
        WorkoutLog.id == workout_log_id).first()
    if not workout_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout log not found"
        )

    # Verify the user has permission to update this log
    if current_user.role == UserRole.ATHLETE and workout_log.athlete_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this workout log"
        )

    for field, value in workout_log_in.dict(exclude_unset=True).items():
        setattr(workout_log, field, value)

    db.add(workout_log)
    db.commit()
    db.refresh(workout_log)
    return workout_log


@router.delete("/{workout_log_id}", response_model=WorkoutLogSchema)
def delete_workout_log(
    *,
    db: Session = Depends(get_db),
    workout_log_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete a workout log.
    """
    workout_log = db.query(WorkoutLog).filter(
        WorkoutLog.id == workout_log_id).first()
    if not workout_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout log not found"
        )

    # Verify the user has permission to delete this log
    if current_user.role == UserRole.ATHLETE and workout_log.athlete_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this workout log"
        )

    db.delete(workout_log)
    db.commit()
    return workout_log
