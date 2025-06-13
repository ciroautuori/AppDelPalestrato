from typing import Any, Dict, List, Optional, Tuple, Union
from sqlalchemy.orm import Session
from sqlalchemy import desc # Required for ordering in get_prs_by_athlete if not done at model level

from app.models.pr import PersonalRecord
from app.models.workout_log import WorkoutLog # Needed for find_or_create_pr_for_log type hint
from app.schemas.pr import PersonalRecordCreate, PersonalRecordUpdate
import datetime

def get_pr(db: Session, pr_id: int) -> Optional[PersonalRecord]:
    return db.query(PersonalRecord).filter(PersonalRecord.id == pr_id).first()

def get_pr_by_details(db: Session, *, athlete_id: int, exercise_id: int, reps: int) -> Optional[PersonalRecord]:
    return db.query(PersonalRecord).filter(
        PersonalRecord.athlete_id == athlete_id,
        PersonalRecord.exercise_id == exercise_id,
        PersonalRecord.reps == reps
    ).first()

def get_prs_by_athlete(db: Session, athlete_id: int, skip: int = 0, limit: int = 100) -> List[PersonalRecord]:
    return db.query(PersonalRecord).filter(PersonalRecord.athlete_id == athlete_id).order_by(
        desc(PersonalRecord.date_achieved), PersonalRecord.id # Added secondary sort for consistency
    ).offset(skip).limit(limit).all()

def create_pr(db: Session, *, obj_in: PersonalRecordCreate, athlete_id: int) -> PersonalRecord:
    db_obj = PersonalRecord(
        **obj_in.dict(),
        athlete_id=athlete_id
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_pr(
    db: Session, *, db_obj: PersonalRecord, obj_in: Union[PersonalRecordUpdate, Dict[str, Any]]
) -> PersonalRecord:
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(db_obj, field, value)

    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def find_or_create_pr_for_log(
    db: Session,
    *,
    athlete_id: int, # Changed from workout_log: WorkoutLog
    exercise_id: int,
    reps_achieved: int,
    weight_lifted: float,
    date_achieved: datetime.date, # Added
    workout_log_id: Optional[int] = None # Added
) -> Tuple[Optional[PersonalRecord], bool]:
    """
    Finds an existing PR for the given athlete, exercise, and reps.
    If it exists and the new weight is higher, updates it.
    If it doesn't exist and the weight is positive, creates a new PR.
    Returns the PR object (or None if no PR is relevant) and a boolean indicating if a new PR was made or an existing one was improved.
    """

    existing_pr = get_pr_by_details(
        db,
        athlete_id=athlete_id,
        exercise_id=exercise_id,
        reps=reps_achieved
    )

    new_or_updated_pr_achieved = False
    pr_to_return = None

    if existing_pr:
        if weight_lifted > existing_pr.weight:
            pr_data_update = PersonalRecordUpdate(
                weight=weight_lifted,
                date_achieved=date_achieved,
                workout_log_id=workout_log_id
            )
            pr_to_return = update_pr(db, db_obj=existing_pr, obj_in=pr_data_update)
            new_or_updated_pr_achieved = True
        else:
            # Existing PR is not beaten
            pr_to_return = existing_pr
    else:
        # No existing PR for these reps, create a new one if weight is positive
        if weight_lifted > 0: # Only create PRs for actual lifts
            pr_data_create = PersonalRecordCreate(
                exercise_id=exercise_id,
                reps=reps_achieved,
                weight=weight_lifted,
                date_achieved=date_achieved,
                workout_log_id=workout_log_id
            )
            pr_to_return = create_pr(db, obj_in=pr_data_create, athlete_id=athlete_id)
            new_or_updated_pr_achieved = True

    return pr_to_return, new_or_updated_pr_achieved
