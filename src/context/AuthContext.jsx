import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const profile = await authApi.getProfile();
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        } catch {
          // Token invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      localStorage.setItem('token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refreshToken', data.refresh_token);
      }
      setToken(data.access_token);

      const profile = data.user || (await authApi.getProfile());
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));

      const displayName = profile?.username || profile?.full_name || 'User';
      toast.success(`Welcome back, ${displayName}!`);
      return profile;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Invalid email or password';
      toast.error(msg);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const refreshProfile = async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch (err) {
      console.error('Failed to refresh profile', err);
    }
  };

  const role = user?.role?.toUpperCase();
  const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'COMPANY_ADMIN', 'PLATFORM_SUPER_ADMIN'].includes(role);
  const isSuperAdmin = ['SUPER_ADMIN', 'PLATFORM_SUPER_ADMIN'].includes(role);
  const isHR = isAdmin || role === 'HR_MANAGER';
  const isFinance = isAdmin || ['FINANCE_MANAGER', 'PAYROLL_MANAGER'].includes(role);
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
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
