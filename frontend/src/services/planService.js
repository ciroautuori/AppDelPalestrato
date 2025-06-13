import api from './api';

export const getWorkoutPlans = async () => {
  try {
    const response = await api.get('/api/v1/plans/');
    return response.data;
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    throw error;
  }
};

export const assignWorkoutPlan = async (assignmentData) => {
  try {
    const response = await api.post('/api/v1/plans/assignments', assignmentData);
    return response.data;
  } catch (error) {
    console.error('Error assigning workout plan:', error);
    throw error;
  }
};

export const getCoachAthletes = async () => {
  try {
    const response = await api.get('/api/v1/users/me/athletes');
    return response.data;
  } catch (error) {
    console.error('Error fetching coach athletes:', error);
    throw error;
  }
};
