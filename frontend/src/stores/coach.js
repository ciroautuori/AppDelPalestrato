import { defineStore } from 'pinia';
import { nutritionService } from '@/services/nutritionService';
import { userService } from '@/services/userService';
import { useToast } from '@/composables/useToast';

export const useCoachStore = defineStore('coach', {
  state: () => ({
    athletes: [],
    nutritionPlans: [],
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchCoachData() {
      this.isLoading = true;
      this.error = null;
      try {
        // Fetch athletes
        const athletesResponse = await userService.getCoachAthletes();
        this.athletes = athletesResponse.data;

        // Fetch nutrition plans
        const plansResponse = await nutritionService.getNutritionPlans();
        this.nutritionPlans = plansResponse.data;
      } catch (error) {
        this.error = error.response?.data?.detail || 'Error fetching coach data';
        useToast().error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async assignPlan(assignmentData) {
      this.isLoading = true;
      this.error = null;
      try {
        await nutritionService.assignNutritionPlan(assignmentData);
        useToast().success('Nutrition plan assigned successfully');
        // Refresh the data to get the updated list
        await this.fetchCoachData();
      } catch (error) {
        this.error = error.response?.data?.detail || 'Error assigning nutrition plan';
        useToast().error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  }
}); 