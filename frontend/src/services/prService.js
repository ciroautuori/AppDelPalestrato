import apiClient from './api';

export const prService = {
  async getPersonalRecords() {
    const response = await apiClient.get('/prs/athlete/me');
    return response.data;
  }
}; 