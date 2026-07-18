import api from './api';

const analyticsService = {
  getOverview: async () => {
    const response = await api.get('/api/v1/analytics/overview/');
    return response.data;
  },
  getRestaurantMetrics: async () => {
    const response = await api.get('/api/v1/analytics/restaurant/');
    return response.data;
  },
  getNGOMetrics: async () => {
    const response = await api.get('/api/v1/analytics/ngo/');
    return response.data;
  },
  getMonthlyStats: async () => {
    const response = await api.get('/api/v1/analytics/monthly/');
    return response.data;
  }
};

export default analyticsService;
