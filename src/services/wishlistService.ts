import { apiClient } from './apiClient';
import type { ApiProduct, WishlistResponse, WishlistActionResponse } from '../types/api';

/**
 * Service to manage authenticated user's wishlist directly via the backend API.
 * The backend controller is deployed at /api/whitelist and /api/wishlist.
 */
export const wishlistService = {
  /**
   * Retrieve the authenticated user's wishlist products.
   * GET /api/whitelist (fallback /api/wishlist)
   */
  async getWishlist(): Promise<ApiProduct[]> {
    try {
      const data = await apiClient.get<WishlistResponse | ApiProduct[] | { products?: ApiProduct[]; data?: ApiProduct[] }>(
        '/api/whitelist',
        { requiresAuth: true }
      );
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.products)) return data.products;
      if (Array.isArray((data as any)?.data)) return (data as any).data;
      return [];
    } catch (err: any) {
      if (err?.statusCode === 404) {
        const data = await apiClient.get<WishlistResponse | ApiProduct[]>('/api/wishlist', { requiresAuth: true });
        if (Array.isArray(data)) return data;
        return data?.products || [];
      }
      throw err;
    }
  },

  /**
   * Add a product to the authenticated user's wishlist.
   * POST /api/whitelist/:productId (fallback /api/wishlist/:productId)
   */
  async addToWishlist(productId: number): Promise<WishlistActionResponse> {
    try {
      return await apiClient.post<WishlistActionResponse>(
        `/api/whitelist/${productId}`,
        {},
        { requiresAuth: true }
      );
    } catch (err: any) {
      if (err?.statusCode === 404) {
        return await apiClient.post<WishlistActionResponse>(
          `/api/wishlist/${productId}`,
          {},
          { requiresAuth: true }
        );
      }
      throw err;
    }
  },

  /**
   * Remove a product from the authenticated user's wishlist.
   * DELETE /api/whitelist/:productId (fallback /api/wishlist/:productId)
   */
  async removeFromWishlist(productId: number): Promise<WishlistActionResponse> {
    try {
      return await apiClient.delete<WishlistActionResponse>(
        `/api/whitelist/${productId}`,
        { requiresAuth: true }
      );
    } catch (err: any) {
      if (err?.statusCode === 404) {
        return await apiClient.delete<WishlistActionResponse>(
          `/api/wishlist/${productId}`,
          { requiresAuth: true }
        );
      }
      throw err;
    }
  },
};
