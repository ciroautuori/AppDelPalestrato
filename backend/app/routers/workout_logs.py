from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from datetime import datetime

from app.core.database import get_db
from app.core.security import oauth2_scheme, verify_token
from app.models.user import User, UserRole
from app.models.workout_log import WorkoutLog
from app.models.plan import PlanAssignment, PlanExerciseDetails # Added PlanExerciseDetails
from app.schemas.workout_log import WorkoutLog as WorkoutLogSchema, WorkoutLogCreate, WorkoutLogUpdate, WorkoutLogWithPRStatus # Added WorkoutLogWithPRStatus
from app.routers.users import get_current_active_user, check_admin_permission, check_coach_permission
from app.crud import crud_pr # Added crud_pr

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


@router.post("/", response_model=WorkoutLogWithPRStatus) # Changed response_model
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
        PlanAssignment.athlete_id == current_user.id
    ).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan assignment not found"
        )

    workout_log = WorkoutLog(
        **workout_log_in.dict(),
        athlete_id=current_user.id
    )
    db.add(workout_log)
    db.commit()
    db.refresh(workout_log)

    any_new_pr_achieved = False

    # Fetch the PlanExerciseDetails to get the exercise_id
    plan_exercise_detail = db.query(PlanExerciseDetails).filter(PlanExerciseDetails.id == workout_log.plan_exercise_details_id).first()

    if not plan_exercise_detail:
        # This case should ideally not happen if data integrity is maintained
        # but handle it defensively.
        return WorkoutLogWithPRStatus.from_orm(workout_log, {"new_pr_achieved": False})

    exercise_id = plan_exercise_detail.exercise_id

    # Iterate through each set performed in the workout log
    num_sets = workout_log.sets_performed
    if len(workout_log.reps_performed_per_set) == num_sets and len(workout_log.weight_used_per_set) == num_sets:
        for i in range(num_sets):
            reps = workout_log.reps_performed_per_set[i]
            try:
                weight = float(workout_log.weight_used_per_set[i]) # Ensure weight is float
            except ValueError:
                # Handle cases where weight might not be a valid float, skip PR for this set
                continue

            if reps > 0 and weight > 0: # Only consider valid sets for PRs
                _, pr_achieved_for_set = crud_pr.find_or_create_pr_for_log(
                    db=db,
                    athlete_id=workout_log.athlete_id,
                    exercise_id=exercise_id,
                    reps_achieved=reps,
                    weight_lifted=weight,
                    date_achieved=workout_log.date_performed.date(), # Extract date part
                    workout_log_id=workout_log.id
                )
                if pr_achieved_for_set:
                    any_new_pr_achieved = True

    return WorkoutLogWithPRStatus.from_orm(workout_log, {"new_pr_achieved": any_new_pr_achieved})


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
