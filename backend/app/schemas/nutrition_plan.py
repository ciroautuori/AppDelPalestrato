from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class FoodItemBase(BaseModel):
    name: str
    quantity: str
    calories: float
    protein: float
    carbs: float
    fats: float
    order_in_meal: int


class FoodItemCreate(FoodItemBase):
    pass


class FoodItemUpdate(FoodItemBase):
    name: Optional[str] = None
    quantity: Optional[str] = None
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fats: Optional[float] = None
    order_in_meal: Optional[int] = None


class FoodItemInDB(FoodItemBase):
    id: int
    meal_id: int

    class Config:
        from_attributes = True


class FoodItem(FoodItemInDB):
    pass


class MealBase(BaseModel):
    name: str
    time: str
    order_in_plan: int


class MealCreate(MealBase):
    food_items: List[FoodItemCreate]


class MealUpdate(MealBase):
    name: Optional[str] = None
    time: Optional[str] = None
    order_in_plan: Optional[int] = None


class MealInDB(MealBase):
    id: int
    nutrition_plan_id: int
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fats: float

    class Config:
        from_attributes = True


class Meal(MealInDB):
    food_items: List[FoodItem]


class NutritionPlanBase(BaseModel):
    name: str
    description: Optional[str] = None


class NutritionPlanCreate(NutritionPlanBase):
    meals: List[MealCreate]


class NutritionPlanUpdate(NutritionPlanBase):
    name: Optional[str] = None


class NutritionPlanInDB(NutritionPlanBase):
    id: int
    created_by_user_id: int
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fats: float

    class Config:
        from_attributes = True


class NutritionPlan(NutritionPlanInDB):
    meals: List[Meal]


class NutritionPlanAssignmentBase(BaseModel):
    nutrition_plan_id: int
    athlete_id: int
    start_date: Optional[datetime] = None


class NutritionPlanAssignmentCreate(NutritionPlanAssignmentBase):
    pass


class NutritionPlanAssignmentUpdate(BaseModel):
    status: Optional[str] = None
    start_date: Optional[datetime] = None


class NutritionPlanAssignmentInDB(NutritionPlanAssignmentBase):
    id: int
    assigned_by_coach_id: int
    assigned_date: datetime
    status: str

    class Config:
        from_attributes = True


class NutritionPlanAssignment(NutritionPlanAssignmentInDB):
    pass
