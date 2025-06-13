import { defineStore } from 'pinia';
import { prService } from '@/services/prService';
import { useToastStore } from '@/store/toast';

export const usePRStore = defineStore('pr', {
  state: () => ({
    personalRecords: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    getPersonalRecords: (state) => state.personalRecords,
    getLoading: (state) => state.isLoading,
    getError: (state) => state.error,
  },

  actions: {
    async fetchPersonalRecords() {
      this.isLoading = true;
      this.error = null;
      try {
        const records = await prService.getPersonalRecords();
        this.personalRecords = records;
      } catch (error) {
        this.error = error.response?.data?.detail || 'Errore nel caricamento dei record personali';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async checkForNewPR(workoutLogResponse) {
      if (workoutLogResponse.new_pr_achieved) {
        const toastStore = useToastStore();
        toastStore.showSuccess('Nuovo record personale raggiunto! 🎉');
        await this.fetchPersonalRecords(); // Refresh PR list
        return true;
      }
      return false;
    }
  }
}); 