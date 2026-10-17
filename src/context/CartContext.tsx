import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ApiProduct, ApiCart } from '../types/api';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { calculateDiscountPricing } from '../services/offersService';
import { flyProductToCart } from '../utils/flyToCart';

export interface CartItem {
  id?: number;
  product: ApiProduct;
  quantity: number;
}

export interface AddToCartOptions {
  sourceElement?: HTMLElement | null;
  startRect?: { left: number; top: number; width: number; height: number } | null;
  imageSrc?: string;
}

export interface CartContextType {
  items: CartItem[];
  cart: ApiCart | null;
  totalItems: number;
  subtotal: number;
  loading: boolean;
  error: string | null;
  cartBump: boolean;
  lastAddedNotice: { product: ApiProduct; quantity: number } | null;
  dismissAddedNotice: () => void;
  cartErrorNotice: string | null;
  dismissErrorNotice: () => void;
  isAddingProduct: (productId: number) => boolean;
  addToCart: (
    product: ApiProduct,
    quantity?: number,
    options?: AddToCartOptions
  ) => Promise<boolean>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading: authLoading, openAuthModal } = useAuth();

  const [cart, setCart] = useState<ApiCart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cart animation & feedback states
  const [cartBump, setCartBump] = useState<boolean>(false);
  const [lastAddedNotice, setLastAddedNotice] = useState<{
    product: ApiProduct;
    quantity: number;
  } | null>(null);
  const [cartErrorNotice, setCartErrorNotice] = useState<string | null>(null);
  const [addingProductIds, setAddingProductIds] = useState<Set<number>>(new Set());

  // Serialized promise queues per product to handle rapid repeated clicks smoothly
  const productQueuesRef = useRef<Map<number, Promise<boolean>>>(new Map());
  const bumpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorNoticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (bumpTimerRef.current) clearTimeout(bumpTimerRef.current);
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
      if (errorNoticeTimerRef.current) clearTimeout(errorNoticeTimerRef.current);
    };
  }, []);

  const dismissAddedNotice = useCallback(() => {
    setLastAddedNotice(null);
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
      noticeTimerRef.current = null;
    }
  }, []);

  const dismissErrorNotice = useCallback(() => {
    setCartErrorNotice(null);
    if (errorNoticeTimerRef.current) {
      clearTimeout(errorNoticeTimerRef.current);
      errorNoticeTimerRef.current = null;
    }
  }, []);

  const triggerCartErrorFeedback = useCallback((message: string) => {
    setCartErrorNotice(message);
    if (errorNoticeTimerRef.current) clearTimeout(errorNoticeTimerRef.current);
    errorNoticeTimerRef.current = setTimeout(() => {
      setCartErrorNotice(null);
    }, 4500);
  }, []);

  const isAddingProduct = useCallback(
    (productId: number): boolean => addingProductIds.has(productId),
    [addingProductIds]
  );

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
    if (authLoading) return;

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
  }, [user, authLoading, syncCartState]);

  // Synchronize when authenticated user session changes
  useEffect(() => {
    if (!authLoading) {
      refreshCart();
    }
  }, [authLoading, refreshCart]);

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

  // 2. Add item to cart: POST /api/carts/:productId (allows multiple clicks & increments quantity)
  const addToCart = useCallback(
    (
      product: ApiProduct,
      quantity: number = 1,
      options?: AddToCartOptions
    ): Promise<boolean> => {
      if (!user) {
        openAuthModal('signin');
        return Promise.resolve(false);
      }

      setError(null);

      // Track in-flight state for this product
      setAddingProductIds((prev) => new Set(prev).add(product.id));

      // Optimistic increment
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

      // Chain onto queue for this product to prevent conflicting in-flight requests
      const currentQueue = productQueuesRef.current.get(product.id) || Promise.resolve(true);

      const nextPromise = currentQueue
        .catch(() => true)
        .then(async () => {
          try {
            const updatedCart = await cartService.addItem(product.id, quantity);
            syncCartState(updatedCart);

            // Trigger flying-product animation directly into header shopping cart
            flyProductToCart({
              imageSrc: options?.imageSrc || product.image,
              sourceElement: options?.sourceElement,
              startRect: options?.startRect,
              onArrive: () => {
                // Header cart bump animation and badge pop when product enters cart
                setCartBump(true);
                if (bumpTimerRef.current) clearTimeout(bumpTimerRef.current);
                bumpTimerRef.current = setTimeout(() => {
                  setCartBump(false);
                }, 750);
              },
            });

            return true;
          } catch (err: any) {
            console.error(`Failed to add product ${product.id} to cart:`, err);
            // Revert state on error
            await refreshCart();
            const message = err.message || 'Failed to add item to cart.';
            setError(message);
            triggerCartErrorFeedback(message);
            if (err?.statusCode === 401) {
              openAuthModal('signin');
            }
            return false;
          } finally {
            setAddingProductIds((prev) => {
              const next = new Set(prev);
              next.delete(product.id);
              return next;
            });
          }
        });

      productQueuesRef.current.set(product.id, nextPromise);
      return nextPromise;
    },
    [user, openAuthModal, syncCartState, triggerCartErrorFeedback, refreshCart]
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
      if (err?.statusCode === 401) {
        openAuthModal('signin');
      }
      throw err;
    }
  }, [user, items, cart, openAuthModal, syncCartState]);

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
        cartBump,
        lastAddedNotice,
        dismissAddedNotice,
        cartErrorNotice,
        dismissErrorNotice,
        isAddingProduct,
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
