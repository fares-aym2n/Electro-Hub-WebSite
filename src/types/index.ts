export type DesignDirection = 'cyberforge' | 'nordic' | 'apex';

export type ActivePageView = 'home' | 'catalog' | 'detail' | 'builder' | 'cart' | 'checkout';

export interface ProductReview {
  id: string;
  user: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  image: string;
  gallery?: string[];
  badge?: string;
  specs: {
    label: string;
    value: string;
  }[];
  description: string;
  longDescription?: string;
  featured?: boolean;
  wattage?: number;
  socket?: string;
  formFactor?: string;
  reviews?: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  brand: string[];
  minPrice: number;
  maxPrice: number;
  onlyInStock: boolean;
  minRating: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface RigBuildState {
  cpu: Product | null;
  cooler: Product | null;
  motherboard: Product | null;
  ram: Product | null;
  gpu: Product | null;
  storage: Product | null;
  psu: Product | null;
  case: Product | null;
}

export interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  shippingMethod: 'standard' | 'express' | 'air';
  paymentMethod: 'card' | 'crypto' | 'wire';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}
