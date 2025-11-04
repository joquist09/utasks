import axios from 'axios';
import { api } from './config';
import { API_ROUTES } from '../../config';
import { User } from '../../types';

type APIError = {
  success: boolean;
  error?: string;
  errors?: Array<{ message: string; field: string }>;
};

type RegisterResponse = {
  success: boolean;
  data: User;
  message: string;
};

type UserResponse = {
  success: boolean;
  data: User;
};

export const authService = {
  login: async (username: string): Promise<{ user: User }> => {
    try {
      const sanitizedUsername = username.trim();
      if (!sanitizedUsername) {
        throw new Error('Username is required');
      }

      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('Please register first. No login endpoint available.');
      }
      
      const response = await api.get<UserResponse>(`/users/${userId}`);
      
      if (!response.data.success || !response.data.data) {
        throw new Error('Failed to retrieve user');
      }
      localStorage.setItem('username', sanitizedUsername);
      
      return { user: response.data.data };
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIError;
        
        if (error.response?.status === 404) {
          throw new Error('User not found. Please register first.');
        }
        throw new Error(apiError?.error || 'Login failed');
      }
      throw error;
    }
  },

  register: async (username: string): Promise<{ user: User }> => {
    try {
      const response = await api.post<RegisterResponse>(API_ROUTES.AUTH.REGISTER, {
        username: username,
      });
      
      if (!response.data.success || !response.data.data) {
        throw new Error('Invalid response from server');
      }
      
      const user = response.data.data;
      
      localStorage.setItem('userId', user.id);
      localStorage.setItem('username', user.username);
      
      return { user };
    } catch (error) {
      console.error('Register error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        const apiError = error.response?.data as APIError;
        
        if (error.response?.status === 409) {
          throw new Error('Username already exists. Please choose a different username.');
        }
        if (error.response?.status === 400) {
          throw new Error(apiError?.error || 'Invalid username');
        }
        throw new Error(apiError?.error || 'Registration failed');
      }
      throw new Error('An unexpected error occurred during registration');
    }
  },

  logout: () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.href = '/login';
  },

  isAuthenticated: (): boolean => {
    const userId = localStorage.getItem('userId');
    return !!userId;
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('No user ID found');
      }
      
      const response = await api.get<UserResponse>(`/users/${userId}`);
      
      if (!response.data.success || !response.data.data) {
        throw new Error('Failed to retrieve user');
      }
      
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as APIError;
        if (error.response?.status === 404) {
          authService.logout();
          throw new Error('User not found');
        }
        throw new Error(apiError?.error || 'Failed to get user information');
      }
      throw new Error('An unexpected error occurred');
    }
  }
};