import api from './client';

export const employeeApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/employees/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  getMyProfile: async () => {
    const response = await api.get('/employees/me');
    return response.data;
  },

  updateMyProfile: async (data) => {
    const response = await api.patch('/employees/me', data);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/employees/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  patch: async (id, data) => {
    const response = await api.patch(`/employees/${id}`, data);
    return response.data;
  },

  updateStatus: async (id, employmentStatus) => {
    const response = await api.patch(`/employees/${id}/status`, {
      employment_status: employmentStatus,
    });
    return response.data;
  },

  delete: async (id, hardDelete = false) => {
    const response = await api.delete(`/employees/${id}`, {
      params: { hard_delete: hardDelete },
    });
    return response.data;
  },

  // Avatar Management & Approval Workflow
  uploadAvatar: async (formData) => {
    const response = await api.post('/employees/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getPendingAvatarRequests: async () => {
    const response = await api.get('/employees/avatar-requests/pending');
    return response.data;
  },

  reviewAvatarRequest: async (employeeId, data) => {
    const response = await api.post(`/employees/${employeeId}/avatar-review`, data);
    return response.data;
  },
};
