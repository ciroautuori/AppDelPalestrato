from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any

from app.core.database import get_db
from app.routers.users import get_current_active_user
from app.models.user import User, UserRole  # Assuming UserRole enum is here
from app.schemas.pr import PersonalRecordRead
from app.crud import crud_pr

router = APIRouter()


@router.get("/athlete/me/personal-records", response_model=List[PersonalRecordRead])
def read_athlete_personal_records(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve all personal records for the currently authenticated athlete.
    """
    if current_user.role != UserRole.ATHLETE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized. Athlete role required."
        )

    personal_records = crud_pr.get_prs_by_athlete(
        db=db, athlete_id=current_user.id)
    return personal_records
