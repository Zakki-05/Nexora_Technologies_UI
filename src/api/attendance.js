import api from './client';

export const attendanceApi = {
  checkIn: async () => {
    const response = await api.post('/attendance/check-in');
    return response.data;
  },

  checkOut: async () => {
    const response = await api.post('/attendance/check-out');
    return response.data;
  },

  getToday: async () => {
    const response = await api.get('/attendance/today');
    return response.data;
  },

  getTodayAttendance: async () => {
    const response = await api.get('/attendance/today');
    return response.data;
  },

  getLiveStatus: async () => {
    const response = await api.get('/attendance/live-status');
    return response.data;
  },

  getTimeline: async (targetDate = null) => {
    const params = targetDate ? { target_date: targetDate } : {};
    const response = await api.get('/attendance/timeline', { params });
    return response.data;
  },

  getWeeklyHours: async () => {
    const response = await api.get('/attendance/weekly-hours');
    return response.data;
  },

  getMyAttendance: async (params = {}) => {
    const response = await api.get('/attendance/my-attendance', { params });
    return response.data;
  },

  getMyAttendanceHistory: async (params = {}) => {
    const response = await api.get('/attendance/my-attendance', { params });
    return response.data;
  },

  getMySummary: async (year, month) => {
    const response = await api.get('/attendance/my-summary', {
      params: { year, month },
    });
    return response.data;
  },

  getMyMonthlySummary: async (month, year) => {
    const response = await api.get('/attendance/my-summary', {
      params: { year, month },
    });
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get('/attendance/', { params });
    return response.data;
  },

  getEmployeeAttendance: async (employeeId, params = {}) => {
    const response = await api.get(`/attendance/employee/${employeeId}`, { params });
    return response.data;
  },

  getDailyReport: async (reportDate) => {
    const response = await api.get('/attendance/reports/daily', {
      params: reportDate ? { report_date: reportDate } : {},
    });
    return response.data;
  },

  recordManual: async (data) => {
    const response = await api.post('/attendance/manual', data);
    return response.data;
  },

  correct: async (id, data) => {
    const response = await api.put(`/attendance/${id}`, data);
    return response.data;
  },

  requestCorrection: async (data) => {
    const response = await api.post('/attendance/regularize', data);
    return response.data;
  },

  // Break Management
  startBreak: async (breakType = 'TEA_BREAK', remarks = null) => {
    const response = await api.post('/breaks/start', {
      break_type: breakType,
      remarks,
    });
    return response.data;
  },

  endBreak: async () => {
    const response = await api.post('/breaks/end');
    return response.data;
  },

  getBreakStatus: async () => {
    const response = await api.get('/breaks/status');
    return response.data;
  },

  getTodayBreaks: async () => {
    const response = await api.get('/breaks/today');
    return response.data;
  },
};
