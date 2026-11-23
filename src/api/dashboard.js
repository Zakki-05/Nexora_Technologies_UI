import api from './client';

export const dashboardApi = {
  getAdminStats: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  getEmployeeStats: async () => {
    const response = await api.get('/dashboard/employee');
    return response.data;
  },
};
