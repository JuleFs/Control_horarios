// frontend/src/types/auth.types.ts
export enum UserRole {
  ADMIN = 'admin',
  ALUMNO = 'alumno',
  MAESTRO = 'maestro',
  CHECADOR = 'checador'
}

export interface User {
  id: number;
  nombre: string;
  correo: string;
  userType: UserRole;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null; // Keeping this for compatibility, but we won't use it
}

export interface LoginCredentials {
  correo: string;
  contraseña: string;
  userType: UserRole;
}

export interface LoginResponse {
  user: User;
  access_token: string; // Keeping this for compatibility, but we won't use it
}