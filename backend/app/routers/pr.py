from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any

from app.core.database import get_db
from app.routers.users import get_current_active_user
from app.models.user import User, UserRole  # Assuming UserRole enum is here
from app.schemas.pr import PersonalRecordRead
from app.crud import crud_pr

router = APIRouter()


@router.get("/athlete/me", response_model=List[PersonalRecordRead])
def read_personal_records_for_athlete(
    db: Session = Depends(get_db), # Removed * for consistency with problem statement, though * is fine
    current_user: User = Depends(get_current_active_user),
) -> List[PersonalRecordRead]: # Corrected return type annotation
    """
    Retrieve all personal records for the currently authenticated athlete.
    """
    # Ensure the current user is an athlete
    if current_user.role != UserRole.ATHLETE: # Comparing with Enum member
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource. Only athletes can view their PRs.", # Minor detail message update
        )

    prs = crud_pr.get_prs_by_athlete(db=db, athlete_id=current_user.id)
    return prs
