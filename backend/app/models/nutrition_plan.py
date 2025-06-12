from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


class NutritionPlan(Base):
    __tablename__ = "nutrition_plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    total_calories = Column(Float, default=0)
    total_protein = Column(Float, default=0)
    total_carbs = Column(Float, default=0)
    total_fats = Column(Float, default=0)
    created_by_user_id = Column(
        Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    created_by = relationship("User", back_populates="created_nutrition_plans")
    meals = relationship(
        "Meal", back_populates="nutrition_plan", cascade="all, delete-orphan")
    assignments = relationship(
        "NutritionPlanAssignment", back_populates="nutrition_plan")


class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    nutrition_plan_id = Column(Integer, ForeignKey(
        "nutrition_plans.id"), nullable=False)
    name = Column(String, nullable=False)  # e.g., "Breakfast", "Lunch"
    time = Column(String, nullable=False)  # e.g., "08:00"
    order_in_plan = Column(Integer, nullable=False)
    total_calories = Column(Float, default=0)
    total_protein = Column(Float, default=0)
    total_carbs = Column(Float, default=0)
    total_fats = Column(Float, default=0)

    # Relationships
    nutrition_plan = relationship("NutritionPlan", back_populates="meals")
    food_items = relationship(
        "FoodItem", back_populates="meal", cascade="all, delete-orphan")


class FoodItem(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    meal_id = Column(Integer, ForeignKey("meals.id"), nullable=False)
    name = Column(String, nullable=False)
    quantity = Column(String, nullable=False)  # e.g., "100g", "1 cup"
    calories = Column(Float, nullable=False)
    protein = Column(Float, nullable=False)
    carbs = Column(Float, nullable=False)
    fats = Column(Float, nullable=False)
    order_in_meal = Column(Integer, nullable=False)

    # Relationships
    meal = relationship("Meal", back_populates="food_items")


class NutritionPlanAssignment(Base):
    __tablename__ = "nutrition_plan_assignments"

    id = Column(Integer, primary_key=True, index=True)
    nutrition_plan_id = Column(Integer, ForeignKey(
        "nutrition_plans.id"), nullable=False)
    athlete_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_by_coach_id = Column(
        Integer, ForeignKey("users.id"), nullable=False)
    assigned_date = Column(DateTime, default=datetime.utcnow)
    start_date = Column(DateTime, nullable=True)
    # assigned, in_progress, completed, cancelled
    status = Column(String, default="assigned")

    # Relationships
    nutrition_plan = relationship(
        "NutritionPlan", back_populates="assignments")
    athlete = relationship("User", foreign_keys=[
                           athlete_id], back_populates="assigned_nutrition_plans")
    assigned_by = relationship("User", foreign_keys=[
                               assigned_by_coach_id], back_populates="assigned_by_nutrition_plans")
