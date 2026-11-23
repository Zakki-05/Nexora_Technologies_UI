import api from './client';

export const authApi = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/auth/users', { params });
    return response.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await api.patch(`/auth/users/${userId}/status`, {
      is_active: isActive,
    });
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.patch(`/auth/users/${userId}/role`, { role });
    return response.data;
  },

  registerUser: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};
