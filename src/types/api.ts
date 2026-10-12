/**
 * Real API Data Models matching https://electro-hub-1.vercel.app/api-docs
 */

export interface ApiUser {
  id: number;
  username: string;
  email: string;
  role: string;
  isEmailValidation: boolean;
  profile_image: string | null;
  verificationToken?: string | null;
  resetPasswordToken?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiReview {
  id: number;
  review: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user?: ApiUser;
  product?: Partial<ApiProduct>;
}

export interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: string; // The backend returns decimal strings e.g. "52000.00"
  image: string;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  averageRating: string; // Returns decimal string e.g. "4.2"
  ratingsCount: number;
  createdAt: string;
  updatedAt: string;
  reviews?: ApiReview[];
  user?: ApiUser;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  results: number;
  products: ApiProduct[];
}

export interface CategoriesResponse {
  results: number;
  // Backend property typo is "cateogries", support both defensively
  cateogries?: ApiCategory[];
  categories?: ApiCategory[];
}

export interface ReviewsResponse {
  result: number;
  reviews: ApiReview[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

export interface CreateReviewRequest {
  review: string;
  rating: number;
}

export interface ProductFilterParams {
  page?: number;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode: number;
}
