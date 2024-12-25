import { create } from 'zustand';
import { login as apiLogin, logout as apiLogout } from '../services/api';

// Clear any existing auth data on store initialization
localStorage.removeItem('token');
localStorage.removeItem('user');

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiLogin(credentials);
      
      if (!response?.data) {
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
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
