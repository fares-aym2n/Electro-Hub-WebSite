import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type PageId =
  | 'home'
  | 'product-details'
  | 'signup'
  | 'signin'
  | 'checkout'
  | 'review'
  | 'about'
  | 'contact';

interface NavigationState {
  page: PageId;
  productId?: number;
  category?: string;
}

interface NavigationContextType {
  activePage: PageId;
  selectedProductId: number;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  navigate: (
    page: PageId,
    options?: {
      productId?: number;
      category?: string;
      replace?: boolean;
      scrollTo?: string;
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

  // Default to Home
  return {
    page: 'home',
    productId: 29,
    category: categoryParam || 'ALL',
  };
}

// Helper to construct URL path from state
function buildUrl(page: PageId, productId?: number, category?: string): string {
  let path = '/';
  if (page === 'home') path = '/';
  else if (page === 'product-details') path = `/product/${productId || 29}`;
  else if (page === 'review') path = `/review/${productId || 29}`;
  else if (page === 'signin') path = '/signin';
  else if (page === 'signup') path = '/signup';
  else if (page === 'checkout') path = '/checkout';
  else if (page === 'about') path = '/about';
  else if (page === 'contact') path = '/contact';

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

  // Handle native browser Back and Forward buttons via popstate
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as NavigationState | null;
      if (state && state.page) {
        setActivePage(state.page);
        if (state.productId) setSelectedProductId(state.productId);
        if (state.category) setActiveCategoryState(state.category);
      } else {
        const parsed = parseUrlToRoute();
        setActivePage(parsed.page);
        if (parsed.productId) setSelectedProductId(parsed.productId);
        if (parsed.category) setActiveCategoryState(parsed.category);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);

    // Ensure the initial history entry has state attached
    const currentUrl = buildUrl(initialRoute.page, initialRoute.productId, initialRoute.category);
    window.history.replaceState(
      {
        page: initialRoute.page,
        productId: initialRoute.productId,
        category: initialRoute.category,
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
      }
    ) => {
      const targetProdId = options?.productId !== undefined ? options.productId : selectedProductId;
      const targetCat = options?.category !== undefined ? options.category : activeCategory;

      setActivePage(page);
      if (options?.productId !== undefined) {
        setSelectedProductId(options.productId);
      }
      if (options?.category !== undefined) {
        setActiveCategoryState(options.category);
      }

      const url = buildUrl(page, targetProdId, targetCat);
      const stateObj: NavigationState = {
        page,
        productId: targetProdId,
        category: targetCat,
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
    [selectedProductId, activeCategory, scrollToSection]
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
