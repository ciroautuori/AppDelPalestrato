import { defineStore } from 'pinia';
import { coachService } from '@/services/coachService';
import { useToastStore } from '@/store/toast';

export const useCoachStore = defineStore('coach', {
  state: () => ({
    // Athletes state
    myAthletes: [],
    athletesLoading: false,
    athletesError: null,

    // Plans state
    myPlans: [],
    plansLoading: false,
    plansError: null,

    // Assignments state
    planAssignments: [],
    assignmentsLoading: false,
    assignmentsError: null,

    // Current plan being edited/viewed
    currentPlan: null,
    currentPlanLoading: false,
    currentPlanError: null
  }),

  getters: {
    // Athletes getters
    getMyAthletes: (state) => state.myAthletes,
    getAthletesLoading: (state) => state.athletesLoading,
    getAthletesError: (state) => state.athletesError,

    // Plans getters
    getMyPlans: (state) => state.myPlans,
    getPlansLoading: (state) => state.plansLoading,
    getPlansError: (state) => state.plansError,

    // Assignments getters
    getPlanAssignments: (state) => state.planAssignments,
    getAssignmentsLoading: (state) => state.assignmentsLoading,
    getAssignmentsError: (state) => state.assignmentsError,

    // Current plan getters
    getCurrentPlan: (state) => state.currentPlan,
    getCurrentPlanLoading: (state) => state.currentPlanLoading,
    getCurrentPlanError: (state) => state.currentPlanError
  },

  actions: {
    // Athletes actions
    async fetchMyAthletes() {
      this.athletesLoading = true;
      this.athletesError = null;
      try {
        const athletes = await coachService.getMyAthletes();
        this.myAthletes = athletes;
      } catch (error) {
        this.athletesError = error.response?.data?.detail || 'Errore nel caricamento degli atleti';
        throw error;
      } finally {
        this.athletesLoading = false;
      }
    },

    // Plans actions
    async fetchMyPlans() {
      this.plansLoading = true;
      this.plansError = null;
      try {
        const plans = await coachService.getMyPlans();
        this.myPlans = plans;
      } catch (error) {
        this.plansError = error.response?.data?.detail || 'Errore nel caricamento dei piani';
        throw error;
      } finally {
        this.plansLoading = false;
      }
    },

    async fetchPlanDetails(planId) {
      this.currentPlanLoading = true;
      this.currentPlanError = null;
      try {
        const plan = await coachService.getPlanDetails(planId);
        this.currentPlan = plan;
        return plan;
      } catch (error) {
        this.currentPlanError = error.response?.data?.detail || 'Errore nel caricamento del piano';
        throw error;
      } finally {
        this.currentPlanLoading = false;
      }
    },

    async createPlan(planData) {
      this.plansLoading = true;
      this.plansError = null;
      try {
        const newPlan = await coachService.createPlan(planData);
        await this.fetchMyPlans(); // Refresh the plans list
        return newPlan;
      } catch (error) {
        this.plansError = error.response?.data?.detail || 'Errore nella creazione del piano';
        throw error;
      } finally {
        this.plansLoading = false;
      }
    },

    async updatePlan(planId, planData) {
      this.plansLoading = true;
      this.plansError = null;
      try {
        const updatedPlan = await coachService.updatePlan(planId, planData);
        await this.fetchMyPlans(); // Refresh the plans list
        return updatedPlan;
      } catch (error) {
        this.plansError = error.response?.data?.detail || 'Errore nell\'aggiornamento del piano';
        throw error;
      } finally {
        this.plansLoading = false;
      }
    },

    async deletePlan(planId) {
      this.plansLoading = true;
      this.plansError = null;
      try {
        await coachService.deletePlan(planId);
        await this.fetchMyPlans(); // Refresh the plans list
      } catch (error) {
        this.plansError = error.response?.data?.detail || 'Errore nell\'eliminazione del piano';
        throw error;
      } finally {
        this.plansLoading = false;
      }
    },

    // Assignments actions
    async fetchPlanAssignments() {
      this.assignmentsLoading = true;
      this.assignmentsError = null;
      try {
        const assignments = await coachService.getPlanAssignments();
        this.planAssignments = assignments;
      } catch (error) {
        this.assignmentsError = error.response?.data?.detail || 'Errore nel caricamento delle assegnazioni';
        throw error;
      } finally {
        this.assignmentsLoading = false;
      }
    },

    async assignPlanToAthlete(assignmentData) {
      this.assignmentsLoading = true;
      this.assignmentsError = null;
      try {
        const assignment = await coachService.assignPlanToAthlete(assignmentData);
        await this.fetchPlanAssignments(); // Refresh assignments list
        return assignment;
      } catch (error) {
        this.assignmentsError = error.response?.data?.detail || 'Errore nell\'assegnazione del piano';
        throw error;
      } finally {
        this.assignmentsLoading = false;
      }
    },

    async updatePlanAssignment(assignmentId, assignmentData) {
      this.assignmentsLoading = true;
      this.assignmentsError = null;
      try {
        const assignment = await coachService.updatePlanAssignment(assignmentId, assignmentData);
        await this.fetchPlanAssignments(); // Refresh assignments list
        return assignment;
      } catch (error) {
        this.assignmentsError = error.response?.data?.detail || 'Errore nell\'aggiornamento dell\'assegnazione';
        throw error;
      } finally {
        this.assignmentsLoading = false;
      }
    },

    async deletePlanAssignment(assignmentId) {
      this.assignmentsLoading = true;
      this.assignmentsError = null;
      try {
        await coachService.deletePlanAssignment(assignmentId);
        await this.fetchPlanAssignments(); // Refresh assignments list
      } catch (error) {
        this.assignmentsError = error.response?.data?.detail || 'Errore nell\'eliminazione dell\'assegnazione';
        throw error;
      } finally {
        this.assignmentsLoading = false;
      }
    }
  }
}); 