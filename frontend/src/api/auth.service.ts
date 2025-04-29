import { LoginCredentials, LoginResponse } from '../types/auth.types.ts';
import axiosInstance from './axios.ts';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      // Usar el nuevo endpoint simplificado
      const response = await axiosInstance.post<any>('/auth/login-simple', credentials);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Credenciales inválidas');
      }
      
      // Formatear la respuesta según lo esperado por el frontend
      const loginResponse: LoginResponse = {
        user: response.data.user,
        access_token: "dummy-token" // Un token ficticio para mantener compatibilidad
      };
      
      return loginResponse;
    } catch (error) {
      // Relanzar el error para que AuthContext lo maneje
      throw error;
    }
  },
  
  logout: (): void => {
    // Frontend-only logout, just clearing the stored auth data
    localStorage.removeItem('auth');
  },
};