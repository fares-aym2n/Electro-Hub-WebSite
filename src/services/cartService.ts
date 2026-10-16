import { apiClient } from './apiClient';
import type { ApiCart } from '../types/api';

/**
 * Service to manage authenticated user's cart directly via the backend API.
 * The backend endpoints are mounted at /api/carts.
 */
export const cartService = {
  /**
   * 1. Get My Cart
   * Retrieve the authenticated user's cart and its items.
   * GET /api/carts
   */
  async getCart(): Promise<ApiCart> {
    try {
      const data = await apiClient.get<ApiCart>('/api/carts', {
        requiresAuth: true,
      });
      return data || { id: 0, cartItems: [], totalPrice: 0 };
    } catch (err: any) {
      // If user has not created a cart yet, the backend returns 404
      if (err?.statusCode === 404) {
        return { id: 0, cartItems: [], totalPrice: 0 };
      }
      throw err;
    }
  },

  /**
   * 2. Add Item to Cart
   * Add a product to the user's cart with specified quantity.
   * POST /api/carts/:productId
   */
  async addItem(productId: number, quantity: number = 1): Promise<ApiCart> {
    return apiClient.post<ApiCart>(
      `/api/carts/${productId}`,
      { quantity },
      { requiresAuth: true }
    );
  },

  /**
   * 3. Update Cart Item
   * Update the quantity of an existing cart item.
   * PATCH /api/carts/:productId
   */
  async updateItemQuantity(productId: number, quantity: number): Promise<ApiCart> {
    return apiClient.patch<ApiCart>(
      `/api/carts/${productId}`,
      { quantity },
      { requiresAuth: true }
    );
  },

  /**
   * 4. Delete Item from Cart
   * Remove a specific product from the user's cart.
   * DELETE /api/carts/:productId
   */
  async deleteItem(productId: number): Promise<ApiCart> {
    return apiClient.delete<ApiCart>(
      `/api/carts/${productId}`,
      { requiresAuth: true }
    );
  },

  /**
   * 5. Clear Cart
   * Remove all items from the user's cart.
   * DELETE /api/carts (Returns 204 No Content)
   */
  async clearCart(): Promise<void> {
    await apiClient.delete<void>('/api/carts', {
      requiresAuth: true,
    });
  },
};
