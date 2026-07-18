import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/api/v1/auth/register/', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/api/v1/auth/login/', credentials);
    return response.data;
  },
  logout: async (refreshToken) => {
    const response = await api.post('/api/v1/auth/logout/', { refresh: refreshToken });
    return response.data;
  },
  verifyEmail: async (email, token) => {
    const response = await api.post('/api/v1/auth/verify-email/', { email, token });
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await api.post('/api/v1/auth/forgot-password/', { email });
    return response.data;
  },
  resetPassword: async (email, token, password, passwordConfirm) => {
    const response = await api.post('/api/v1/auth/reset-password/', {
      email,
      token,
      password,
      password_confirm: passwordConfirm
    });
    return response.data;
  },
  changePassword: async (passwords) => {
    const response = await api.put('/api/v1/auth/change-password/', passwords);
    return response.data;
  }
};

export default authService;
