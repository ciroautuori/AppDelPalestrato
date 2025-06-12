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
  }
}; 