import api from './client';

export const salaryApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/salaries/', { params });
    return response.data;
  },

  getMySalary: async (params = {}) => {
    const response = await api.get('/salaries/my-salary', { params });
    return response.data;
  },

  getSummary: async (year = null, month = null) => {
    const response = await api.get('/salaries/summary', {
      params: { year, month },
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/salaries/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/salaries/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/salaries/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/salaries/${id}`);
    return response.data;
  },

  // Salary Structures
  getStructures: async (params = {}) => {
    const response = await api.get('/salaries/structures', { params });
    return response.data;
  },

  getStructure: async (employeeId) => {
    const response = await api.get(`/salaries/structures/${employeeId}`);
    return response.data;
  },

  updateStructure: async (employeeId, data) => {
    const response = await api.patch(`/salaries/structures/${employeeId}`, data);
    return response.data;
  },

  previewStructure: async (data) => {
    const response = await api.post('/salaries/structures/preview', data);
    return response.data;
  },

  // Monthly Payroll Run
  runPayroll: async (data) => {
    const response = await api.post('/salaries/run', data);
    return response.data;
  },

  // PDF Payslip Download
  downloadPayslip: async (salaryId) => {
    const response = await api.get(`/salaries/${salaryId}/payslip`, {
      responseType: 'blob',
    });
    return response.data;
  },

  downloadMyPayslip: async (salaryId) => {
    const response = await api.get(`/salaries/my-salary/${salaryId}/payslip`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
