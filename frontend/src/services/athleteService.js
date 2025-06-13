import api from './api';

export const athleteService = {
  // ... existing code ...

  async getWorkoutHistory() {
    const response = await api.get('/workout-logs/');
    return response.data;
  },

  async getWorkoutLogDetails(logId) {
    const response = await api.get(`/workout-logs/${logId}`);
    return response.data;
  },

  async getAssignedWorkoutPlans() {
    const response = await api.get('/plans/assignments');
    return response.data;
  },

  async getAssignedNutritionPlans() {
    const response = await api.get('/plans/assignments');
    return response.data;
  },

  async getPersonalRecords() {
    const response = await api.get('/prs/athlete/me/personal-records');
    return response.data;
  }
}; 