import apiClient from '@/services/apiClient';
import type { PaginatedResponse } from '@/types/api';
import type { AuthTokenPayload, User } from '@/types/hr';

export const authService = {
  login: async (email: string, password: string): Promise<AuthTokenPayload> => {
    const response = await apiClient.post<AuthTokenPayload>('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string; success?: boolean }> => {
    const response = await apiClient.post<{ message: string; success?: boolean }>('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('refreshToken');
        window.localStorage.removeItem('user');
      }
    }
  },

  getUsers: async (params: Record<string, string | number | boolean | undefined> = {}): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>('/auth/users', { params });
    return response.data;
  },

  updateUserStatus: async (userId: number, isActive: boolean): Promise<User> => {
    const response = await apiClient.patch<User>(`/auth/users/${userId}/status`, {
      is_active: isActive,
    });
    return response.data;
  },

  updateUserRole: async (userId: number, role: string): Promise<User> => {
    const response = await apiClient.patch<User>(`/auth/users/${userId}/role`, { role });
    return response.data;
  },

  registerUser: async (userData: { username?: string; email: string; password: string; role?: string }): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register', userData);
    return response.data;
  },
};
