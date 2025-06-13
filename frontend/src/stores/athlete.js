import { defineStore } from 'pinia';
import { athleteService } from '@/services/athleteService';

export const useAthleteStore = defineStore('athlete', {
  state: () => ({
    assignedWorkoutPlans: [],
    assignedNutritionPlans: [],
    personalRecords: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchAssignedWorkoutPlans() {
      this.isLoading = true;
      this.error = null;
      try {
        const plans = await athleteService.getAssignedWorkoutPlans();
        this.assignedWorkoutPlans = plans;
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
        const plans = await athleteService.getAssignedNutritionPlans();
        this.assignedNutritionPlans = plans;
      } catch (err) {
        this.error = err.message || 'Failed to fetch assigned nutrition plans';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchPersonalRecords() {
      this.isLoading = true;
      this.error = null;
      try {
        const records = await athleteService.getPersonalRecords();
        this.personalRecords = records;
      } catch (err) {
        this.error = err.message || 'Failed to fetch personal records';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
});