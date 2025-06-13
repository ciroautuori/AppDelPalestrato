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
    async fetchAssignedWorkoutPlans(forceRefresh = false) {
      if (this.assignedWorkoutPlans.length > 0 && !forceRefresh) {
        return; // Dati già presenti, esci subito.
      }
      this.isLoading = true;
      this.error = null;
      try {
        // athleteService.getAssignedWorkoutPlans() restituisce già i dati estratti (response.data)
        const plans = await athleteService.getAssignedWorkoutPlans();
        this.assignedWorkoutPlans = plans;
      } catch (err) {
        this.error = err.message || 'Failed to fetch assigned workout plans';
        console.error("Errore nel caricare i piani di allenamento assegnati:", err);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchAssignedNutritionPlans(forceRefresh = false) {
      if (this.assignedNutritionPlans.length > 0 && !forceRefresh) {
        return; // Dati già presenti, esci subito.
      }
      this.isLoading = true;
      this.error = null;
      try {
        // athleteService.getAssignedNutritionPlans() restituisce già i dati estratti (response.data)
        const plans = await athleteService.getAssignedNutritionPlans();
        this.assignedNutritionPlans = plans;
      } catch (err) {
        this.error = err.message || 'Failed to fetch assigned nutrition plans';
        console.error("Errore nel caricare i piani nutrizionali assegnati:", err);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchPersonalRecords(forceRefresh = false) {
      if (this.personalRecords.length > 0 && !forceRefresh) {
        return; // Dati già presenti, esci subito.
      }
      this.isLoading = true; // Usa uno stato di loading specifico se preferisci
      this.error = null; // Resetta l'errore prima di una nuova chiamata
      try {
        // Assicurati che athleteService sia importato correttamente in questo file
        const response = await athleteService.getPersonalRecords();
        // La risposta Axios di solito ha i dati in response.data
        // Se athleteService.getPersonalRecords() restituisce già i dati estratti, allora usa direttamente 'response'
        this.personalRecords = response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch personal records'; // Usa uno stato di errore specifico
        console.error("Errore nel caricare i PR:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});