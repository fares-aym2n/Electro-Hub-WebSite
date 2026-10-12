import { apiClient } from './apiClient';
import type { ApiProduct, ProductsResponse, ProductFilterParams } from '../types/api';

// In-memory cache for all catalog products
let cachedAllProducts: ApiProduct[] | null = null;

export const productService = {
  /**
   * Fetch paginated products with optional price and name filtering
   */
  async getProducts(params: ProductFilterParams = { page: 1 }): Promise<ProductsResponse> {
    const queryParams: Record<string, string | number> = {
      page: params.page || 1,
    };

    if (params.name && params.name.trim()) {
      queryParams.name = params.name.trim();
    }
    if (params.minPrice !== undefined && params.minPrice !== null) {
      queryParams.minPrice = params.minPrice;
    }
    if (params.maxPrice !== undefined && params.maxPrice !== null) {
      queryParams.maxPrice = params.maxPrice;
    }

    return apiClient.get<ProductsResponse>('/api/products', {
      params: queryParams,
    });
  },

  /**
   * Fetch all catalog products across all pages with in-memory caching
   */
  async getAllProducts(forceRefresh = false): Promise<ApiProduct[]> {
    if (!forceRefresh && cachedAllProducts && cachedAllProducts.length > 0) {
      return cachedAllProducts;
    }

    try {
      const pageNumbers = [1, 2, 3, 4, 5, 6, 7];
      const responses = await Promise.all(
        pageNumbers.map((page) =>
          apiClient
            .get<ProductsResponse>('/api/products', { params: { page } })
            .catch((err) => {
              console.warn(`Failed to fetch page ${page}:`, err);
              return { results: 0, products: [] };
            })
        )
      );

      const combined: ApiProduct[] = [];
      const seenIds = new Set<number>();

      for (const res of responses) {
        if (res.products && Array.isArray(res.products)) {
          for (const p of res.products) {
            if (!seenIds.has(p.id)) {
              seenIds.add(p.id);
              combined.push(p);
            }
          }
        }
      }

      if (combined.length > 0) {
        cachedAllProducts = combined;
      }
      return combined;
    } catch (err) {
      console.error('Failed to fetch all catalog products:', err);
      return cachedAllProducts || [];
    }
  },

  /**
   * Fetch single product with nested reviews and creator information
   */
  async getProductById(id: number): Promise<ApiProduct> {
    return apiClient.get<ApiProduct>(`/api/products/${id}`);
  },
};
