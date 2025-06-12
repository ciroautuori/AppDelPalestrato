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
    },

    async createExercise(exerciseData) {
      this.loading = true;
      this.error = null;
      try {
        const newExercise = await exerciseService.createExercise(exerciseData);
        this.exercises.push(newExercise);
        return newExercise;
      } catch (error) {
        this.error = error.response?.data?.detail || 'Errore nella creazione dell\'esercizio';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateExercise(id, exerciseData) {
      this.loading = true;
      this.error = null;
      try {
        const updatedExercise = await exerciseService.updateExercise(id, exerciseData);
        const index = this.exercises.findIndex(ex => ex.id === id);
        if (index !== -1) {
          this.exercises[index] = updatedExercise;
        }
        return updatedExercise;
      } catch (error) {
        this.error = error.response?.data?.detail || 'Errore nell\'aggiornamento dell\'esercizio';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteExercise(id) {
      this.loading = true;
      this.error = null;
      try {
        await exerciseService.deleteExercise(id);
        this.exercises = this.exercises.filter(ex => ex.id !== id);
      } catch (error) {
        this.error = error.response?.data?.detail || 'Errore nell\'eliminazione dell\'esercizio';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
}); 