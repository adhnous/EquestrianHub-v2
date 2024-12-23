import { create } from 'zustand';
import { login as apiLogin, logout as apiLogout } from '../services/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiLogin(credentials);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'An error occurred during login';
      
      set({
        isLoading: false,
        error: errorMessage,
        user: null,
        token: null,
        isAuthenticated: false,
      });
      
      throw error;
    }
  },

  logout: () => {
    try {
      apiLogout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      set({
        error: 'Error during logout',
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
