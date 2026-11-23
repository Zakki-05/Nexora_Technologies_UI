import api from './client';

export const leaveApi = {
  apply: async (data) => {
    const response = await api.post('/leaves/', data);
    return response.data;
  },

  applyLeave: async (data) => {
    const response = await api.post('/leaves/', data);
    return response.data;
  },

  getMyLeaves: async (params = {}) => {
    const response = await api.get('/leaves/my-leaves', { params });
    return response.data;
  },

  getMyBalances: async () => {
    const response = await api.get('/leaves/my-balances');
    return response.data;
  },

  getMyLeaveBalances: async () => {
    const response = await api.get('/leaves/my-balances');
    return response.data;
  },

  getLedger: async (params = {}) => {
    const response = await api.get('/leaves/ledger', { params });
    return response.data;
  },

  getEmployeeLedger: async (employeeId, params = {}) => {
    const response = await api.get(`/leaves/ledger/${employeeId}`, { params });
    return response.data;
  },

  adjustBalance: async (data) => {
    const response = await api.post('/leaves/adjust-balance', data);
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.patch(`/leaves/${id}/cancel`);
    return response.data;
  },

  cancelLeave: async (id) => {
    const response = await api.patch(`/leaves/${id}/cancel`);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get('/leaves/', { params });
    return response.data;
  },

  getEmployeeLeaves: async (employeeId, params = {}) => {
    const response = await api.get(`/leaves/employee/${employeeId}`, { params });
    return response.data;
  },

  review: async (id, status, rejectionReason = null) => {
    const response = await api.patch(`/leaves/${id}/review`, {
      status,
      rejection_reason: rejectionReason,
    });
    return response.data;
  },

  getBalances: async (employeeId) => {
    const response = await api.get(`/leaves/balances/${employeeId}`);
    return response.data;
  },

  updateBalances: async (employeeId, data) => {
    const response = await api.patch(`/leaves/balances/${employeeId}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/leaves/${id}`);
    return response.data;
  },

  // Leave Types
  getLeaveTypes: async (activeOnly = true) => {
    const response = await api.get('/leave-types/', {
      params: { active_only: activeOnly },
    });
    return response.data;
  },

  createLeaveType: async (data) => {
    const response = await api.post('/leave-types/', data);
    return response.data;
  },

  updateLeaveType: async (id, data) => {
    const response = await api.patch(`/leave-types/${id}`, data);
    return response.data;
  },

  deleteLeaveType: async (id) => {
    const response = await api.delete(`/leave-types/${id}`);
    return response.data;
  },
};
