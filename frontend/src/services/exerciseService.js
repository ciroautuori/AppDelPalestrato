import api from './api';

export const exerciseService = {
  async getAllExercises() {
    const response = await api.get('/exercises/');
    return response.data;
  },

  async getExerciseById(id) {
    const response = await api.get(`/exercises/${id}/`);
    return response.data;
  },

  async createExercise(exerciseData) {
    const response = await api.post('/exercises/', exerciseData);
    return response.data;
  },

  async updateExercise(id, exerciseData) {
    const response = await api.put(`/exercises/${id}/`, exerciseData);
    return response.data;
  },

  async deleteExercise(id) {
    const response = await api.delete(`/exercises/${id}/`);
    return response.data;
  }
}; 