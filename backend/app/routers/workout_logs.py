from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from datetime import datetime

from app.core.database import get_db
from app.core.security import oauth2_scheme, verify_token
from app.models.user import User, UserRole
from app.models.workout_log import WorkoutLog
from app.models.plan import PlanAssignment, PlanExerciseDetails # Added PlanExerciseDetails
from app.schemas.workout_log import WorkoutLog as WorkoutLogSchema, WorkoutLogCreate, WorkoutLogUpdate # WorkoutLogWithPRStatus will be imported from pr schemas
from app.routers.users import get_current_active_user, check_admin_permission, check_coach_permission
from app.crud import crud_pr
from app.schemas.pr import PersonalRecordCreate, PersonalRecordUpdate, WorkoutLogWithPRStatus # Import PR schemas
# User model is already imported via `from app.models.user import User, UserRole`
# Depends is already imported from fastapi
# Session is already imported from sqlalchemy.orm

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

    created_workout_log_model = WorkoutLog(
        **workout_log_in.dict(),
        athlete_id=current_user.id
        # date_performed is part of workout_log_in or defaults in model
    )
    db.add(created_workout_log_model)
    db.commit()
    db.refresh(created_workout_log_model)

    new_pr_achieved = False
    athlete_id = current_user.id

    # Fetch the PlanExerciseDetails to get the exercise_id
    # This part assumes that workout_log_in has plan_exercise_details_id
    # and that this ID corresponds to a single exercise for the entire log.
    # If a workout log can have multiple exercises, this logic needs adjustment.
    # For now, proceeding with the assumption of one exercise per log based on current structure.
    plan_exercise_detail = db.query(PlanExerciseDetails).filter(PlanExerciseDetails.id == created_workout_log_model.plan_exercise_details_id).first()

    if not plan_exercise_detail:
        # If no plan exercise detail, we can't determine the exercise_id for PRs.
        # Return the created log without PR processing.
        # This scenario should be handled based on application requirements.
        # For now, we'll return with new_pr_achieved as False.
        return {"workout_log": created_workout_log_model, "new_pr_achieved": new_pr_achieved}

    exercise_id_for_log = plan_exercise_detail.exercise_id

    # The subtask implies iterating over "workout_log_in.sets".
    # The current WorkoutLogCreate schema and WorkoutLog model store sets as:
    # sets_performed: int
    # reps_performed_per_set: ARRAY(Integer)
    # weight_used_per_set: ARRAY(String)
    # This structure means we iterate based on sets_performed and access arrays by index.

    num_sets = created_workout_log_model.sets_performed
    if len(created_workout_log_model.reps_performed_per_set) == num_sets and \
       len(created_workout_log_model.weight_used_per_set) == num_sets:
        for i in range(num_sets):
            reps = created_workout_log_model.reps_performed_per_set[i]
            try:
                # Ensure weight is correctly parsed as float
                weight_str = created_workout_log_model.weight_used_per_set[i]
                weight = float(weight_str)
            except ValueError:
                # If weight is not a valid float, skip PR consideration for this set
                continue

            if reps <= 0 or weight <= 0: # PRs are typically for positive reps and weight
                continue

            existing_pr = crud_pr.get_pr_by_details(
                db=db,
                athlete_id=athlete_id,
                exercise_id=exercise_id_for_log, # Use the single exercise ID for the log
                reps=reps
            )

            log_date = created_workout_log_model.date_performed.date() # Use date part of date_performed

            if existing_pr:
                if weight > existing_pr.weight:
                    pr_update_data = PersonalRecordUpdate(weight=weight, date_achieved=log_date)
                    # workout_log_id is not updated here as existing_pr might be from a different log
                    # or we might decide to link it to the current log.
                    # The requirement for update_pr doesn't include workout_log_id.
                    # If we want to update the workout_log_id of the PR, schema and CRUD for PR update would need adjustment.
                    crud_pr.update_pr(db=db, db_obj=existing_pr, obj_in=pr_update_data)
                    new_pr_achieved = True
            else:
                pr_create_data = PersonalRecordCreate(
                    exercise_id=exercise_id_for_log,
                    reps=reps,
                    weight=weight,
                    date_achieved=log_date
                )
                crud_pr.create_pr(
                    db=db,
                    obj_in=pr_create_data,
                    athlete_id=athlete_id,
                    workout_log_id=created_workout_log_model.id # Link new PR to this workout log
                )
                new_pr_achieved = True

    # The return type annotation for the endpoint is WorkoutLogWithPRStatus
    # The subtask asks to return a dict: `return {"workout_log": created_workout_log, "new_pr_achieved": new_pr_achieved}`
    # FastAPI will automatically convert this dict to WorkoutLogWithPRStatus if the keys match.
    return {"workout_log": created_workout_log_model, "new_pr_achieved": new_pr_achieved}


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
