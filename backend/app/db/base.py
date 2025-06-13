# Import Base from the database core
from app.core.database import Base

# Import all existing SQLAlchemy models
from app.models.user import User
from app.models.exercise import Exercise
from app.models.plan import Plan, PlanAssignment, PlanExerciseDetails
from app.models.workout_log import WorkoutLog
from app.models.nutrition_plan import NutritionPlan, NutritionPlanAssignment

# Import the new PersonalRecord model
from app.models.pr import PersonalRecord
