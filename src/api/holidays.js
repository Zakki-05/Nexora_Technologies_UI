import api from './client';

export const holidayApi = {
  getAll: async (yearOrParams = null) => {
    let params = {};
    if (typeof yearOrParams === 'number') {
      params = { year: yearOrParams };
    } else if (typeof yearOrParams === 'object' && yearOrParams !== null) {
      params = yearOrParams;
    }
    const response = await api.get('/holidays/', { params });
    return response.data;
  },

  getHolidays: async (yearOrParams = null) => {
    let params = {};
    if (typeof yearOrParams === 'number') {
      params = { year: yearOrParams };
    } else if (typeof yearOrParams === 'object' && yearOrParams !== null) {
      params = yearOrParams;
    }
    const response = await api.get('/holidays/', { params });
    return response.data;
  },

  getUpcoming: async (limit = 5) => {
    const response = await api.get('/holidays/upcoming', {
      params: { limit },
    });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/holidays/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/holidays/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/holidays/${id}`);
    return response.data;
  },
};
