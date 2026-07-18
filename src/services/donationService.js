import api from './api';

const donationService = {
  create: async (formData) => {
    const headers = { 'Content-Type': 'multipart/form-data' };
    const response = await api.post('/api/v1/donations/', formData, { headers });
    return response.data;
  },
  list: async (params) => {
    const response = await api.get('/api/v1/donations/', { params });
    return response.data;
  },
  get: async (id) => {
    const response = await api.get(`/api/v1/donations/${id}/`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/api/v1/donations/${id}/`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/v1/donations/${id}/`);
    return response.data;
  },
  claim: async (id) => {
    const response = await api.post(`/api/v1/donations/${id}/claim/`);
    return response.data;
  },
  approve: async (id) => {
    const response = await api.post(`/api/v1/donations/${id}/approve/`);
    return response.data;
  },
  assignVolunteer: async (id, data = {}) => {
    const response = await api.post(`/api/v1/donations/${id}/assign-volunteer/`, data);
    return response.data;
  },
  pickup: async (id) => {
    const response = await api.post(`/api/v1/donations/${id}/pickup/`);
    return response.data;
  },
  deliver: async (id) => {
    const response = await api.post(`/api/v1/donations/${id}/deliver/`);
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.post(`/api/v1/donations/${id}/cancel/`);
    return response.data;
  }
};

export default donationService;
