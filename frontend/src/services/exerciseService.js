import axios from 'axios';

const API_URL = '/api/v1';

export const exerciseService = {
  async getAllExercises() {
    const response = await axios.get(`${API_URL}/exercises/`);
    return response.data;
  },

  async getExerciseById(id) {
    const response = await axios.get(`${API_URL}/exercises/${id}/`);
    return response.data;
  }
}; 