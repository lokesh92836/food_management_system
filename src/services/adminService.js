import api from './api';

const adminService = {
  verifyProfile: async (profileType, profileId, isVerified = true) => {
    const response = await api.post('/api/v1/dashboard/verify/', {
      profile_type: profileType,
      profile_id: profileId,
      is_verified: isVerified
    });
    return response.data;
  },
  listUsers: async () => {
    const response = await api.get('/api/v1/dashboard/users/');
    return response.data;
  },
  listDonations: async () => {
    const response = await api.get('/api/v1/dashboard/donations/');
    return response.data;
  }
};

export default adminService;
