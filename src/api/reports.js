import api from './client';

export const reportApi = {
  getEmployeeReport: async (params = {}) => {
    const response = await api.get('/reports/employees', { params });
    return response.data;
  },

  getDepartmentReport: async () => {
    const response = await api.get('/reports/departments');
    return response.data;
  },

  getAttendanceReport: async (params = {}) => {
    const response = await api.get('/reports/attendance', { params });
    return response.data;
  },

  getLeaveReport: async (params = {}) => {
    const response = await api.get('/reports/leaves', { params });
    return response.data;
  },

  getSalaryReport: async (params = {}) => {
    const response = await api.get('/reports/salaries', { params });
    return response.data;
  },

  exportCsv: (reportType, params = {}) => {
    const token = localStorage.getItem('token');
    const query = new URLSearchParams({ report_type: reportType, ...params }).toString();
    const url = `${api.defaults.baseURL}/reports/export/csv?${query}`;

    // Download via link with bearer token or fetch blob
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${reportType}_report.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  },

  exportExcel: (reportType, params = {}) => {
    const token = localStorage.getItem('token');
    const query = new URLSearchParams({ report_type: reportType, ...params }).toString();
    const url = `${api.defaults.baseURL}/reports/export/excel?${query}`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${reportType}_report.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  },
};
