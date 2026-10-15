import { apiClient } from './apiClient';
import type { ApiReview, ReviewsResponse, CreateReviewRequest, UpdateReviewRequest } from '../types/api';

export const reviewService = {
  /**
   * Fetch reviews optionally filtered by productId
   */
  async getReviews(productId?: number): Promise<ReviewsResponse> {
    return apiClient.get<ReviewsResponse>('/api/reviews', {
      params: productId !== undefined ? { productId } : undefined,
    });
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

  /**
   * Update an existing review by review ID (requires Bearer token; author or admin)
   */
  async updateReview(reviewId: number, payload: UpdateReviewRequest): Promise<ApiReview> {
    return apiClient.patch<ApiReview>(`/api/reviews/${reviewId}`, payload, {
      requiresAuth: true,
    });
  },

  /**
   * Delete an existing review by review ID (requires Bearer token; author or admin)
   */
  async deleteReview(reviewId: number): Promise<void> {
    return apiClient.delete<void>(`/api/reviews/${reviewId}`, {
      requiresAuth: true,
    });
  },
};
