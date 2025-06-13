import api from './api';

export const getWorkoutPlans = async () => {
  try {
    const response = await api.get('/plans/');
    return response.data;
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    throw error;
  }
};

export const assignWorkoutPlan = async (assignmentData) => {
  try {
    const response = await api.post('/plans/assignments', assignmentData);
    return response.data;
  } catch (error) {
    console.error('Error assigning workout plan:', error);
    throw error;
  }
};

export const getCoachAthletes = async () => {
  try {
    const response = await api.get('/users/me/athletes');
    return response.data;
  } catch (error) {
    console.error('Error fetching coach athletes:', error);
    throw error;
  }
};
