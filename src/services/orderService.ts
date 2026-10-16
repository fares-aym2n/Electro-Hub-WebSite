import { apiClient } from './apiClient';

export const STRIPE_PUBLISHABLE_KEY =
  (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string) || '';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'card' | 'cash';

export interface OrderProduct {
  id: number;
  name: string;
  price: number;
  discount?: number;
  image?: string;
  description?: string;
}

export interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number | string;
  discount: number;
  product?: OrderProduct | null;
}

export interface UserOrder {
  id: number;
  fullName: string;
  phoneNumber: string;
  shippingAddress: string;
  city: string;
  country: string;
  totalPrice: number | string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  stripeSessionId?: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export interface CreateOrderDto {
  paymentMethod: 'card' | 'cash';
  fullName: string;
  shippingAddress: string;
  city: string;
  phoneNumber: string;
  country: string;
}

export interface CreateOrderResponse {
  orderId: number;
  totalPrice: number;
  paymentMethod: string;
  checkoutUrl?: string;
  status?: string;
  paymentStatus?: string;
  message?: string;
}

export const orderService = {
  /**
   * Create an order from the user's cart and dispatch Stripe checkout session or cash on delivery.
   * POST /api/order/checkout
   */
  async checkout(dto: CreateOrderDto): Promise<CreateOrderResponse> {
    return apiClient.post<CreateOrderResponse>(
      '/api/order/checkout',
      dto,
      { requiresAuth: true }
    );
  },

  /**
   * Retrieve all orders belonging to the currently authenticated user.
   * GET /api/order/my-orders
   */
  async getMyOrders(): Promise<UserOrder[]> {
    return apiClient.get<UserOrder[]>(
      '/api/order/my-orders',
      { requiresAuth: true }
    );
  },
};

