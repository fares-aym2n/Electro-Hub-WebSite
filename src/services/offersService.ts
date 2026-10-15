import { productService } from './productService';
import type { ApiProduct } from '../types/api';

export interface DiscountPricing {
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
  hasDiscount: boolean;
  badgeLabel: string;
}

/**
 * Calculates genuine discount pricing and badge labels from API product response.
 * Uses the API's discount percentage and catalog price.
 */
export function calculateDiscountPricing(product: ApiProduct): DiscountPricing {
  const originalPrice = parseFloat(product.price) || 0;
  const rawDiscount =
    product.discount !== undefined && product.discount !== null
      ? String(product.discount)
      : '0';
  const discountPercentage = parseFloat(rawDiscount) || 0;
  const hasDiscount = discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? Math.round(originalPrice * (1 - discountPercentage / 100) * 100) / 100
    : originalPrice;

  return {
    discountPercentage,
    originalPrice,
    discountedPrice,
    hasDiscount,
    badgeLabel: `${Math.round(discountPercentage)}% OFF`,
  };
}

export const offersService = {
  /**
   * Retrieves products qualifying as offers directly using GET /api/products?discount=true
   */
  async getOffers(page: number = 1): Promise<{
    products: ApiProduct[];
    total: number;
    totalPages: number;
  }> {
    const response = await productService.getProducts({ page, discount: true });
    const products = response.products || [];
    const total = response.total ?? response.totalResults ?? response.results ?? products.length;
    const totalPages = response.totalPages ?? Math.max(1, Math.ceil(total / 10));

    return {
      products,
      total,
      totalPages,
    };
  },
};
