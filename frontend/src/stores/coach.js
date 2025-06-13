import { defineStore } from 'pinia';
import * as planService from '@/services/planService';
import * as nutritionService from '@/services/nutritionService';

export const useCoachStore = defineStore('coach', {
  state: () => ({
    workoutPlans: [],
    nutritionPlans: [],
    athletes: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchCoachWorkoutData() {
      this.isLoading = true;
      this.error = null;
      try {
        const [workoutPlansData, athletesData] = await Promise.all([
          planService.getWorkoutPlans(),
          planService.getCoachAthletes(),
        ]);
        this.workoutPlans = workoutPlansData;
        this.athletes = athletesData;
      } catch (err) {
        this.error = err.message || 'Failed to fetch coach workout data';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchCoachNutritionData() {
      this.isLoading = true;
      this.error = null;
      try {
        // Fetch athletes only if not already populated by fetchCoachWorkoutData
        // or if a separate call is strictly necessary for nutrition context.
        // For now, let's assume athletes might need to be fresh or specifically scoped.
        const [nutritionPlansData, athletesData] = await Promise.all([
          nutritionService.getNutritionPlans(),
          this.athletes.length === 0 ? planService.getCoachAthletes() : Promise.resolve(this.athletes)
        ]);
        this.nutritionPlans = nutritionPlansData;
        if (this.athletes.length === 0) { // only update if they were fetched
            this.athletes = athletesData;
        }
      } catch (err) {
        this.error = err.message || 'Failed to fetch coach nutrition data';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    async assignWorkoutPlan(assignmentData) {
      // isLoading and error handling can be added here if needed for specific feedback
      try {
        await planService.assignWorkoutPlan(assignmentData);
        // Optionally, refresh data or provide success feedback
      } catch (err) {
        this.error = err.message || 'Failed to assign workout plan';
        console.error(err);
        throw err; // Re-throw to be caught by the component
      }
    },
    async assignNutritionPlan(assignmentData) {
      try {
        await nutritionService.assignNutritionPlan(assignmentData);
        // Optionally, refresh data or provide success feedback
      } catch (err) {
        this.error = err.message || 'Failed to assign nutrition plan';
        console.error(err);
        throw err; // Re-throw to be caught by the component
      }
    },
  },
});