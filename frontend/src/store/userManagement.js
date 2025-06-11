import { defineStore } from 'pinia';
import { userService } from '@/services/userService';

export const useUserManagementStore = defineStore('userManagement', {
  state: () => ({
    users: [],
    isLoading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalUsers: 0,
      perPage: 10
    }
  }),
  actions: {
    async fetchUsers(page = 1) {
      this.isLoading = true;
      this.error = null;
      try {
        const params = { skip: (page - 1) * this.pagination.perPage, limit: this.pagination.perPage };
        const data = await userService.getAllUsers(params);
        this.users = data.users;
        this.pagination.totalUsers = data.total;
        this.pagination.currentPage = page;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    async addUser(userData) {
      this.isLoading = true;
      this.error = null;
      try {
        const newUser = await userService.createUser(userData);
        this.users.push(newUser);
        return newUser;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    }
  },
  getters: {
    paginatedUsers: (state) => state.users
  }
}); 