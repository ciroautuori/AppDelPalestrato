import api from './api';

export const authService = {
  async login(credentials) {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  async fetchCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  },
}; 