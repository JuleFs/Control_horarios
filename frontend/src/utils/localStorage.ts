// frontend/src/utils/localStorage.ts
import { AuthState } from '../types/auth.types.ts';

export const setAuth = (auth: AuthState): void => {
  try {
    const authString = JSON.stringify(auth);
    localStorage.setItem('auth', authString);
    console.log('Auth state saved to localStorage');
  } catch (error) {
    console.error('Error saving auth state to localStorage:', error);
  }
};

export const getAuth = (): AuthState | null => {
  try {
    const auth = localStorage.getItem('auth');
    if (!auth) {
      console.log('No auth found in localStorage');
      return null;
    }
    
    const parsedAuth = JSON.parse(auth) as AuthState;
    
    // Validate the parsed object has the expected structure
    if (!parsedAuth || typeof parsedAuth !== 'object' || !parsedAuth.user) {
      console.warn('Invalid auth data in localStorage, removing it');
      localStorage.removeItem('auth');
      return null;
    }
    
    console.log('Auth state retrieved from localStorage');
    return parsedAuth;
  } catch (error) {
    console.error('Error parsing auth from localStorage:', error);
    localStorage.removeItem('auth');
    return null;
  }
};