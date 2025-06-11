import api from './api';

/**
 * Assigns a plan to an athlete.
 * @param {object} assignmentData - The assignment data, containing plan_id and athlete_id.
 * @returns {Promise<object>} A promise that resolves to the API response.
 */
export const assignPlan = (assignmentData) => {
  return api.post('/api/v1/plans/assignments', assignmentData);
};
