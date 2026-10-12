import { apiClient, tokenStorage } from './apiClient';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ApiUser,
} from '../types/api';

export const authService = {
  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const data = await apiClient.post<LoginResponse>('/api/users/auth/login', credentials);
    if (data.token) {
      tokenStorage.set(data.token);
    }
    return data;
  },

  /**
   * Register new user account
   */
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>('/api/users/auth/register', userData);
  },

  /**
   * Retrieve current authenticated user profile
   */
  async getMe(): Promise<ApiUser> {
    return apiClient.get<ApiUser>('/api/users/me', { requiresAuth: true });
  },

  /**
   * Update profile details (username, password)
   */
  async updateProfile(data: { username: string; password?: string }): Promise<ApiUser> {
    return apiClient.patch<ApiUser>('/api/users/me', data, { requiresAuth: true });
  },

  /**
   * Upload user profile image
   */
  async uploadProfileImage(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('profile_image', file);
    return apiClient.post('/api/users/me/upload_image', formData, { requiresAuth: true });
  },

  /**
   * Remove user profile image
   */
  async removeProfileImage(): Promise<any> {
    return apiClient.delete('/api/users/me/profile-image', { requiresAuth: true });
  },

  /**
   * Clear session token
   */
  logout(): void {
    tokenStorage.remove();
  },

  /**
   * Check if token is present in storage
   */
  isAuthenticated(): boolean {
    return !!tokenStorage.get();
  },

  /**
   * Get raw token string
   */
  getToken(): string | null {
    return tokenStorage.get();
  },
};
