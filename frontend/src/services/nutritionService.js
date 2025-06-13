import api from './api';

// Mock database
let mockPlans = [
  {
    id: 1,
    name: 'Piano Massa Magra Iniziale',
    description: 'Piano per aumentare la massa muscolare.',
    meals: [
      {
        id: 101, // Meal ID
        planId: 1,
        name: 'Colazione Energetica',
        foodItems: [
          { id: 1001, mealId: 101, name: 'Avena Integrale', quantity: '50g', calories: 180, protein: 5, carbs: 30, fats: 3 },
          { id: 1002, mealId: 101, name: 'Latte Parzialmente Scremato', quantity: '200ml', calories: 100, protein: 7, carbs: 10, fats: 3 }
        ]
      },
      {
        id: 102, // Meal ID
        planId: 1,
        name: 'Pranzo Proteico',
        foodItems: [
          { id: 1003, mealId: 102, name: 'Petto di Pollo', quantity: '150g', calories: 250, protein: 45, carbs: 0, fats: 5 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Piano Definizione Base',
    description: 'Piano per ridurre il grasso corporeo, focus su verdure.',
    meals: [] // Start with no meals
  }
];

let nextId = 3; // For plan IDs
let nextMealId = 103; // Next available meal ID, starting after existing ones
let nextFoodItemId = 1004; // Next available foodItem ID, starting after existing ones

const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

export const getNutritionPlans = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(deepCopy(mockPlans));
    }, 500);
  });
};

export const createNutritionPlan = (planData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPlan = {
        id: nextId++,
        name: planData.name,
        description: planData.description,
        meals: [],
      };

      if (planData.meals && Array.isArray(planData.meals)) {
        newPlan.meals = planData.meals.map(meal => {
          const newMeal = {
            ...meal, // name comes from here
            id: nextMealId++,
            planId: newPlan.id,
            foodItems: [],
          };
          if (meal.foodItems && Array.isArray(meal.foodItems)) {
            newMeal.foodItems = meal.foodItems.map(item => ({
              ...item, // name, quantity, calories, macros from here
              id: nextFoodItemId++,
              mealId: newMeal.id,
            }));
          }
          return newMeal;
        });
      }
      mockPlans.push(newPlan);
      resolve(deepCopy(newPlan));
    }, 500);
  });
};

export const updateNutritionPlan = (planId, planData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const planIndex = mockPlans.findIndex(p => p.id === planId);
      if (planIndex !== -1) {
        const existingPlan = mockPlans[planIndex];

        existingPlan.name = planData.name;
        existingPlan.description = planData.description;

        existingPlan.meals = (planData.meals || []).map(mealFromForm => {
          const updatedOrNewMeal = {
            ...mealFromForm,
            planId: existingPlan.id,
          };

          if (!updatedOrNewMeal.id || (typeof updatedOrNewMeal.id === 'string' && updatedOrNewMeal.id.startsWith('temp-meal-'))) {
            updatedOrNewMeal.id = nextMealId++;
          }

          updatedOrNewMeal.foodItems = (mealFromForm.foodItems || []).map(itemFromForm => {
            const updatedOrNewFoodItem = {
              ...itemFromForm,
              mealId: updatedOrNewMeal.id,
            };
            if (!updatedOrNewFoodItem.id || (typeof updatedOrNewFoodItem.id === 'string' && updatedOrNewFoodItem.id.startsWith('temp-food-'))) {
              updatedOrNewFoodItem.id = nextFoodItemId++;
            }
            return updatedOrNewFoodItem;
          });
          return updatedOrNewMeal;
        });

        mockPlans[planIndex] = existingPlan;
        resolve(deepCopy(existingPlan));
      } else {
        reject(new Error('Piano non trovato per aggiornamento'));
      }
    }, 500);
  });
};

export const deleteNutritionPlan = (planId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = mockPlans.length;
      mockPlans = mockPlans.filter(p => p.id !== planId);
      if (mockPlans.length < initialLength) {
        resolve({ success: true }); // Changed to resolve with an object for consistency
      } else {
        reject(new Error('Piano non trovato per eliminazione'));
      }
    }, 500);
  });
};

export const nutritionService = {
  // Get all nutrition plans (returns different results based on user role)
  getNutritionPlans() {
    return api.get('/nutrition-plans/');
  },

  // Assign a nutrition plan to an athlete
  assignNutritionPlan(assignmentData) {
    return api.post('/nutrition-plans/assignments', assignmentData);
  },

  // Get a specific nutrition plan by ID
  getNutritionPlanById(planId) {
    return api.get(`/nutrition-plans/${planId}`);
  }
};
