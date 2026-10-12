import { apiClient } from './apiClient';
import type { ApiCategory, CategoriesResponse, ProductsResponse } from '../types/api';

// Memory cache for category image associations to avoid repeated network requests
let categoryImagesCache: Record<number, string> | null = null;

// Category matching keywords for catalog classification
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  smartphones: ['phone', 'iphone', 'galaxy s', 'galaxy a', 'pixel', 'xiaomi 14', 'oneplus'],
  laptops: ['laptop', 'macbook', 'xps', 'zephyrus', 'legion', 'spectre', 'thinkpad'],
  tablets: ['tablet', 'ipad', 'tab', 'pad'],
  monitors: ['monitor', 'ultrawide', 'ultragear', 'curved', '4k'],
  headphones: ['headphone', 'headset', 'earbud', 'airpod', 'wh-1000', 'wf-1000', 'quietcomfort', 'momentum'],
  keyboards: ['keyboard', 'keychron', 'mx keys', 'apex pro', 'blackwidow', 'k70', 'azoth'],
  'computer-mice': ['mouse', 'mice', 'mx master', 'aerox', 'magic mouse', 'g502', 'deathadder', 'harpe', 'superlight'],
  'gaming-consoles': ['console', 'playstation', 'xbox', 'switch', 'steam deck', 'rog ally', 'portal'],
  smartwatches: ['watch', 'fenix'],
  accessories: ['charger', 'power bank', 'cable', 'dock', 'hub', 'magsafe', 'ssd'],
};

export const categoryService = {
  /**
   * Fetch all categories and normalize response key typo
   */
  async getCategories(): Promise<ApiCategory[]> {
    const data = await apiClient.get<CategoriesResponse>('/api/categories');
    return data.cateogries || data.categories || [];
  },

  /**
   * Fetch single category by ID
   */
  async getCategoryById(id: number): Promise<ApiCategory> {
    return apiClient.get<ApiCategory>(`/api/categories/${id}`);
  },

  /**
   * Dynamically retrieve first product image for each category and cache it
   */
  async getCategoryCardImages(categories: ApiCategory[]): Promise<Record<number, string>> {
    if (categoryImagesCache && Object.keys(categoryImagesCache).length >= categories.length) {
      return categoryImagesCache;
    }

    const imageMap: Record<number, string> = { ...(categoryImagesCache || {}) };
    const missingCats = categories.filter((c) => !imageMap[c.id]);

    if (missingCats.length === 0) {
      categoryImagesCache = imageMap;
      return imageMap;
    }

    try {
      // Fetch up to 7 pages from the API to find the first matching product for each category
      for (let page = 1; page <= 7; page++) {
        if (categories.every((c) => imageMap[c.id])) break;

        const pData = await apiClient.get<ProductsResponse>('/api/products', {
          params: { page },
        });

        if (!pData.products || pData.products.length === 0) break;

        for (const cat of categories) {
          if (imageMap[cat.id]) continue;

          const slug = (cat.slug || cat.name).toLowerCase();
          const keywords = CATEGORY_KEYWORDS[slug] || [slug];

          const foundProd = pData.products.find((p) => {
            const text = `${p.name} ${p.description}`.toLowerCase();
            return keywords.some((k) => text.includes(k));
          });

          if (foundProd?.image) {
            imageMap[cat.id] = foundProd.image;
          }
        }
      }
    } catch (err) {
      console.warn('Could not populate category images dynamically from API:', err);
    }

    categoryImagesCache = imageMap;
    return imageMap;
  },

  /**
   * Check if a product belongs to a given category
   */
  isProductInCategory(productName: string, productDesc: string, categorySlugOrName: string): boolean {
    const slug = categorySlugOrName.toLowerCase();
    const keywords = CATEGORY_KEYWORDS[slug] || [slug];
    const text = `${productName} ${productDesc}`.toLowerCase();
    return keywords.some((k) => text.includes(k));
  },
};
