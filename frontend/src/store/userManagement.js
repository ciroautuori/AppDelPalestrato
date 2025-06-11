import { defineStore } from 'pinia';
import { userService } from '@/services/userService';

export const useUserManagementStore = defineStore('userManagement', {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false,
    errorMessage: null
  }),

  getters: {
    getUsers: (state) => state.users,
    getUserById: (state) => (userId) => state.users.find(user => user.id === userId),
    getLoadingStatus: (state) => state.loading,
    getErrorMessage: (state) => state.errorMessage
  },

  actions: {
    async fetchUsers() {
      this.loading = true;
      this.errorMessage = null;
      try {
        const users = await userService.getAllUsers();
        this.users = users;
      } catch (error) {
        this.errorMessage = error.response?.data?.detail || 'Errore nel caricamento degli utenti';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUser(userId) {
      this.loading = true;
      this.errorMessage = null;
      try {
        const user = await userService.getUserById(userId);
        this.currentUser = user;
        return user;
      } catch (error) {
        this.errorMessage = error.response?.data?.detail || 'Errore nel caricamento dell\'utente';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData) {
      this.loading = true;
      this.errorMessage = null;
      try {
        const newUser = await userService.createUser(userData);
        this.users.push(newUser);
        return newUser;
      } catch (error) {
        this.errorMessage = error.response?.data?.detail || 'Errore nella creazione dell\'utente';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(userId, userData) {
      this.loading = true;
      this.errorMessage = null;
      try {
        const updatedUser = await userService.updateUser(userId, userData);
        const index = this.users.findIndex(user => user.id === userId);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        return updatedUser;
      } catch (error) {
        this.errorMessage = error.response?.data?.detail || 'Errore nell\'aggiornamento dell\'utente';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(userId) {
      this.loading = true;
      this.errorMessage = null;
      try {
        await userService.deleteUser(userId);
        const index = this.users.findIndex(user => user.id === userId);
        if (index !== -1) {
          this.users[index].is_active = false;
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.detail || 'Errore nella disattivazione dell\'utente';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
}); 