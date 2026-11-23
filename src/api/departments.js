import api from './client';

export const departmentApi = {
  getDepartments: async (params = {}) => {
    const response = await api.get('/departments/', { params });
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get('/departments/', { params });
    return response.data;
  },

  getAllList: async () => {
    const response = await api.get('/departments/', { params: { all: true } });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  },

  getEmployees: async (id, params = {}) => {
    const response = await api.get(`/departments/${id}/employees`, { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/departments/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/departments/${id}`, data);
    return response.data;
  },

  reassign: async (id, targetDepartmentId) => {
    const response = await api.post(`/departments/${id}/reassign`, {
      target_department_id: targetDepartmentId,
    });
    return response.data;
  },

  delete: async (id, reassignTo = null) => {
    const response = await api.delete(`/departments/${id}`, {
      params: reassignTo ? { reassign_to: reassignTo } : {},
    });
    return response.data;
  },
};
