import { LoginCredentials, LoginResponse } from '../types/auth.types.ts';
import axiosInstance from './axios.ts';
export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Simplemente relanzar el error para que AuthContext lo maneje
      throw error;
    }
  },
  
  logout: (): void => {
    // Frontend-only logout, just clearing the stored token
    localStorage.removeItem('auth');
  },
};