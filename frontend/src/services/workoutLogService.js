import api from './api';

/**
 * Fetches workout logs for a specific athlete.
 * @param {string} athleteId - The ID of the athlete.
 * @param {object} params - Additional parameters for pagination and filtering.
 * @returns {Promise<object>} A promise that resolves to the API response.
 */
export const getAthleteLogs = (athleteId, params) => {
  return api.get('/workout-logs', {
    params: {
      athlete_id: athleteId,
      ...params,
    },
  });
};

/**
 * Creates a new workout log.
 * @param {object} logData - The data for the new workout log.
 * @returns {Promise<object>} A promise that resolves to the API response.
 */
export const createWorkoutLog = (logData) => {
  return api.post('/workout-logs/', logData);
};

// Optionally, export as a default object if preferred by project structure
// export default {
//   getAthleteLogs,
//   createWorkoutLog,
// };
