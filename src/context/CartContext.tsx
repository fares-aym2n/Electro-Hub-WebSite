import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ApiProduct, ApiCart } from '../types/api';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { calculateDiscountPricing } from '../services/offersService';

export interface CartItem {
  id?: number;
  product: ApiProduct;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  cart: ApiCart | null;
  totalItems: number;
  subtotal: number;
  loading: boolean;
  error: string | null;
  addToCart: (product: ApiProduct, quantity?: number) => Promise<boolean>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, openAuthModal } = useAuth();

  const [cart, setCart] = useState<ApiCart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronous lock ref to prevent concurrent duplicate additions of the same product
  const pendingProductIdsRef = useRef<Set<number>>(new Set());

  // Clean up any legacy localStorage cart data
  useEffect(() => {
    try {
      localStorage.removeItem('electro_cart_items');
    } catch {
      // Ignore storage errors
    }
  }, []);

  const syncCartState = useCallback((backendCart: ApiCart | null) => {
    setCart(backendCart);
    if (!backendCart || !backendCart.cartItems) {
      setItems([]);
    } else {
      setItems(
        backendCart.cartItems.map((ci) => ({
          id: ci.id,
          product: ci.product,
          quantity: ci.quantity,
        }))
      );
    }
  }, []);

  // 1. Fetch user's cart from GET /api/carts
  const refreshCart = useCallback(async () => {
    if (!user) {
      syncCartState(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getCart();
      syncCartState(data);
    } catch (err: any) {
      console.error('Failed to load user cart from API:', err);
      if (err?.statusCode === 401) {
        syncCartState(null);
      } else {
        setError(err.message || 'Unable to retrieve your cart from the server.');
      }
    } finally {
      setLoading(false);
    }
  }, [user, syncCartState]);

  // Synchronize when authenticated user session changes
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // 4. Delete item from cart: DELETE /api/carts/:productId
  const removeFromCart = useCallback(
    async (productId: number): Promise<void> => {
      if (!user) {
        openAuthModal('signin');
        return;
      }

      setError(null);
      const previousItems = items;
      const previousCart = cart;

      // Optimistic update
      setItems((prev) => prev.filter((item) => item.product.id !== productId));

      try {
        const updatedCart = await cartService.deleteItem(productId);
        syncCartState(updatedCart);
      } catch (err: any) {
        console.error(`Failed to remove product ${productId} from cart:`, err);
        if (err?.statusCode !== 404) {
          setItems(previousItems);
          setCart(previousCart);
        }
        setError(err.message || 'Failed to remove item from cart.');
        if (err?.statusCode === 401) {
          openAuthModal('signin');
        }
      }
    },
    [user, items, cart, openAuthModal, syncCartState]
  );

  // 3. Update cart item: PATCH /api/carts/:productId
  const updateQuantity = useCallback(
    async (productId: number, quantity: number): Promise<void> => {
      if (!user) {
        openAuthModal('signin');
        return;
      }

      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      setError(null);
      const previousItems = items;
      const previousCart = cart;

      // Optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );

      try {
        const updatedCart = await cartService.updateItemQuantity(productId, quantity);
        syncCartState(updatedCart);
      } catch (err: any) {
        console.error(`Failed to update quantity for product ${productId}:`, err);
        // Rollback
        setItems(previousItems);
        setCart(previousCart);
        setError(err.message || 'Failed to update item quantity.');
        if (err?.statusCode === 401) {
          openAuthModal('signin');
        }
      }
    },
    [user, items, cart, openAuthModal, removeFromCart, syncCartState]
  );

  // 2. Add item to cart: POST /api/carts/:productId
  const addToCart = useCallback(
    async (product: ApiProduct, quantity: number = 1): Promise<boolean> => {
      if (!user) {
        openAuthModal('signin');
        return false;
      }

      if (pendingProductIdsRef.current.has(product.id)) {
        return false;
      }
      pendingProductIdsRef.current.add(product.id);

      setError(null);
      const previousItems = items;
      const previousCart = cart;

      // Optimistic update
      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.product.id === product.id);
        if (existingIndex > -1) {
          const next = [...prev];
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + quantity,
          };
          return next;
        }
        return [...prev, { product, quantity }];
      });

      try {
        const updatedCart = await cartService.addItem(product.id, quantity);
        syncCartState(updatedCart);
        return true;
      } catch (err: any) {
        console.error(`Failed to add product ${product.id} to cart:`, err);
        setItems(previousItems);
        setCart(previousCart);
        setError(err.message || 'Failed to add item to cart.');
        if (err?.statusCode === 401) {
          openAuthModal('signin');
        }
        return false;
      } finally {
        pendingProductIdsRef.current.delete(product.id);
      }
    },
    [user, items, cart, openAuthModal, syncCartState]
  );

  // 5. Clear cart: DELETE /api/carts (204 No Content)
  const clearCart = useCallback(async (): Promise<void> => {
    if (!user) {
      syncCartState(null);
      return;
    }

    setError(null);
    const previousItems = items;
    const previousCart = cart;

    syncCartState(null);

    try {
      await cartService.clearCart();
    } catch (err: any) {
      console.error('Failed to clear cart:', err);
      setItems(previousItems);
      setCart(previousCart);
      setError(err.message || 'Failed to clear cart.');
    }
  }, [user, items, cart, syncCartState]);

  // Derived properties
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal =
    typeof cart?.totalPrice === 'number'
      ? cart.totalPrice
      : items.reduce((sum, item) => {
          const pricing = calculateDiscountPricing(item.product);
          const unitPrice = pricing.hasDiscount ? pricing.discountedPrice : pricing.originalPrice;
          return sum + unitPrice * item.quantity;
        }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cart,
        totalItems,
        subtotal,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
