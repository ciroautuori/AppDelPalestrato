import { defineStore } from 'pinia';
import * as planService from '@/services/planService'; // Assuming workout plans are fetched via planService
import * as nutritionService from '@/services/nutritionService';

export const useAthleteStore = defineStore('athlete', {
  state: () => ({
    assignedWorkoutPlans: [],
    assignedNutritionPlans: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchAssignedWorkoutPlans() {
      this.isLoading = true;
      this.error = null;
      try {
        // This endpoint likely needs to be specific to the athlete,
        // e.g., /api/v1/plans/assignments/me or similar.
        // Using getWorkoutPlans() as a placeholder based on issue description.
        // This will likely fetch ALL plans, not just assigned ones.
        // This should be /api/v1/plans/assignments/me or similar to get athlete specific plans
        const plans = await planService.getWorkoutPlans();
        this.assignedWorkoutPlans = plans; // Placeholder: filter or use correct endpoint
      } catch (err) {
        this.error = err.message || 'Failed to fetch assigned workout plans';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchAssignedNutritionPlans() {
      this.isLoading = true;
      this.error = null;
      try {
        // Similar to workout plans, this endpoint needs to be athlete-specific.
        // This should be /api/v1/nutrition-plans/assignments/me or similar
        const plans = await nutritionService.getNutritionPlans();
        this.assignedNutritionPlans = plans; // Placeholder: filter or use correct endpoint
      } catch (err) {
        this.error = err.message || 'Failed to fetch assigned nutrition plans';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
});