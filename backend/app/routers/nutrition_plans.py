from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any

from app.core.database import get_db
from app.core.security import oauth2_scheme, verify_token
from app.models.user import User, UserRole
from app.models.nutrition_plan import NutritionPlan, Meal, FoodItem, NutritionPlanAssignment
from app.schemas.nutrition_plan import (
    NutritionPlan as NutritionPlanSchema,
    NutritionPlanCreate,
    NutritionPlanUpdate,
    Meal as MealSchema,
    MealCreate,
    MealUpdate,
    FoodItem as FoodItemSchema,
    FoodItemCreate,
    FoodItemUpdate,
    NutritionPlanAssignment as NutritionPlanAssignmentSchema,
    NutritionPlanAssignmentCreate,
    NutritionPlanAssignmentUpdate
)
from app.routers.users import get_current_active_user, check_admin_permission, check_coach_permission

router = APIRouter()


def update_meal_totals(meal: Meal) -> None:
    """Update the total nutritional values for a meal based on its food items."""
    meal.total_calories = sum(item.calories for item in meal.food_items)
    meal.total_protein = sum(item.protein for item in meal.food_items)
    meal.total_carbs = sum(item.carbs for item in meal.food_items)
    meal.total_fats = sum(item.fats for item in meal.food_items)


def update_plan_totals(plan: NutritionPlan) -> None:
    """Update the total nutritional values for a plan based on its meals."""
    plan.total_calories = sum(meal.total_calories for meal in plan.meals)
    plan.total_protein = sum(meal.total_protein for meal in plan.meals)
    plan.total_carbs = sum(meal.total_carbs for meal in plan.meals)
    plan.total_fats = sum(meal.total_fats for meal in plan.meals)


@router.get("/", response_model=List[NutritionPlanSchema])
def read_nutrition_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve nutrition plans.
    """
    if current_user.role == UserRole.ADMIN:
        plans = db.query(NutritionPlan).offset(skip).limit(limit).all()
    elif current_user.role == UserRole.COACH:
        plans = db.query(NutritionPlan).filter(
            NutritionPlan.created_by_user_id == current_user.id
        ).offset(skip).limit(limit).all()
    else:  # ATHLETE
        # Get plans assigned to the athlete
        assignments = db.query(NutritionPlanAssignment).filter(
            NutritionPlanAssignment.athlete_id == current_user.id
        ).all()
        plan_ids = [assignment.nutrition_plan_id for assignment in assignments]
        plans = db.query(NutritionPlan).filter(
            NutritionPlan.id.in_(plan_ids)
        ).offset(skip).limit(limit).all()
    return plans


@router.post("/", response_model=NutritionPlanSchema)
def create_nutrition_plan(
    *,
    db: Session = Depends(get_db),
    plan_in: NutritionPlanCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create new nutrition plan.
    """
    if current_user.role != UserRole.COACH:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only coaches can create nutrition plans"
        )

    plan = NutritionPlan(
        name=plan_in.name,
        description=plan_in.description,
        created_by_user_id=current_user.id
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)

    # Create meals and food items
    for meal_data in plan_in.meals:
        meal = Meal(
            nutrition_plan_id=plan.id,
            name=meal_data.name,
            time=meal_data.time,
            order_in_plan=meal_data.order_in_plan
        )
        db.add(meal)
        db.commit()
        db.refresh(meal)

        for food_item_data in meal_data.food_items:
            food_item = FoodItem(
                meal_id=meal.id,
                **food_item_data.dict()
            )
            db.add(food_item)

        db.commit()
        db.refresh(meal)
        update_meal_totals(meal)

    db.commit()
    db.refresh(plan)
    update_plan_totals(plan)
    db.commit()
    db.refresh(plan)
    return plan


@router.put("/{plan_id}", response_model=NutritionPlanSchema)
def update_nutrition_plan(
    *,
    db: Session = Depends(get_db),
    plan_id: int,
    plan_in: NutritionPlanUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update a nutrition plan.
    """
    plan = db.query(NutritionPlan).filter(NutritionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nutrition plan not found"
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


@router.delete("/{plan_id}", response_model=NutritionPlanSchema)
def delete_nutrition_plan(
    *,
    db: Session = Depends(get_db),
    plan_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete a nutrition plan.
    """
    plan = db.query(NutritionPlan).filter(NutritionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nutrition plan not found"
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


@router.post("/{plan_id}/meals", response_model=MealSchema)
def create_meal(
    *,
    db: Session = Depends(get_db),
    plan_id: int,
    meal_in: MealCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Add a meal to a nutrition plan.
    """
    plan = db.query(NutritionPlan).filter(NutritionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nutrition plan not found"
        )

    # Only admin or the creator can modify the plan
    if current_user.role != UserRole.ADMIN and plan.created_by_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    meal = Meal(
        nutrition_plan_id=plan_id,
        name=meal_in.name,
        time=meal_in.time,
        order_in_plan=meal_in.order_in_plan
    )
    db.add(meal)
    db.commit()
    db.refresh(meal)

    for food_item_data in meal_in.food_items:
        food_item = FoodItem(
            meal_id=meal.id,
            **food_item_data.dict()
        )
        db.add(food_item)

    db.commit()
    db.refresh(meal)
    update_meal_totals(meal)
    update_plan_totals(plan)
    db.commit()
    db.refresh(meal)
    return meal


@router.put("/{plan_id}/meals/{meal_id}", response_model=MealSchema)
def update_meal(
    *,
    db: Session = Depends(get_db),
    plan_id: int,
    meal_id: int,
    meal_in: MealUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update a meal in a nutrition plan.
    """
    plan = db.query(NutritionPlan).filter(NutritionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nutrition plan not found"
        )

    # Only admin or the creator can modify the plan
    if current_user.role != UserRole.ADMIN and plan.created_by_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    meal = db.query(Meal).filter(
        Meal.id == meal_id,
        Meal.nutrition_plan_id == plan_id
    ).first()
    if not meal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal not found"
        )

    for field, value in meal_in.dict(exclude_unset=True).items():
        setattr(meal, field, value)

    db.add(meal)
    db.commit()
    db.refresh(meal)
    update_meal_totals(meal)
    update_plan_totals(plan)
    db.commit()
    db.refresh(meal)
    return meal


@router.delete("/{plan_id}/meals/{meal_id}", response_model=MealSchema)
def delete_meal(
    *,
    db: Session = Depends(get_db),
    plan_id: int,
    meal_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Remove a meal from a nutrition plan.
    """
    plan = db.query(NutritionPlan).filter(NutritionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nutrition plan not found"
        )

    # Only admin or the creator can modify the plan
    if current_user.role != UserRole.ADMIN and plan.created_by_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    meal = db.query(Meal).filter(
        Meal.id == meal_id,
        Meal.nutrition_plan_id == plan_id
    ).first()
    if not meal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal not found"
        )

    db.delete(meal)
    db.commit()
    update_plan_totals(plan)
    db.commit()
    return meal


@router.post("/meals/{meal_id}/food-items", response_model=FoodItemSchema)
def create_food_item(
    *,
    db: Session = Depends(get_db),
    meal_id: int,
    food_item_in: FoodItemCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Add a food item to a meal.
    """
    meal = db.query(Meal).filter(Meal.id == meal_id).first()
    if not meal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal not found"
        )

    plan = db.query(NutritionPlan).filter(
        NutritionPlan.id == meal.nutrition_plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nutrition plan not found"
        )

    # Only admin or the creator can modify the plan
    if current_user.role != UserRole.ADMIN and plan.created_by_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    food_item = FoodItem(
        meal_id=meal_id,
        **food_item_in.dict()
    )
    db.add(food_item)
    db.commit()
    db.refresh(food_item)
    update_meal_totals(meal)
    update_plan_totals(plan)
    db.commit()
    db.refresh(food_item)
    return food_item


@router.put("/meals/{meal_id}/food-items/{food_id}", response_model=FoodItemSchema)
def update_food_item(
    *,
    db: Session = Depends(get_db),
    meal_id: int,
    food_id: int,
    food_item_in: FoodItemUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update a food item in a meal.
    """
    meal = db.query(Meal).filter(Meal.id == meal_id).first()
    if not meal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal not found"
        )

    plan = db.query(NutritionPlan).filter(
        NutritionPlan.id == meal.nutrition_plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nutrition plan not found"
        )

    # Only admin or the creator can modify the plan
    if current_user.role != UserRole.ADMIN and plan.created_by_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    food_item = db.query(FoodItem).filter(
        FoodItem.id == food_id,
        FoodItem.meal_id == meal_id
    ).first()
    if not food_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food item not found"
        )

    for field, value in food_item_in.dict(exclude_unset=True).items():
        setattr(food_item, field, value)

    db.add(food_item)
    db.commit()
    db.refresh(food_item)
    update_meal_totals(meal)
    update_plan_totals(plan)
    db.commit()
    db.refresh(food_item)
    return food_item


@router.delete("/meals/{meal_id}/food-items/{food_id}", response_model=FoodItemSchema)
def delete_food_item(
    *,
    db: Session = Depends(get_db),
    meal_id: int,
    food_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Remove a food item from a meal.
    """
    meal = db.query(Meal).filter(Meal.id == meal_id).first()
    if not meal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal not found"
        )

    plan = db.query(NutritionPlan).filter(
        NutritionPlan.id == meal.nutrition_plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nutrition plan not found"
        )

    # Only admin or the creator can modify the plan
    if current_user.role != UserRole.ADMIN and plan.created_by_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    food_item = db.query(FoodItem).filter(
        FoodItem.id == food_id,
        FoodItem.meal_id == meal_id
    ).first()
    if not food_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food item not found"
        )

    db.delete(food_item)
    db.commit()
    update_meal_totals(meal)
    update_plan_totals(plan)
    db.commit()
    return food_item


@router.post("/assignments", response_model=NutritionPlanAssignmentSchema)
def create_nutrition_plan_assignment(
    *,
    db: Session = Depends(get_db),
    assignment_in: NutritionPlanAssignmentCreate,
    current_user: User = Depends(check_coach_permission),
) -> Any:
    """
    Assign a nutrition plan to an athlete.
    """
    # Verify the plan exists
    plan = db.query(NutritionPlan).filter(NutritionPlan.id ==
                                          assignment_in.nutrition_plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nutrition plan not found"
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

    assignment = NutritionPlanAssignment(
        **assignment_in.dict(),
        assigned_by_coach_id=current_user.id
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


@router.put("/assignments/{assignment_id}", response_model=NutritionPlanAssignmentSchema)
def update_nutrition_plan_assignment(
    *,
    db: Session = Depends(get_db),
    assignment_id: int,
    assignment_in: NutritionPlanAssignmentUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update a nutrition plan assignment.
    """
    assignment = db.query(NutritionPlanAssignment).filter(
        NutritionPlanAssignment.id == assignment_id
    ).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )

    # Athlete: can only update their own assignment, and only the status field
    if current_user.role == UserRole.ATHLETE:
        if assignment.athlete_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        update_data = assignment_in.dict(exclude_unset=True)
        # Only allow updating 'status' and only if it's the only field
        if not update_data or set(update_data.keys()) != {"status"}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Athletes can only update the status field"
            )
        assignment.status = update_data["status"]
    else:
        # Coach or admin: existing logic
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


@router.delete("/assignments/{assignment_id}", response_model=NutritionPlanAssignmentSchema)
def delete_nutrition_plan_assignment(
    *,
    db: Session = Depends(get_db),
    assignment_id: int,
    current_user: User = Depends(check_coach_permission),
) -> Any:
    """
    Delete a nutrition plan assignment.
    """
    assignment = db.query(NutritionPlanAssignment).filter(
        NutritionPlanAssignment.id == assignment_id
    ).first()
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


@router.get("/assignments", response_model=List[NutritionPlanAssignmentSchema])
def read_nutrition_plan_assignments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve nutrition plan assignments.
    """
    if current_user.role == UserRole.ADMIN:
        assignments = db.query(NutritionPlanAssignment).offset(
            skip).limit(limit).all()
    elif current_user.role == UserRole.COACH:
        assignments = db.query(NutritionPlanAssignment).filter(
            NutritionPlanAssignment.assigned_by_coach_id == current_user.id
        ).offset(skip).limit(limit).all()
    else:  # ATHLETE
        assignments = db.query(NutritionPlanAssignment).filter(
            NutritionPlanAssignment.athlete_id == current_user.id
        ).offset(skip).limit(limit).all()
    return assignments
