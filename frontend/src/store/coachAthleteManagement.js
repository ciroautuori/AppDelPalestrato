import { defineStore } from 'pinia';
import { userService } from '@/services/userService'; // Assuming @ refers to frontend/src

export const useCoachAthleteManagementStore = defineStore('coachAthleteManagement', {
  state: () => ({
    athletes: [],
    isLoadingAthletes: false,
    errorAthletes: null,
    paginationAthletes: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: 10, // Default per page
    },
  }),
  actions: {
    async fetchCoachAthletes(coachId, params) {
      this.isLoadingAthletes = true;
      this.errorAthletes = null;
      try {
        // The userService.getCoachAthletes is an async function that returns response.data directly
        const responseData = await userService.getCoachAthletes(coachId, params);

        // Assuming responseData is structured like:
        // { items: [...], total: ..., page: ..., per_page: ... }
        // or similar to how the backend pagination works.
        // Adjust based on your actual API response structure from getCoachAthletes
        this.athletes = responseData.items || responseData; // Fallback if items is not present

        // Make sure to handle cases where pagination data might not be directly available
        // or needs calculation based on total items and items per page.
        const perPage = responseData.per_page || this.paginationAthletes.perPage;
        const totalItems = responseData.total || (responseData.items ? responseData.items.length : 0);

        this.paginationAthletes = {
          currentPage: responseData.page || 1,
          totalPages: responseData.pages || Math.ceil(totalItems / perPage) || 1,
          totalItems: totalItems,
          perPage: perPage,
        };

        // If the responseData is just an array of athletes (no pagination object from backend)
        if (Array.isArray(responseData)) {
            this.athletes = responseData;
            this.paginationAthletes = {
                currentPage: 1,
                totalPages: 1,
                totalItems: responseData.length,
                perPage: responseData.length > 0 ? responseData.length : 10, // Avoid division by zero
            };
        }

      } catch (err) {
        this.errorAthletes = err.response?.data?.message || err.message || 'Failed to fetch athletes';
        this.athletes = []; // Reset athletes on error
      } finally {
        this.isLoadingAthletes = false;
      }
    },
  },
});
