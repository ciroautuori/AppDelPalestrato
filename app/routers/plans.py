from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any

from app.core.database import get_db
from app.core.security import oauth2_scheme, verify_token
from app.models.user import User, UserRole
from app.models.plan import Plan, PlanExerciseDetails, PlanAssignment
from app.schemas.plan import (
    Plan as PlanSchema,
    PlanCreate,
    PlanUpdate,
    PlanExerciseDetails as PlanExerciseDetailsSchema,
    PlanExerciseDetailsCreate,
    PlanExerciseDetailsUpdate,
    PlanAssignment as PlanAssignmentSchema,
    PlanAssignmentCreate,
    PlanAssignmentUpdate
)
from app.routers.users import get_current_active_user, check_admin_permission, check_coach_permission

router = APIRouter()


@router.get("/", response_model=List[PlanSchema])
def read_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve plans.
    """
    if current_user.role == UserRole.ADMIN:
        plans = db.query(Plan).offset(skip).limit(limit).all()
    elif current_user.role == UserRole.COACH:
        plans = db.query(Plan).filter(Plan.created_by_user_id ==
                                      current_user.id).offset(skip).limit(limit).all()
    else:  # ATHLETE
        # Get plans assigned to the athlete
        assignments = db.query(PlanAssignment).filter(
            PlanAssignment.athlete_id == current_user.id).all()
        plan_ids = [assignment.plan_id for assignment in assignments]
        plans = db.query(Plan).filter(Plan.id.in_(plan_ids)
                                      ).offset(skip).limit(limit).all()
    return plans


@router.post("/", response_model=PlanSchema)
def create_plan(
    *,
    db: Session = Depends(get_db),
    plan_in: PlanCreate,
    current_user: User = Depends(check_coach_permission),
) -> Any:
    """
    Create new plan.
    """
    plan = Plan(
        name=plan_in.name,
        description=plan_in.description,
        difficulty_level=plan_in.difficulty_level,
        created_by_user_id=current_user.id
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)

    # Create plan exercise details
    for exercise_detail in plan_in.exercise_details:
        plan_exercise_detail = PlanExerciseDetails(
            plan_id=plan.id,
            **exercise_detail.dict()
        )
        db.add(plan_exercise_detail)

    db.commit()
    db.refresh(plan)
    return plan


@router.put("/{plan_id}", response_model=PlanSchema)
def update_plan(
    *,
    db: Session = Depends(get_db),
    plan_id: int,
    plan_in: PlanUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update a plan.
    """
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )

    # Only admin or the creator can update the plan
    if current_user.role != UserRole.ADMIN and plan.created_by_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    for field, value in plan_in.dict(exclude_unset=True).items():
        setattr(plan, field, value)

    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@router.delete("/{plan_id}", response_model=PlanSchema)
def delete_plan(
    *,
    db: Session = Depends(get_db),
    plan_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete a plan.
    """
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )

    # Only admin or the creator can delete the plan
    if current_user.role != UserRole.ADMIN and plan.created_by_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    db.delete(plan)
    db.commit()
    return plan


@router.post("/{plan_id}/exercise-details", response_model=PlanExerciseDetailsSchema)
def create_plan_exercise_detail(
    *,
    db: Session = Depends(get_db),
    plan_id: int,
    exercise_detail_in: PlanExerciseDetailsCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Add an exercise to a plan.
    """
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )

    # Only admin or the creator can modify the plan
    if current_user.role != UserRole.ADMIN and plan.created_by_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    plan_exercise_detail = PlanExerciseDetails(
        plan_id=plan_id,
        **exercise_detail_in.dict()
    )
    db.add(plan_exercise_detail)
    db.commit()
    db.refresh(plan_exercise_detail)
    return plan_exercise_detail


@router.put("/{plan_id}/exercise-details/{detail_id}", response_model=PlanExerciseDetailsSchema)
def update_plan_exercise_detail(
    *,
    db: Session = Depends(get_db),
    plan_id: int,
    detail_id: int,
    exercise_detail_in: PlanExerciseDetailsUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update an exercise in a plan.
    """
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )

    # Only admin or the creator can modify the plan
    if current_user.role != UserRole.ADMIN and plan.created_by_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    plan_exercise_detail = db.query(PlanExerciseDetails).filter(
        PlanExerciseDetails.id == detail_id,
        PlanExerciseDetails.plan_id == plan_id
    ).first()
    if not plan_exercise_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise detail not found"
        )

    for field, value in exercise_detail_in.dict(exclude_unset=True).items():
        setattr(plan_exercise_detail, field, value)

    db.add(plan_exercise_detail)
    db.commit()
    db.refresh(plan_exercise_detail)
    return plan_exercise_detail


@router.delete("/{plan_id}/exercise-details/{detail_id}", response_model=PlanExerciseDetailsSchema)
def delete_plan_exercise_detail(
    *,
    db: Session = Depends(get_db),
    plan_id: int,
    detail_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Remove an exercise from a plan.
    """
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )

    # Only admin or the creator can modify the plan
    if current_user.role != UserRole.ADMIN and plan.created_by_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    plan_exercise_detail = db.query(PlanExerciseDetails).filter(
        PlanExerciseDetails.id == detail_id,
        PlanExerciseDetails.plan_id == plan_id
    ).first()
    if not plan_exercise_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise detail not found"
        )

    db.delete(plan_exercise_detail)
    db.commit()
    return plan_exercise_detail


@router.post("/assignments", response_model=PlanAssignmentSchema)
def create_plan_assignment(
    *,
    db: Session = Depends(get_db),
    assignment_in: PlanAssignmentCreate,
    current_user: User = Depends(check_coach_permission),
) -> Any:
    """
    Assign a plan to an athlete.
    """
    # Verify the plan exists
    plan = db.query(Plan).filter(Plan.id == assignment_in.plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )

    # Verify the athlete exists and is assigned to the current coach
    athlete = db.query(User).filter(
        User.id == assignment_in.athlete_id,
        User.role == UserRole.ATHLETE
    ).first()
    if not athlete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Athlete not found"
        )

    # Verify the coach has permission to assign to this athlete
    if current_user.role != UserRole.ADMIN and athlete.coach_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to assign plan to this athlete"
        )

    assignment = PlanAssignment(
        **assignment_in.dict(),
        assigned_by_coach_id=current_user.id
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


@router.put("/assignments/{assignment_id}", response_model=PlanAssignmentSchema)
def update_plan_assignment(
    *,
    db: Session = Depends(get_db),
    assignment_id: int,
    assignment_in: PlanAssignmentUpdate,
    current_user: User = Depends(check_coach_permission),
) -> Any:
    """
    Update a plan assignment.
    """
    assignment = db.query(PlanAssignment).filter(
        PlanAssignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )

    # Verify the coach has permission to update this assignment
    if current_user.role != UserRole.ADMIN and assignment.assigned_by_coach_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this assignment"
        )

    for field, value in assignment_in.dict(exclude_unset=True).items():
        setattr(assignment, field, value)

    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


@router.delete("/assignments/{assignment_id}", response_model=PlanAssignmentSchema)
def delete_plan_assignment(
    *,
    db: Session = Depends(get_db),
    assignment_id: int,
    current_user: User = Depends(check_coach_permission),
) -> Any:
    """
    Delete a plan assignment.
    """
    assignment = db.query(PlanAssignment).filter(
        PlanAssignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )

    # Verify the coach has permission to delete this assignment
    if current_user.role != UserRole.ADMIN and assignment.assigned_by_coach_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this assignment"
        )

    db.delete(assignment)
    db.commit()
    return assignment
