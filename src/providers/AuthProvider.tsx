'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';
import type { User } from '@/types/hr';
import type { AxiosError } from 'axios';
import type { ApiErrorShape } from '@/types/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<User | undefined>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isHR: boolean;
  isFinance: boolean;
  isAuditor: boolean;
  isEmployee: boolean;
  role: string | undefined;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = window.localStorage.getItem('token');
      const savedUser = window.localStorage.getItem('user');

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser) as User);
        } catch {
          window.localStorage.removeItem('user');
        }
      }

      if (storedToken) {
        setToken(storedToken);
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          window.localStorage.setItem('user', JSON.stringify(profile));
        } catch {
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('refreshToken');
          window.localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    void initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    try {
      const data = await authService.login(email, password);
      window.localStorage.setItem('token', data.access_token);
      if (data.refresh_token) {
        window.localStorage.setItem('refreshToken', data.refresh_token);
      }
      setToken(data.access_token);

      const profile = data.user || (await authService.getProfile());
      setUser(profile);
      window.localStorage.setItem('user', JSON.stringify(profile));

      const displayName = profile.username || profile.employee?.full_name || 'User';
      toast.success(`Welcome back, ${displayName}!`);
      return profile;
    } catch (error) {
      const axiosErr = error as AxiosError<ApiErrorShape>;
      const msg = axiosErr.response?.data?.message || axiosErr.response?.data?.detail || 'Invalid email or password';
      toast.error(msg);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network errors during logout
    } finally {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('refreshToken');
      window.localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<User | undefined> => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      window.localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch (err) {
      console.error('Failed to refresh profile', err);
      return undefined;
    }
  }, []);

  const role = user?.role?.toUpperCase();
  const isAdmin = role ? ['ADMIN', 'SUPER_ADMIN', 'COMPANY_ADMIN', 'PLATFORM_SUPER_ADMIN'].includes(role) : false;
  const isSuperAdmin = role ? ['SUPER_ADMIN', 'PLATFORM_SUPER_ADMIN'].includes(role) : false;
  const isHR = isAdmin || role === 'HR_MANAGER';
  const isFinance = isAdmin || (role ? ['FINANCE_MANAGER', 'PAYROLL_MANAGER'].includes(role) : false);
  const isAuditor = isAdmin || role === 'AUDITOR';
  const isEmployee = !isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        refreshProfile,
        isAdmin,
        isSuperAdmin,
        isHR,
        isFinance,
        isAuditor,
        isEmployee,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return ctx;
}
