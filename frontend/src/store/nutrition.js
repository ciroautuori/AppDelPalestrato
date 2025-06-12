import { defineStore } from 'pinia';
import * as nutritionService from '@/services/nutritionService';
import { useToastStore } from '@/store/toast';

export const useNutritionStore = defineStore('nutrition', {
  state: () => ({
    nutritionPlans: [],
    isLoading: false,
  }),
  actions: {
    async fetchNutritionPlans() {
      this.isLoading = true;
      try {
        const data = await nutritionService.getNutritionPlans();
        this.nutritionPlans = data;
      } catch (error) {
        console.error('Error fetching nutrition plans:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async createNutritionPlan(planData) {
      const toastStore = useToastStore();
      this.isLoading = true;
      try {
        await nutritionService.createNutritionPlan(planData);
        await this.fetchNutritionPlans(); // Refresh data
        toastStore.showToast('Piano creato con successo!', 'success');
      } catch (error) {
        console.error('Error creating nutrition plan:', error);
        toastStore.showToast('Errore durante la creazione del piano.', 'error');
      } finally {
        this.isLoading = false;
      }
    },

    async updateNutritionPlan(planId, planData) {
      const toastStore = useToastStore();
      this.isLoading = true;
      try {
        await nutritionService.updateNutritionPlan(planId, planData);
        await this.fetchNutritionPlans(); // Refresh data
        toastStore.showToast('Piano aggiornato con successo!', 'success');
      } catch (error) {
        console.error('Error updating nutrition plan:', error);
        toastStore.showToast("Errore durante l'aggiornamento del piano.", 'error');
      } finally {
        this.isLoading = false;
      }
    },

    async deleteNutritionPlan(planId) {
      const toastStore = useToastStore();
      this.isLoading = true;
      try {
        await nutritionService.deleteNutritionPlan(planId);
        await this.fetchNutritionPlans(); // Refresh data
        toastStore.showToast('Piano eliminato con successo!', 'success');
      } catch (error) {
        console.error('Error deleting nutrition plan:', error);
        toastStore.showToast("Errore durante l'eliminazione del piano.", 'error');
      } finally {
        this.isLoading = false;
      }
    },
  },
});
