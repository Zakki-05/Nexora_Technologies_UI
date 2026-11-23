import api from './client';

export const documentApi = {
  getMyDocuments: async () => {
    const response = await api.get('/documents/my-documents');
    return response.data;
  },

  getEmployeeDocuments: async (employeeId) => {
    const response = await api.get(`/documents/employee/${employeeId}`);
    return response.data;
  },

  upload: async (formData) => {
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  download: (documentId, fileName) => {
    const token = localStorage.getItem('token');
    const url = `${api.defaults.baseURL}/documents/${documentId}/download`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Download failed');
        return res.blob();
      })
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName || 'document';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  },

  delete: async (documentId) => {
    const response = await api.delete(`/documents/${documentId}`);
    return response.data;
  },
};
