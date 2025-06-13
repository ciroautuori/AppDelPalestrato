from typing import List, Optional, Union, Dict, Any

from sqlalchemy.orm import Session
from sqlalchemy import select # Removed 'and_' as it's not explicitly used with select statement structure below

from app.models.pr import PersonalRecord
from app.models.exercise import Exercise # As per requirement
from app.schemas.pr import PersonalRecordCreate, PersonalRecordUpdate

def get_pr_by_details(db: Session, *, athlete_id: int, exercise_id: int, reps: int) -> Optional[PersonalRecord]:
    """
    Get a specific personal record by athlete, exercise, and reps.
    """
    statement = select(PersonalRecord).where(
        PersonalRecord.athlete_id == athlete_id,
        PersonalRecord.exercise_id == exercise_id,
        PersonalRecord.reps == reps
    )
    return db.execute(statement).scalar_one_or_none()

def create_pr(db: Session, *, obj_in: PersonalRecordCreate, athlete_id: int, workout_log_id: Optional[int] = None) -> PersonalRecord:
    """
    Create a new personal record.
    """
    # Ensure all fields from obj_in are captured.
    # PersonalRecordCreate includes: reps, weight, date_achieved, exercise_id
    db_obj_data = obj_in.dict()
    db_obj_data['athlete_id'] = athlete_id
    if workout_log_id is not None:
        db_obj_data['workout_log_id'] = workout_log_id

    db_obj = PersonalRecord(**db_obj_data)

    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_pr(db: Session, *, db_obj: PersonalRecord, obj_in: Union[PersonalRecordUpdate, Dict[str, Any]]) -> PersonalRecord:
    """
    Update an existing personal record.
    obj_in can be a PersonalRecordUpdate schema or a dictionary.
    """
    if isinstance(obj_in, dict):
        update_data = obj_in
    else: # It's a PersonalRecordUpdate schema
        update_data = obj_in.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(db_obj, field, value)

    db.add(db_obj) # or db.merge(db_obj) if you want to handle detached objects
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_prs_by_athlete(db: Session, *, athlete_id: int) -> List[PersonalRecord]:
    """
    Get all personal records for a given athlete.
    """
    statement = select(PersonalRecord).where(PersonalRecord.athlete_id == athlete_id)
    results = db.execute(statement)
    return results.scalars().all()
