import api from './api';

export const getNutritionPlans = async () => {
  try {
    const response = await api.get('/api/v1/nutrition-plans/');
    return response.data;
  } catch (error) {
    console.error('Error fetching nutrition plans:', error);
    throw error;
  }
};

export const assignNutritionPlan = async (assignmentData) => {
  try {
    const response = await api.post('/api/v1/nutrition-plans/assignments', assignmentData);
    return response.data;
  } catch (error) {
    console.error('Error assigning nutrition plan:', error);
    throw error;
  }
};
