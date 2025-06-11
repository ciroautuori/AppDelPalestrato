import api from './api';

/**
 * Fetches the plans for a given coach.
 * @param {string} coachId - The ID of the coach.
 * @param {object} params - Additional parameters for pagination and filtering.
 * @returns {Promise<object>} A promise that resolves to the API response.
 */
export const getCoachPlans = (coachId, params) => {
  return api.get('/api/v1/plans', {
    params: {
      created_by_user_id: coachId,
      ...params,
    },
  });
};

/**
 * Creates a new plan.
 * @param {object} planData - The data for the new plan.
 * @returns {Promise<object>} A promise that resolves to the API response.
 */
export const createPlan = (planData) => {
  return api.post('/api/v1/plans/', planData);
};

/**
 * Updates an existing plan.
 * @param {string} planId - The ID of the plan to update.
 * @param {object} planData - The updated plan data.
 * @returns {Promise<object>} A promise that resolves to the API response.
 */
export const updatePlan = (planId, planData) => {
  return api.put(`/api/v1/plans/${planId}`, planData);
};

/**
 * Deletes a plan.
 * @param {string} planId - The ID of the plan to delete.
 * @returns {Promise<object>} A promise that resolves to the API response.
 */
export const deletePlan = (planId) => {
  return api.delete(`/api/v1/plans/${planId}`);
};

/**
 * Fetches exercises.
 * @param {object} params - Parameters for pagination and filtering.
 * @returns {Promise<object>} A promise that resolves to the API response.
 */
export const getExercises = (params) => {
  return api.get('/api/v1/exercises/', { params });
};

/**
 * Fetches plans assigned to a specific athlete.
 * @param {string} athleteId - The ID of the athlete.
 * @param {object} params - Additional parameters for pagination and filtering.
 * @returns {Promise<object>} A promise that resolves to the API response.
 */
export const getAssignedPlans = (athleteId, params) => {
  return api.get('/api/v1/plans/assignments', {
    params: {
      athlete_id: athleteId,
      ...params,
    },
  });
};
