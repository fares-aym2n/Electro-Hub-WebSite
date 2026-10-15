import { apiClient } from './apiClient';
import type { ApiCategory, CategoriesResponse, ProductsResponse } from '../types/api';

// Pre-seeded memory cache for category image associations to avoid repeated network requests
const INITIAL_CATEGORY_IMAGES: Record<number, string> = {
  1: 'https://media.flixcar.com/webp/synd-asset/Samsung-143118383-au-galaxy-s24-s928-sm-s928bzkfats-539291896--Download-Source--zoom.png',
  2: 'https://dlcdnwebimgs.asus.com/gain/4E56238F-FDD4-4E6A-B8F2-653B104E8A32/w717/h525',
  3: 'https://p4-ofp.static.pub/fes/cms/2023/03/28/7dch8vg9lz0tzeg74u3x9paoln4o8z319478.png',
  4: 'https://assets.nvidia.partners/images/png/n82e16824026351.png',
  5: 'https://resource.logitechg.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-2-lightspeed/gallery/gallery-1-pro-x-2-lightspeed-gaming-headset-black.png',
  6: 'https://eshop.vodafone.com.eg/ecommerce/api/asset/content/9559942636.png?contextRequest=%7B%22forceCatalogForFetch%22:false,%22forceFilterByCatalogIncludeInheritance%22:false,%22forceFilterByCatalogExcludeInheritance%22:false,%22applicationId%22:%2201H5FECVAV4YWT0NGQKXEN1T51%22,%22tenantId%22:%225DF1363059675161A85F576D%22%7D',
  7: 'https://api.delta-computer.net/storage/products/$2y$12$qW8JcwUO.XnvUBvwxEo7uwRcxDxpUXaKZluP.z5kjaqu9GKNjm2.webp',
  8: 'https://dlcdnwebimgs.asus.com/gain/E70351F2-3579-45FB-95AC-4D41DA42EF2C',
  9: 'https://egyptlaptop.com/images/detailed/54/Apple_Watch_Series_9_Midnight_q0nz-pi.webp',
  10: 'https://www.ugreen.com/cdn/shop/files/817dc5065eecb8588c253fa074e08184.webp?v=1766052131',
};

let categoryImagesCache: Record<number, string> = { ...INITIAL_CATEGORY_IMAGES };

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
      await Promise.all(
        missingCats.map(async (cat) => {
          try {
            const slug = (cat.slug || cat.name).toLowerCase();
            const pData = await apiClient.get<ProductsResponse>('/api/products', {
              params: { page: 1, category: slug },
            });

            if (pData.products && pData.products.length > 0 && pData.products[0].image) {
              imageMap[cat.id] = pData.products[0].image;
            }
          } catch (catErr) {
            console.warn(`Could not load preview image for category ${cat.name}:`, catErr);
          }
        })
      );
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
