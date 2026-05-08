import api from './api';

export const authService = {
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword: password,
    });
    // Backend returns { success, message, token, user }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    // Backend returns { success, message, token, user }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // 401 is acceptable on logout (token might be expired/invalid)
      if (error.response?.status !== 401) {
        console.error('Logout error:', error);
      }
    }
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },
};
