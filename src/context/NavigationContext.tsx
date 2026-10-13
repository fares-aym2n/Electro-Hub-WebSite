import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type PageId =
  | 'home'
  | 'product-details'
  | 'signup'
  | 'signin'
  | 'checkout'
  | 'review'
  | 'about'
  | 'contact'
  | 'forgot-password'
  | 'reset-password';

export interface NavigationState {
  page: PageId;
  productId?: number;
  category?: string;
  resetUserId?: number;
  resetPasswordToken?: string;
}

export interface NavigationContextType {
  activePage: PageId;
  selectedProductId: number;
  activeCategory: string;
  resetUserId?: number;
  resetPasswordToken?: string;
  setActiveCategory: (cat: string) => void;
  navigate: (
    page: PageId,
    options?: {
      productId?: number;
      category?: string;
      replace?: boolean;
      scrollTo?: string;
      resetUserId?: number;
      resetPasswordToken?: string;
    }
  ) => void;
  goBack: () => void;
  scrollToSection: (sectionId: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Helper to parse current URL into route state
function parseUrlToRoute(): NavigationState {
  const path = window.location.pathname.toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const categoryParam = searchParams.get('category') || undefined;

  if (path.startsWith('/product/')) {
    const parts = path.split('/');
    const id = parseInt(parts[2], 10);
    return {
      page: 'product-details',
      productId: !isNaN(id) ? id : 29,
      category: categoryParam,
    };
  }

  if (path.startsWith('/review')) {
    const parts = path.split('/');
    const id = parseInt(parts[2], 10);
    return {
      page: 'review',
      productId: !isNaN(id) ? id : 29,
      category: categoryParam,
    };
  }

  if (path === '/signin' || path === '/login') {
    return { page: 'signin', category: categoryParam };
  }

  if (path === '/signup' || path === '/register') {
    return { page: 'signup', category: categoryParam };
  }

  if (path === '/checkout') {
    return { page: 'checkout', category: categoryParam };
  }

  if (path === '/about' || path === '/about-us') {
    return { page: 'about', category: categoryParam };
  }

  if (path === '/contact' || path === '/contact-us') {
    return { page: 'contact', category: categoryParam };
  }

  if (path === '/forgot-password') {
    return { page: 'forgot-password', category: categoryParam };
  }

  if (path.startsWith('/reset-password')) {
    // Route pattern: /reset-password/:userId/:resetPasswordToken
    const rawPath = window.location.pathname;
    const segments = rawPath.split('/').filter(Boolean);
    let resetUserId: number | undefined;
    let resetPasswordToken: string | undefined;

    if (segments.length >= 3 && segments[0].toLowerCase() === 'reset-password') {
      const parsedId = parseInt(segments[1], 10);
      if (!isNaN(parsedId)) {
        resetUserId = parsedId;
      }
      resetPasswordToken = decodeURIComponent(segments.slice(2).join('/'));
    }

    // Also support fallback query parameters: ?userId=123&token=abc
    if (resetUserId === undefined) {
      const qId = searchParams.get('userId') || searchParams.get('id');
      if (qId) {
        const parsed = parseInt(qId, 10);
        if (!isNaN(parsed)) resetUserId = parsed;
      }
    }

    if (!resetPasswordToken) {
      resetPasswordToken =
        searchParams.get('token') ||
        searchParams.get('resetPasswordToken') ||
        undefined;
    }

    return {
      page: 'reset-password',
      category: categoryParam,
      resetUserId,
      resetPasswordToken,
    };
  }

  // Default to Home
  return {
    page: 'home',
    productId: 29,
    category: categoryParam || 'ALL',
  };
}

// Helper to construct URL path from state
function buildUrl(
  page: PageId,
  productId?: number,
  category?: string,
  resetUserId?: number,
  resetPasswordToken?: string
): string {
  let path = '/';
  if (page === 'home') path = '/';
  else if (page === 'product-details') path = `/product/${productId || 29}`;
  else if (page === 'review') path = `/review/${productId || 29}`;
  else if (page === 'signin') path = '/signin';
  else if (page === 'signup') path = '/signup';
  else if (page === 'checkout') path = '/checkout';
  else if (page === 'about') path = '/about';
  else if (page === 'contact') path = '/contact';
  else if (page === 'forgot-password') path = '/forgot-password';
  else if (page === 'reset-password') {
    if (resetUserId !== undefined && resetPasswordToken) {
      path = `/reset-password/${resetUserId}/${encodeURIComponent(resetPasswordToken)}`;
    } else {
      path = '/reset-password';
    }
  }

  if (category && category !== 'ALL' && page === 'home') {
    path += `?category=${encodeURIComponent(category)}`;
  }

  return path;
}

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialRoute = parseUrlToRoute();
  const [activePage, setActivePage] = useState<PageId>(initialRoute.page);
  const [selectedProductId, setSelectedProductId] = useState<number>(initialRoute.productId || 29);
  const [activeCategory, setActiveCategoryState] = useState<string>(initialRoute.category || 'ALL');
  const [resetUserId, setResetUserId] = useState<number | undefined>(initialRoute.resetUserId);
  const [resetPasswordToken, setResetPasswordToken] = useState<string | undefined>(initialRoute.resetPasswordToken);

  // Handle native browser Back and Forward buttons via popstate
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as NavigationState | null;
      if (state && state.page) {
        setActivePage(state.page);
        if (state.productId) setSelectedProductId(state.productId);
        if (state.category) setActiveCategoryState(state.category);
        setResetUserId(state.resetUserId);
        setResetPasswordToken(state.resetPasswordToken);
      } else {
        const parsed = parseUrlToRoute();
        setActivePage(parsed.page);
        if (parsed.productId) setSelectedProductId(parsed.productId);
        if (parsed.category) setActiveCategoryState(parsed.category);
        setResetUserId(parsed.resetUserId);
        setResetPasswordToken(parsed.resetPasswordToken);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);

    // Ensure the initial history entry has state attached
    const currentUrl = buildUrl(
      initialRoute.page,
      initialRoute.productId,
      initialRoute.category,
      initialRoute.resetUserId,
      initialRoute.resetPasswordToken
    );
    window.history.replaceState(
      {
        page: initialRoute.page,
        productId: initialRoute.productId,
        category: initialRoute.category,
        resetUserId: initialRoute.resetUserId,
        resetPasswordToken: initialRoute.resetPasswordToken,
      },
      '',
      currentUrl
    );

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    // Wait for DOM to be ready
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const navHeight = 72;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 50);
  }, []);

  const navigate = useCallback(
    (
      page: PageId,
      options?: {
        productId?: number;
        category?: string;
        replace?: boolean;
        scrollTo?: string;
        resetUserId?: number;
        resetPasswordToken?: string;
      }
    ) => {
      const targetProdId = options?.productId !== undefined ? options.productId : selectedProductId;
      const targetCat = options?.category !== undefined ? options.category : activeCategory;
      const targetUserId =
        options?.resetUserId !== undefined
          ? options.resetUserId
          : page === 'reset-password'
          ? resetUserId
          : undefined;
      const targetToken =
        options?.resetPasswordToken !== undefined
          ? options.resetPasswordToken
          : page === 'reset-password'
          ? resetPasswordToken
          : undefined;

      setActivePage(page);
      if (options?.productId !== undefined) {
        setSelectedProductId(options.productId);
      }
      if (options?.category !== undefined) {
        setActiveCategoryState(options.category);
      }
      setResetUserId(targetUserId);
      setResetPasswordToken(targetToken);

      const url = buildUrl(page, targetProdId, targetCat, targetUserId, targetToken);
      const stateObj: NavigationState = {
        page,
        productId: targetProdId,
        category: targetCat,
        resetUserId: targetUserId,
        resetPasswordToken: targetToken,
      };

      if (options?.replace) {
        window.history.replaceState(stateObj, '', url);
      } else {
        window.history.pushState(stateObj, '', url);
      }

      if (options?.scrollTo) {
        scrollToSection(options.scrollTo);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [selectedProductId, activeCategory, resetUserId, resetPasswordToken, scrollToSection]
  );

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('home');
    }
  }, [navigate]);

  const setActiveCategory = useCallback(
    (cat: string) => {
      setActiveCategoryState(cat);
      if (activePage === 'home') {
        const url = buildUrl('home', selectedProductId, cat);
        window.history.replaceState(
          { page: 'home', productId: selectedProductId, category: cat },
          '',
          url
        );
      }
    },
    [activePage, selectedProductId]
  );

  return (
    <NavigationContext.Provider
      value={{
        activePage,
        selectedProductId,
        activeCategory,
        resetUserId,
        resetPasswordToken,
        setActiveCategory,
        navigate,
        goBack,
        scrollToSection,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

/**
 * Route parameter hook to automatically extract parameters such as :userId and :resetToken
 */
export function useParams<T extends Record<string, string | undefined>>(): T {
  const context = useContext(NavigationContext);
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const segments = path.split('/').filter(Boolean);

  const params: Record<string, string | undefined> = {};

  if (segments[0]?.toLowerCase() === 'reset-password') {
    if (segments[1]) {
      params.userId = segments[1];
      params.id = segments[1];
    }
    if (segments[2]) {
      const tok = decodeURIComponent(segments.slice(2).join('/'));
      params.resetToken = tok;
      params.resetPasswordToken = tok;
      params.token = tok;
    }
  } else if (segments[0]?.toLowerCase() === 'product' && segments[1]) {
    params.id = segments[1];
    params.productId = segments[1];
  }

  // Fallback to query params
  if (!params.userId) {
    const qUserId = searchParams.get('userId') || searchParams.get('id');
    if (qUserId) {
      params.userId = qUserId;
      params.id = qUserId;
    }
  }
  if (!params.resetToken) {
    const qToken =
      searchParams.get('token') ||
      searchParams.get('resetPasswordToken') ||
      searchParams.get('resetToken');
    if (qToken) {
      params.resetToken = qToken;
      params.resetPasswordToken = qToken;
      params.token = qToken;
    }
  }

  // Fallback to context
  if (context?.resetUserId !== undefined && !params.userId) {
    params.userId = String(context.resetUserId);
    params.id = String(context.resetUserId);
  }
  if (context?.resetPasswordToken && !params.resetToken) {
    params.resetToken = context.resetPasswordToken;
    params.resetPasswordToken = context.resetPasswordToken;
    params.token = context.resetPasswordToken;
  }

  return params as T;
}

