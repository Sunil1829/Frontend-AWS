import api from '../api/api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/api/users', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/api/users/login', credentials);
    return response.data; // Expected { token, userId?, name? }
  },
};

export default authService;
