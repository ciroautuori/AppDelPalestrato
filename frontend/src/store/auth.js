import { defineStore } from 'pinia';
import { authService } from '@/services/authService';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
  }),

  getters: {
    userRole: (state) => state.user?.role,
    isUserAuthenticated: (state) => state.isAuthenticated,
  },

  actions: {
    async login(credentials) {
      try {
        const { access_token, refresh_token } = await authService.login(credentials);
        this.accessToken = access_token;
        this.refreshToken = refresh_token;
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        await this.fetchUser();
        this.isAuthenticated = true;
        return true;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    async fetchUser() {
      try {
        const user = await authService.fetchCurrentUser();
        this.user = user;
        return user;
      } catch (error) {
        console.error('Failed to fetch user:', error);
        await this.logout();
        throw error;
      }
    },

    async logout() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      this.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      await router.push('/login');
    },

    async tryToLogin() {
      if (this.accessToken) {
        try {
          await this.fetchUser();
          this.isAuthenticated = true;
          return true;
        } catch (error) {
          console.error('Auto-login failed:', error);
          await this.logout();
          return false;
        }
      }
      return false;
    },
  },
}); 