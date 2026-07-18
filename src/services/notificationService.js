import api from './api';

const notificationService = {
  list: async () => {
    const response = await api.get('/api/v1/notifications/');
    return response.data;
  },
  markRead: async (id) => {
    const response = await api.post(`/api/v1/notifications/${id}/mark-read/`);
    return response.data;
  },
  markAllRead: async () => {
    const response = await api.post('/api/v1/notifications/mark-all-read/');
    return response.data;
  }
};

export default notificationService;
