import api from './api';

export const statsService = {
  async getAdminStats() {
    try {
      const [usersResponse, plansResponse] = await Promise.all([
        api.get('/users/'),
        api.get('/plans/')
      ]);

      const users = usersResponse.data;
      const plans = plansResponse.data;

      return {
        totalUsers: users.length,
        activeCoaches: users.filter(user => user.role === 'coach').length,
        activeAthletes: users.filter(user => user.role === 'athlete').length,
        totalPlans: plans.length
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }
}; 