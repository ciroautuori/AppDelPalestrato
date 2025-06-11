import apiClient from './api';

export const userService = {
  async getAllUsers(params = {}) {
    const response = await apiClient.get('/users/', { params });
    return response.data;
  },
  async createUser(userData) {
    const response = await apiClient.post('/users/', userData);
    return response.data;
  }
}; 