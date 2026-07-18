import api from './api';

const profileService = {
  getProfile: async () => {
    const response = await api.get('/api/v1/auth/profile/');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.patch('/api/v1/auth/profile/', profileData);
    return response.data;
  }
};

export default profileService;
