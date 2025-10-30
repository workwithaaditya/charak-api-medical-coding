import { ApiClient } from '../lib/api';

export interface LoginCredentials {
  username: string
  password: string
}

export interface User {
  id: string;
  username: string;
  role: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export class AuthService {
  // Validate login credentials using API
  static async validateLogin(credentials: LoginCredentials): Promise<User | null> {
    try {
      const response = await ApiClient.post<LoginResponse>('/api/auth/login', credentials);
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      return response.user;
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  }

  // Get stored auth token
  static getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Clear auth token (logout)
  static logout(): void {
    localStorage.removeItem('authToken');
  }
}