import { apiClient } from './apiClient';
import type { ApiReview, ReviewsResponse, CreateReviewRequest } from '../types/api';

export const reviewService = {
  /**
   * Fetch all global reviews
   */
  async getReviews(): Promise<ReviewsResponse> {
    return apiClient.get<ReviewsResponse>('/api/reviews');
  },

  /**
   * Fetch single review with user details by ID
   */
  async getReviewById(id: number): Promise<ApiReview> {
    return apiClient.get<ApiReview>(`/api/reviews/${id}`);
  },

  /**
   * Post review for a specific product by product ID (requires Bearer token)
   */
  async createProductReview(productId: number, payload: CreateReviewRequest): Promise<ApiReview> {
    return apiClient.post<ApiReview>(`/api/reviews/${productId}`, payload, {
      requiresAuth: true,
    });
  },
};
