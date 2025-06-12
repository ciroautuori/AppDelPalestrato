import api from './api';

export const coachService = {
  // Athletes Management
  async getMyAthletes() {
    const response = await api.get('/users/me/athletes');
    return response.data;
  },

  // Plans Management
  async getMyPlans() {
    const response = await api.get('/plans/');
    return response.data;
  },

  async getPlanDetails(planId) {
    const response = await api.get(`/plans/${planId}`);
    return response.data;
  },

  async createPlan(planData) {
    const response = await api.post('/plans/', planData);
    return response.data;
  },

  async updatePlan(planId, planData) {
    const response = await api.put(`/plans/${planId}`, planData);
    return response.data;
  },

  async deletePlan(planId) {
    const response = await api.delete(`/plans/${planId}`);
    return response.data;
  },

  // Plan Assignments
  async assignPlanToAthlete(assignmentData) {
    const response = await api.post('/plans/assignments', assignmentData);
    return response.data;
  },

  async getPlanAssignments() {
    const response = await api.get('/plans/assignments');
    return response.data;
  },

  async updatePlanAssignment(assignmentId, assignmentData) {
    const response = await api.put(`/plans/assignments/${assignmentId}`, assignmentData);
    return response.data;
  },

  async deletePlanAssignment(assignmentId) {
    const response = await api.delete(`/plans/assignments/${assignmentId}`);
    return response.data;
  }
}; 