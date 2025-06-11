import { defineStore } from 'pinia';
import {
  getCoachPlans,
  createPlan,
  updatePlan,
  deletePlan,
  getExercises,
} from '@/services/planService'; // Assuming @ refers to frontend/src

export const usePlanManagementStore = defineStore('planManagement', {
  state: () => ({
    plans: [],
    exercises: [],
    isLoading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: 10, // Default per page
    },
    exercisePagination: { // Pagination for exercises
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: 10,
    },
    isLoadingExercises: false, // Separate loading state for exercises
    errorExercises: null, // Separate error state for exercises
    // currentCoachId: null, // Example: if you need to store the active coach's ID
  }),
  actions: {
    // Example action to set coachId if needed
    // setCurrentCoachId(coachId) {
    //   this.currentCoachId = coachId;
    // },

    async fetchCoachPlans(coachId, params) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await getCoachPlans(coachId, params);
        // Assuming the API returns data in a structure like:
        // { items: [...], total: ..., page: ..., per_page: ... }
        // Adjust based on your actual API response structure
        this.plans = response.data.items || response.data;
        this.pagination = {
          currentPage: response.data.page || 1,
          totalPages: response.data.pages || Math.ceil((response.data.total || 0) / (response.data.per_page || this.pagination.perPage)),
          totalItems: response.data.total || 0,
          perPage: response.data.per_page || this.pagination.perPage,
        };
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch plans';
        this.plans = []; // Reset plans on error
      } finally {
        this.isLoading = false;
      }
    },

    async addPlan(planData, coachIdToRefresh) { // coachIdToRefresh might be this.currentCoachId
      this.isLoading = true;
      this.error = null;
      try {
        await createPlan(planData);
        // After creating, refresh the plans list for the coach.
        // This ensures pagination and the list are up-to-date.
        // Assumes coachIdToRefresh is available (e.g., passed or from state)
        if (coachIdToRefresh) {
          await this.fetchCoachPlans(coachIdToRefresh, { page: this.pagination.currentPage, perPage: this.pagination.perPage });
        } else {
          // If no coachId is available to refresh, the list might become stale.
          // Consider how to handle this case, e.g., by setting an error or warning.
          console.warn('addPlan: coachIdToRefresh not provided, plans list may be stale.');
          // Or, if createPlan returns the created item and you don't need to worry about pagination immediately:
          // const newPlan = response.data;
          // this.plans.push(newPlan); // This would require API to return the new plan
        }
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Failed to create plan';
      } finally {
        this.isLoading = false;
      }
    },

    async editPlan(planId, planData, coachIdToRefresh) {
      this.isLoading = true;
      this.error = null;
      try {
        const updatedPlan = await updatePlan(planId, planData); // Assuming this returns the updated plan
        const index = this.plans.findIndex(p => p.id === planId);
        if (index !== -1 && updatedPlan.data) {
          this.plans.splice(index, 1, updatedPlan.data);
        } else {
          // Fallback to re-fetching if the plan wasn't found or API didn't return it
          // This requires coachIdToRefresh to be available
          if (coachIdToRefresh) {
            await this.fetchCoachPlans(coachIdToRefresh, { page: this.pagination.currentPage, perPage: this.pagination.perPage });
          } else {
            console.warn('editPlan: coachIdToRefresh not provided and plan not updated directly, list may be stale.');
          }
        }
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Failed to update plan';
      } finally {
        this.isLoading = false;
      }
    },

    async removePlan(planId, coachIdToRefresh) {
      this.isLoading = true;
      this.error = null;
      try {
        await deletePlan(planId);
        // After deleting, refresh the plans list.
        // Consider edge cases like deleting the last item on a page.
        // The fetchCoachPlans action might need adjustment if the current page becomes empty.
        if (coachIdToRefresh) {
          await this.fetchCoachPlans(coachIdToRefresh, { page: this.pagination.currentPage, perPage: this.pagination.perPage });
        } else {
          console.warn('removePlan: coachIdToRefresh not provided, plans list may be stale.');
        }
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Failed to delete plan';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchExercises(params) {
      this.isLoadingExercises = true;
      this.errorExercises = null;
      try {
        const response = await getExercises(params);
        // Assuming API response structure similar to plans:
        // { items: [...], total: ..., page: ..., per_page: ... }
        this.exercises = response.data.items || response.data;
        this.exercisePagination = {
          currentPage: response.data.page || 1,
          totalPages: response.data.pages || Math.ceil((response.data.total || 0) / (response.data.per_page || this.exercisePagination.perPage)),
          totalItems: response.data.total || 0,
          perPage: response.data.per_page || this.exercisePagination.perPage,
        };
      } catch (err) {
        this.errorExercises = err.response?.data?.message || err.message || 'Failed to fetch exercises';
        this.exercises = []; // Reset exercises on error
      } finally {
        this.isLoadingExercises = false;
      }
    },
  },
});
