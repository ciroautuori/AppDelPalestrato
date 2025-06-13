import apiClient from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const userService = {
  async getAllUsers() {
    const response = await apiClient.get(`${API_URL}/users/`);
    return response.data;
  },

  async getUserById(userId) {
    const response = await apiClient.get(`${API_URL}/users/${userId}/`);
    return response.data;
  },

  async createUser(userData) {
    const response = await apiClient.post(`${API_URL}/users/`, userData);
    return response.data;
  },

  async updateUser(userId, userData) {
    const response = await apiClient.put(`${API_URL}/users/${userId}/`, userData);
    return response.data;
  },

  async deleteUser(userId) {
    const response = await apiClient.delete(`${API_URL}/users/${userId}/`);
    return response.data;
  },

  async getCoachAthletes(coachId, params) {
    const response = await apiClient.get(`${API_URL}/api/v1/users`, {
      params: {
        coach_id: coachId,
        role: 'athlete',
        ...params,
      },
    });
    return response.data;
  },

  async getUserProfile(userId) {
    const response = await apiClient.get(`${API_URL}/users/${userId}/profile`);
    return response.data;
  },

  async getUserFollowers(userId) {
    const response = await apiClient.get(`${API_URL}/users/${userId}/followers`);
    return response.data;
  },

  async getUserFollowing(userId) {
    const response = await apiClient.get(`${API_URL}/users/${userId}/following`);
    return response.data;
  },

  async followUser(userId) {
    const response = await apiClient.post(`${API_URL}/users/${userId}/follow`);
    return response.data;
  },

  async unfollowUser(userId) {
    const response = await apiClient.delete(`${API_URL}/users/${userId}/follow`);
    return response.data;
  }
}; 