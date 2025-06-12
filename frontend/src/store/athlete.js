import { defineStore } from 'pinia';
import { athleteService } from '@/services/athleteService';
import { useToastStore } from '@/store/toast';

export const useAthleteStore = defineStore('athlete', {
  state: () => ({
    assignedWorkoutPlan: null,
    assignedNutritionPlan: null,
    workoutHistory: [],
    isLoading: false,
    error: null,
    isLoggingWorkout: false,
    logWorkoutError: null
  }),

  actions: {
    async fetchMyData() {
      this.isLoading = true;
      this.error = null;
      try {
        const [workoutPlan, nutritionPlan] = await Promise.all([
          athleteService.getAssignedWorkoutPlan(),
          athleteService.getAssignedNutritionPlan()
        ]);
        this.assignedWorkoutPlan = workoutPlan;
        this.assignedNutritionPlan = nutritionPlan;
      } catch (err) {
        this.error = err.response?.data?.detail || 'Errore nel recupero dei dati dell\'atleta';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchWorkoutHistory() {
      this.isLoading = true;
      this.error = null;
      try {
        const history = await athleteService.getWorkoutHistory();
        this.workoutHistory = history;
      } catch (err) {
        this.error = err.response?.data?.detail || 'Errore nel recupero dello storico degli allenamenti';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async logWorkout(workoutData) {
      const toastStore = useToastStore();
      this.isLoggingWorkout = true;
      this.logWorkoutError = null;
      try {
        await athleteService.logWorkout(workoutData);
        // Aggiorna lo storico dopo il salvataggio
        await this.fetchWorkoutHistory();
      } catch (err) {
        this.logWorkoutError = err.response?.data?.detail || 'Errore durante il salvataggio dell\'allenamento';
        throw err;
      } finally {
        this.isLoggingWorkout = false;
      }
    }
  }
}); 