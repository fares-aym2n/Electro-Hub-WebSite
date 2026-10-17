import { apiClient } from "./apiClient";

export const STRIPE_PUBLISHABLE_KEY =
  (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string) || "";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type PaymentMethod = "card" | "cash";

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
  paymentMethod: "card" | "cash";
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

export interface GetMyOrdersResponse {
  result: number;
  orders: UserOrder[];
}

export const orderService = {
  /**
   * Create an order from the user's cart and dispatch
   * Stripe checkout session or cash on delivery.
   * POST /api/orders/checkout
   */
  async checkout(dto: CreateOrderDto): Promise<CreateOrderResponse> {
    return apiClient.post<CreateOrderResponse>("/api/orders/checkout", dto, {
      requiresAuth: true,
    });
  },

  /**
   * Retrieve all orders belonging to the authenticated user.
   * GET /api/orders/my-orders
   */
  async getMyOrders(): Promise<UserOrder[]> {
    const res = await apiClient.get<GetMyOrdersResponse | UserOrder[]>(
      "/api/orders/my-orders",
      {
        requiresAuth: true,
      },
    );

    if (Array.isArray(res)) {
      return res;
    }

    if (res && Array.isArray(res.orders)) {
      return res.orders;
    }

    // Support clients that wrap the response in `data`.
    const wrapped = res as unknown as {
      data?: GetMyOrdersResponse | UserOrder[];
    };

    if (Array.isArray(wrapped.data)) {
      return wrapped.data;
    }

    if (
      wrapped.data &&
      !Array.isArray(wrapped.data) &&
      Array.isArray(wrapped.data.orders)
    ) {
      return wrapped.data.orders;
    }

    throw new Error("Unexpected Get My Orders API response format");
  },

  /**
   * Retrieve single order details by order ID.
   * GET /api/orders/:orderId
   */
  async getOrderById(orderId: number | string): Promise<UserOrder> {
    const numericId =
      typeof orderId === "string" ? parseInt(orderId, 10) : orderId;
    if (!numericId || isNaN(numericId) || numericId <= 0) {
      throw new Error(`Invalid order ID: ${orderId}`);
    }

    const res = await apiClient.get<
      UserOrder | { order: UserOrder } | { data: UserOrder }
    >(`/api/orders/${numericId}`, {
      requiresAuth: true,
    });

    if (res && typeof res === "object") {
      if ("order" in res && (res as any).order) {
        return (res as any).order;
      }
      if ("data" in res && (res as any).data) {
        return (res as any).data;
      }
      return res as UserOrder;
    }

    throw new Error("Unexpected Order Details API response format");
  },

  /**
   * Alias for getOrderById for flexible usage.
   */
  async getOrderDetails(orderId: number | string): Promise<UserOrder> {
    return this.getOrderById(orderId);
  },
};
