import { apiClient, tokenStorage } from './apiClient';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ValidateResetLinkResponse,
  ApiUser,
} from '../types/api';

export const authService = {
  /**
   * Authenticate user with email and password
   * Backend sets HttpOnly cookie 'token' and returns token payload
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
   * Send password reset link to user's email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse>('/api/users/auth/forgot-password', data);
  },

  /**
   * Validate password reset link
   * GET /api/users/auth/reset-password/:userId/:resetPasswordToken
   */
  async validateResetPasswordLink(
    userId: number,
    resetPasswordToken: string
  ): Promise<ValidateResetLinkResponse> {
    return apiClient.get<ValidateResetLinkResponse>(
      `/api/users/auth/reset-password/${userId}/${encodeURIComponent(resetPasswordToken)}`
    );
  },

  /**
   * Reset user password using userId and resetPasswordToken
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return apiClient.post<ResetPasswordResponse>('/api/users/auth/reset-password', data);
  },

  /**
   * Retrieve current authenticated user profile using cookie / session
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
   * Clear session token and notify backend logout
   */
  async logout(): Promise<void> {
    tokenStorage.remove();
    try {
      await apiClient.post('/api/users/auth/logout');
    } catch {
      // Gracefully ignore if backend logout endpoint is unavailable
    }
  },

  /**
   * Check if token is present in memory
   */
  isAuthenticated(): boolean {
    return !!tokenStorage.get();
  },

  /**
   * Get raw in-memory token string (if available)
   */
  getToken(): string | null {
    return tokenStorage.get();
  },
};
