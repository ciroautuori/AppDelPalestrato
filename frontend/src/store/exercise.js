import { defineStore } from 'pinia';
import { exerciseService } from '@/services/exerciseService';

export const useExerciseStore = defineStore('exercise', {
  state: () => ({
    exercises: [],
    loading: false,
    error: null
  }),

  getters: {
    getExercises: (state) => state.exercises,
    getLoading: (state) => state.loading,
    getError: (state) => state.error
  },

  actions: {
    async fetchExercises() {
      this.loading = true;
      this.error = null;
      try {
        const exercises = await exerciseService.getAllExercises();
        this.exercises = exercises;
      } catch (error) {
        this.error = error.response?.data?.detail || 'Errore nel caricamento degli esercizi';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
}); 