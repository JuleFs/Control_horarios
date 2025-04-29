// frontend/src/api/auth.service.ts
import { LoginCredentials, LoginResponse } from '../types/auth.types.ts';
import axiosInstance from './axios.ts';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      // Use the simple login endpoint
      const response = await axiosInstance.post<any>('/auth/login-simple', credentials);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Credenciales inválidas');
      }
      
      return {
        user: response.data.user,
        access_token: "dummy_token" // We're not using tokens anymore, but keep this for compatibility
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: (): void => {
    // Just clear localStorage
    localStorage.removeItem('auth');
  },
};