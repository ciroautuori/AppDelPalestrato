import api from './api';

export const getNutritionPlans = async () => {
  try {
    const response = await api.get('/nutrition-plans/');
    return response.data;
  } catch (error) {
    console.error('Error fetching nutrition plans:', error);
    throw error;
  }
};

export const assignNutritionPlan = async (assignmentData) => {
  try {
    const response = await api.post('/nutrition-plans/assignments', assignmentData);
    return response.data;
  } catch (error) {
    console.error('Error assigning nutrition plan:', error);
    throw error;
  }
};
