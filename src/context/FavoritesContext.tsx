import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ApiProduct } from '../types/api';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

export interface FavoritesContextType {
  favorites: ApiProduct[];
  favoritesCount: number;
  loading: boolean;
  error: string | null;
  isFavorite: (productId: number) => boolean;
  toggleFavorite: (product: ApiProduct) => Promise<void>;
  addFavorite: (product: ApiProduct) => Promise<void>;
  removeFavorite: (productId: number) => Promise<void>;
  clearFavorites: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, openAuthModal } = useAuth();

  const [favorites, setFavorites] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronous lock to prevent duplicate concurrent submissions for the same product
  const pendingProductIdsRef = useRef<Set<number>>(new Set());

  // Clean up any obsolete localStorage favorites keys from older builds
  useEffect(() => {
    try {
      localStorage.removeItem('electro_favorites');
      localStorage.removeItem('electro_wishlist');
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Fetch the current authenticated user's wishlist from backend GET /api/whitelist
  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const items = await wishlistService.getWishlist();
      setFavorites(items);
    } catch (err: any) {
      console.error('Failed to load user wishlist from API:', err);
      if (err?.statusCode === 401) {
        // Token expired or unauthorized: isolate state
        setFavorites([]);
      } else {
        setError(err.message || 'Unable to retrieve your wishlist from the server.');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Synchronize when authenticated user changes (user isolation & session clean up)
  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isFavorite = useCallback(
    (productId: number): boolean => {
      return favorites.some((item) => item.id === productId);
    },
    [favorites]
  );

  const addFavorite = useCallback(
    async (product: ApiProduct) => {
      if (!user) {
        openAuthModal('signin');
        return;
      }

      if (pendingProductIdsRef.current.has(product.id)) {
        return;
      }
      pendingProductIdsRef.current.add(product.id);

      // Safe optimistic update
      const previousFavorites = favorites;
      if (!previousFavorites.some((item) => item.id === product.id)) {
        setFavorites([product, ...previousFavorites]);
      }

      try {
        await wishlistService.addToWishlist(product.id);
      } catch (err: any) {
        console.error(`Failed to add product ${product.id} to wishlist:`, err);
        // Rollback state upon failure
        setFavorites(previousFavorites);
        if (err?.statusCode === 401) {
          openAuthModal('signin');
        }
      } finally {
        pendingProductIdsRef.current.delete(product.id);
      }
    },
    [user, favorites, openAuthModal]
  );

  const removeFavorite = useCallback(
    async (productId: number) => {
      if (!user) {
        openAuthModal('signin');
        return;
      }

      if (pendingProductIdsRef.current.has(productId)) {
        return;
      }
      pendingProductIdsRef.current.add(productId);

      // Safe optimistic update
      const previousFavorites = favorites;
      setFavorites(previousFavorites.filter((item) => item.id !== productId));

      try {
        await wishlistService.removeFromWishlist(productId);
      } catch (err: any) {
        console.error(`Failed to remove product ${productId} from wishlist:`, err);
        // If 404, product is already absent on backend; only rollback for other errors
        if (err?.statusCode !== 404) {
          setFavorites(previousFavorites);
        }
        if (err?.statusCode === 401) {
          openAuthModal('signin');
        }
      } finally {
        pendingProductIdsRef.current.delete(productId);
      }
    },
    [user, favorites, openAuthModal]
  );

  const toggleFavorite = useCallback(
    async (product: ApiProduct) => {
      if (isFavorite(product.id)) {
        await removeFavorite(product.id);
      } else {
        await addFavorite(product);
      }
    },
    [isFavorite, removeFavorite, addFavorite]
  );

  const clearFavorites = useCallback(async () => {
    if (!user || favorites.length === 0) {
      return;
    }

    const previousFavorites = favorites;
    setFavorites([]);

    try {
      await Promise.allSettled(
        previousFavorites.map((p) => wishlistService.removeFromWishlist(p.id))
      );
    } catch (err) {
      console.error('Failed to clear wishlist completely:', err);
      setFavorites(previousFavorites);
    }
  }, [user, favorites]);

  const value: FavoritesContextType = {
    favorites,
    favoritesCount: favorites.length,
    loading,
    error,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    refreshWishlist,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
