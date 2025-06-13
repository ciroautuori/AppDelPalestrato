import { defineStore } from 'pinia';
import { nutritionService } from '@/services/nutritionService';
import { useToast } from '@/composables/useToast';

export const useAthleteStore = defineStore('athlete', {
  state: () => ({
    assignedNutritionPlans: [],
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchAssignedNutritionPlans() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await nutritionService.getNutritionPlans();
        this.assignedNutritionPlans = response.data;
      } catch (error) {
        this.error = error.response?.data?.detail || 'Error fetching assigned nutrition plans';
        useToast().error(this.error);
      } finally {
        this.isLoading = false;
      }
    }
  }
}); 