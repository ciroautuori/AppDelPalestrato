import apiClient from './api';

export const getWorkoutPlans = async () => {
  try {
    const response = await apiClient.get('/plans/');
    return response.data;
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    throw error;
  }
};

export const assignWorkoutPlan = async (assignmentData) => {
  try {
    const response = await apiClient.post('/plans/assignments', assignmentData);
    return response.data;
  } catch (error) {
    console.error('Error assigning workout plan:', error);
    throw error;
  }
};

export const getCoachAthletes = async () => {
  try {
    const response = await apiClient.get('/users/me/athletes');
    return response.data;
  } catch (error) {
    console.error('Error fetching coach athletes:', error);
    throw error;
  }
};

export const planService = {
  async getPlans() {
    const response = await apiClient.get('/plans/');
    return response.data;
  },

  async getPlanById(planId) {
    const response = await apiClient.get(`/plans/${planId}`);
    return response.data;
  },

  async createPlan(planData) {
    const response = await apiClient.post('/plans/', planData);
    return response.data;
  },

  async updatePlan(planId, planData) {
    const response = await apiClient.put(`/plans/${planId}`, planData);
    return response.data;
  },

  async deletePlan(planId) {
    const response = await apiClient.delete(`/plans/${planId}`);
    return response.data;
  }
};
