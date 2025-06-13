import apiClient from './api';

export const athleteService = {
  // ... existing code ...

  async getWorkoutHistory() {
    const response = await apiClient.get('/workout-logs/');
    return response.data;
  },

  async getWorkoutLogDetails(logId) {
    const response = await apiClient.get(`/workout-logs/${logId}`);
    return response.data;
  },

  async logWorkout(workoutData) {
    const response = await apiClient.post('/athlete/me/workouts', workoutData);
    return response.data; // This will include new_pr_achieved status
  }
}; 