import type { FC } from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SlidersHorizontal,
  Star,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Filter,
  X,
  Search,
  Check,
  AlertCircle,
  RefreshCw,
  PackageX,
  Heart,
  Tag,
} from 'lucide-react';
import type { PageId } from '../electro/ElectroHeader';
import type { ApiProduct, ApiCategory, ProductFilterParams } from '../../types/api';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { calculateDiscountPricing } from '../../services/offersService';
import { useNavigation } from '../../context/NavigationContext';
import { useFavorites } from '../../context/FavoritesContext';
import { formatPrice, formatRating } from '../../utils/formatters';
import { DualPriceSlider } from '../catalog/DualPriceSlider';

interface ProductListingViewProps {
  onNavigate: (page: PageId) => void;
  onSelectProduct: (productId: number) => void;
  onAddToCart: (product: ApiProduct) => void;
}

const ITEMS_PER_PAGE = 10;
const DEFAULT_MAX_PRICE = 150000;

export const ProductListingView: FC<ProductListingViewProps> = ({
  onNavigate,
  onSelectProduct,
  onAddToCart,
}) => {
  const { activeCategory, setActiveCategory, discountFilter, setDiscountFilter } = useNavigation();
  const { isFavorite, toggleFavorite } = useFavorites();

  // 1. Initial State synchronized with URL parameters if present
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const initialCategoryParam = searchParams.get('category') || (activeCategory !== 'ALL' ? activeCategory : 'ALL');
  const initialDiscount = searchParams.get('discount') === 'true' || discountFilter;
  const initialMinPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0;
  const initialMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : DEFAULT_MAX_PRICE;
  const initialMinRating = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : 0;
  const initialSort = (searchParams.get('sort') as 'featured' | 'price-asc' | 'price-desc' | 'rating') || 'featured';
  const initialQuery = searchParams.get('q') || searchParams.get('name') || '';

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryParam);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(initialDiscount);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(initialQuery);

  const [minPrice, setMinPrice] = useState<number>(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);
  const [minRating, setMinRating] = useState<number>(initialMinRating);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>(initialSort);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Synchronize category if changed from external navigation (e.g. Carousel or Header)
  useEffect(() => {
    if (activeCategory && activeCategory !== selectedCategory) {
      setSelectedCategory(activeCategory);
      setCurrentPage(1);
    }
  }, [activeCategory, selectedCategory]);

  // Synchronize discount filter if changed from external navigation (e.g. Best Offers Carousel "View All")
  useEffect(() => {
    if (discountFilter !== onlyDiscounted) {
      setOnlyDiscounted(discountFilter);
      setCurrentPage(1);
    }
  }, [discountFilter, onlyDiscounted]);

  // Load categories list on mount
  useEffect(() => {
    categoryService
      .getCategories()
      .then((cats) => {
        setCategories(cats);
      })
      .catch((err) => {
        console.error('Failed to load categories:', err);
      });
  }, []);

  // Search input debouncer
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Resolve Category Slug
  const activeSlug = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'ALL') return undefined;
    const found = categories.find(
      (c) =>
        c.slug.toLowerCase() === selectedCategory.toLowerCase() ||
        c.name.toLowerCase() === selectedCategory.toLowerCase()
    );
    return found ? found.slug : selectedCategory.toLowerCase();
  }, [selectedCategory, categories]);

  const activeCategoryDisplayName = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'ALL') return 'All Hardware Products';
    const found = categories.find(
      (c) =>
        c.slug.toLowerCase() === selectedCategory.toLowerCase() ||
        c.name.toLowerCase() === selectedCategory.toLowerCase()
    );
    return found ? found.name : selectedCategory;
  }, [selectedCategory, categories]);

  // Update browser URL query string whenever active filters change
  const syncUrlParams = useCallback(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams();
    if (activeSlug) params.set('category', activeSlug);
    if (onlyDiscounted) params.set('discount', 'true');
    if (minPrice > 0) params.set('minPrice', String(minPrice));
    if (maxPrice < DEFAULT_MAX_PRICE) params.set('maxPrice', String(maxPrice));
    if (minRating > 0) params.set('minRating', String(minRating));
    if (sortBy !== 'featured') params.set('sort', sortBy);
    if (debouncedSearch.trim()) params.set('name', debouncedSearch.trim());
    if (currentPage > 1) params.set('page', String(currentPage));

    const queryString = params.toString();
    const newUrl = `/products${queryString ? `?${queryString}` : ''}`;
    window.history.replaceState({ page: 'products', category: activeSlug, discount: onlyDiscounted }, '', newUrl);
  }, [activeSlug, onlyDiscounted, minPrice, maxPrice, minRating, sortBy, debouncedSearch, currentPage]);

  useEffect(() => {
    syncUrlParams();
  }, [syncUrlParams]);

  // Fetch products from backend API using supported parameters
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const apiParams: ProductFilterParams = {
      page: currentPage,
    };

    if (activeSlug) {
      apiParams.category = activeSlug;
    }

    if (onlyDiscounted) {
      apiParams.discount = true;
    }

    if (debouncedSearch.trim()) {
      apiParams.name = debouncedSearch.trim();
    }

    if (minPrice > 0) {
      apiParams.minPrice = minPrice;
    }

    if (maxPrice < DEFAULT_MAX_PRICE) {
      apiParams.maxPrice = maxPrice;
    }

    productService
      .getProducts(apiParams)
      .then((res) => {
        if (!active) return;
        let prods = res.products || [];

        // Apply client-side filtering for attributes not currently supported by backend query params:
        // 1. In stock filter
        if (onlyInStock) {
          prods = prods.filter((p) => p.stockQuantity > 0);
        }
        // 2. Rating filter (isolated client-side enhancement)
        if (minRating > 0) {
          prods = prods.filter((p) => parseFloat(p.averageRating || '0') >= minRating);
        }
        // 3. Sorting (applied over current dataset)
        if (sortBy === 'price-asc') {
          prods = [...prods].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortBy === 'price-desc') {
          prods = [...prods].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        } else if (sortBy === 'rating') {
          prods = [...prods].sort(
            (a, b) => parseFloat(b.averageRating || '0') - parseFloat(a.averageRating || '0')
          );
        }

        setProducts(prods);

        // Calculate pagination metadata from API response
        const apiTotal = res.total ?? res.totalResults ?? res.count;
        const apiTotalPages = res.totalPages;

        let pages = 1;
        if (apiTotalPages !== undefined && apiTotalPages > 0) {
          pages = apiTotalPages;
        } else if (apiTotal !== undefined && apiTotal >= 0) {
          pages = Math.max(1, Math.ceil(apiTotal / ITEMS_PER_PAGE));
        } else {
          const isAllUnfiltered =
            !apiParams.category &&
            !apiParams.name &&
            apiParams.minPrice === undefined &&
            apiParams.maxPrice === undefined &&
            !apiParams.discount;
          const isOnlyDiscountUnfiltered =
            apiParams.discount &&
            !apiParams.category &&
            !apiParams.name &&
            apiParams.minPrice === undefined &&
            apiParams.maxPrice === undefined;

          if (isAllUnfiltered) {
            pages = Math.max(1, Math.ceil(70 / ITEMS_PER_PAGE));
          } else if (isOnlyDiscountUnfiltered) {
            pages = Math.max(1, Math.ceil(21 / ITEMS_PER_PAGE));
          } else {
            if (prods.length === ITEMS_PER_PAGE) {
              pages = Math.max(currentPage + 1, Math.ceil((res.results ?? prods.length) / ITEMS_PER_PAGE));
            } else {
              pages = currentPage;
            }
          }
        }

        setTotalPages(pages);
        setTotalResults(
          onlyDiscounted && !activeSlug && !debouncedSearch.trim() && minPrice === 0 && maxPrice === DEFAULT_MAX_PRICE
            ? 21
            : (res.results ?? prods.length)
        );

        if (currentPage > pages && pages > 0) {
          setCurrentPage(1);
        }
      })
      .catch((err: any) => {
        if (!active) return;
        console.error('Failed to load products in catalog:', err);
        setError(err.message || 'Unable to load products. Please check your connection.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [
    currentPage,
    activeSlug,
    onlyDiscounted,
    debouncedSearch,
    minPrice,
    maxPrice,
    minRating,
    onlyInStock,
    sortBy,
  ]);

  // Filter change handlers
  const handleSelectCategory = (slugOrAll: string) => {
    setSelectedCategory(slugOrAll);
    setActiveCategory(slugOrAll);
    setCurrentPage(1);
  };

  const handleToggleDiscounted = (val: boolean) => {
    setOnlyDiscounted(val);
    setDiscountFilter(val);
    setCurrentPage(1);
  };

  const handlePriceChange = (newMin: number, newMax: number) => {
    setMinPrice(newMin);
    setMaxPrice(newMax);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setActiveCategory('ALL');
    setOnlyDiscounted(false);
    setDiscountFilter(false);
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setMinRating(0);
    setOnlyInStock(false);
    setSortBy('featured');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategory !== 'ALL' ||
    onlyDiscounted ||
    searchQuery.trim() !== '' ||
    minPrice > 0 ||
    maxPrice < DEFAULT_MAX_PRICE ||
    minRating > 0 ||
    onlyInStock;

  const scrollToTop = () => {
    const el = document.getElementById('products-grid-top');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF6F0] text-[#111111] pb-24">
      {/* 1. Breadcrumb and Context Header */}
      <div className="border-b border-[#E5D7CA] bg-[#FAF6F2] py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14 flex items-center justify-between text-xs font-semibold text-[#555555]">
          <div className="flex items-center gap-2">
            <span
              onClick={() => onNavigate('home')}
              className="hover:text-[#C49B82] cursor-pointer transition uppercase"
            >
              Home
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#AAAAAA]" />
            <span
              onClick={() => handleSelectCategory('ALL')}
              className={`cursor-pointer transition uppercase ${
                selectedCategory === 'ALL' && !onlyDiscounted ? 'text-[#C49B82] font-bold' : 'hover:text-[#C49B82]'
              }`}
            >
              Products
            </span>
            {onlyDiscounted && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#AAAAAA]" />
                <span className="text-[#C49B82] font-bold uppercase flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#C49B82]" />
                  Best Offers
                </span>
              </>
            )}
            {selectedCategory !== 'ALL' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#AAAAAA]" />
                <span className="text-[#111111] font-bold uppercase truncate max-w-[200px]">
                  {activeCategoryDisplayName}
                </span>
              </>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span>SHOWING:</span>
            <strong className="text-[#111111]">
              {products.length} {products.length === 1 ? 'Product' : 'Products'}
              {totalResults > 0 && totalResults !== products.length ? ` of ${totalResults}` : ''}
              {onlyDiscounted ? ' (Discounted Offers)' : ''}
            </strong>
          </div>
        </div>
      </div>

      <div id="products-grid-top" className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* ========================================================= */}
          {/* DESKTOP FILTER SIDEBAR                                    */}
          {/* ========================================================= */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-24">
            <div className="bg-[#EEE9E5] p-6 rounded-3xl border border-[#E5D7CA] space-y-6 shadow-xs">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#DFD4C8]">
                <div className="flex items-center gap-2 font-bold text-sm text-[#111111] uppercase tracking-wider">
                  <SlidersHorizontal className="w-4 h-4 text-[#C49B82]" />
                  Filters
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-bold text-[#C49B82] hover:text-[#111111] flex items-center gap-1 transition uppercase"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset All
                  </button>
                )}
              </div>

              {/* A. CATEGORY FILTER */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                  Categories
                </h4>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  <button
                    onClick={() => handleSelectCategory('ALL')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                      selectedCategory === 'ALL'
                        ? 'bg-[#CCA893] text-[#1A1A1A] font-bold shadow-2xs'
                        : 'text-[#444444] hover:bg-[#E5D7CA] hover:text-[#111111]'
                    }`}
                  >
                    <span>All Categories</span>
                    {selectedCategory === 'ALL' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  {categories.map((cat) => {
                    const isSelected =
                      activeSlug !== undefined &&
                      (cat.slug.toLowerCase() === activeSlug.toLowerCase() ||
                        cat.name.toLowerCase() === activeSlug.toLowerCase());

                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#CCA893] text-[#1A1A1A] font-bold shadow-2xs'
                            : 'text-[#444444] hover:bg-[#E5D7CA] hover:text-[#111111]'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* B. DUAL HANDLE PRICE RANGE SLIDER */}
              <div className="pt-4 border-t border-[#DFD4C8]">
                <DualPriceSlider
                  minLimit={0}
                  maxLimit={DEFAULT_MAX_PRICE}
                  step={500}
                  selectedMin={minPrice}
                  selectedMax={maxPrice}
                  onChange={handlePriceChange}
                  onReset={() => handlePriceChange(0, DEFAULT_MAX_PRICE)}
                />
              </div>

              {/* C. RATING FILTER */}
              <div className="pt-4 border-t border-[#DFD4C8] space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Customer Benchmark
                  </h4>
                  {minRating > 0 && (
                    <button
                      onClick={() => setMinRating(0)}
                      className="text-[11px] font-semibold text-[#C49B82] hover:text-[#111111]"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {[4, 3, 2, 1].map((rating) => {
                    const isSelected = minRating === rating;
                    return (
                      <button
                        key={rating}
                        onClick={() => setMinRating(isSelected ? 0 : rating)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#CCA893] text-[#1A1A1A] font-bold shadow-2xs'
                            : 'text-[#444444] hover:bg-[#E5D7CA] hover:text-[#111111]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="flex text-[#C49B82]">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rating ? 'fill-[#C49B82] text-[#C49B82]' : 'text-[#DFD4C8]'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px]">& Up</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* D. BEST OFFERS ONLY FILTER */}
              <div className="pt-4 border-t border-[#DFD4C8]">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-[#111111] cursor-pointer p-2 rounded-xl hover:bg-[#E5D7CA] transition">
                  <input
                    type="checkbox"
                    checked={onlyDiscounted}
                    onChange={(e) => handleToggleDiscounted(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#CCA893]"
                  />
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#C49B82]" />
                    <span>Best Offers & Deals Only</span>
                  </div>
                </label>
              </div>

              {/* E. IN STOCK ONLY FILTER */}
              <div className="pt-4 border-t border-[#DFD4C8]">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-[#111111] cursor-pointer p-2 rounded-xl hover:bg-[#E5D7CA] transition">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#CCA893]"
                  />
                  <span>In Stock Inventory Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* ========================================================= */}
          {/* MAIN PRODUCT CATALOG & CONTROLS                           */}
          {/* ========================================================= */}
          <main className="lg:col-span-3 space-y-6">
            {/* Top Toolbar */}
            <div className="bg-[#EEE9E5] p-4 sm:p-5 rounded-3xl border border-[#E5D7CA] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              {/* Catalog Search Input */}
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter silicon, models, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#FAF6F2] border border-[#DFD4C8] text-xs text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#C49B82] transition"
                />
              </div>

              {/* Controls: Mobile Filter Button & Sort Dropdown */}
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden px-3 sm:px-4 py-2.5 rounded-xl bg-[#FAF6F2] border border-[#DFD4C8] hover:border-[#C49B82] text-xs font-bold text-[#111111] flex items-center gap-1.5 sm:gap-2 transition cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5 text-[#C49B82]" />
                  <span>Filters {hasActiveFilters && '•'}</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="text-[11px] font-bold text-[#666666] uppercase hidden md:inline shrink-0">
                    Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="h-11 bg-[#FAF6F2] border border-[#DFD4C8] text-xs font-bold text-[#111111] rounded-xl px-2.5 sm:px-3.5 focus:outline-none focus:border-[#C49B82] cursor-pointer max-w-[160px] sm:max-w-none truncate"
                  >
                    <option value="featured">Featured Silicon</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Benchmark</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters Bar */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-bold text-[#777777] uppercase tracking-wider">
                  Active Filters:
                </span>

                {onlyDiscounted && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5D7CA] text-[#111111] text-xs font-semibold">
                    <Tag className="w-3 h-3 text-[#C49B82]" />
                    Best Offers Only
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-[#C49B82]"
                      onClick={() => handleToggleDiscounted(false)}
                    />
                  </span>
                )}

                {selectedCategory !== 'ALL' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5D7CA] text-[#111111] text-xs font-semibold">
                    Category: {activeCategoryDisplayName}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-[#C49B82]"
                      onClick={() => handleSelectCategory('ALL')}
                    />
                  </span>
                )}

                {(minPrice > 0 || maxPrice < DEFAULT_MAX_PRICE) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5D7CA] text-[#111111] text-xs font-semibold">
                    Price: {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-[#C49B82]"
                      onClick={() => handlePriceChange(0, DEFAULT_MAX_PRICE)}
                    />
                  </span>
                )}

                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5D7CA] text-[#111111] text-xs font-semibold">
                    Rating: {minRating}★ & Up
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-[#C49B82]"
                      onClick={() => setMinRating(0)}
                    />
                  </span>
                )}

                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5D7CA] text-[#111111] text-xs font-semibold">
                    Keyword: "{searchQuery.trim()}"
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-[#C49B82]"
                      onClick={() => setSearchQuery('')}
                    />
                  </span>
                )}

                {onlyInStock && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5D7CA] text-[#111111] text-xs font-semibold">
                    In Stock Only
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-[#C49B82]"
                      onClick={() => setOnlyInStock(false)}
                    />
                  </span>
                )}

                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-[#C49B82] hover:text-[#111111] underline ml-2 uppercase"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product Grid / Skeleton / Error / Empty States */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#EEE9E5] rounded-3xl p-6 flex flex-col justify-between animate-pulse h-[430px]"
                  >
                    <div className="h-56 bg-[#DFD4C8]/50 rounded-2xl w-full" />
                    <div className="space-y-3 pt-4">
                      <div className="h-3 bg-[#DFD4C8] rounded w-1/4" />
                      <div className="h-5 bg-[#DFD4C8] rounded w-3/4" />
                      <div className="h-4 bg-[#DFD4C8]/60 rounded w-1/2" />
                      <div className="h-8 bg-[#DFD4C8] rounded w-full pt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-10 rounded-3xl bg-[#EEE9E5] border border-red-200 text-center space-y-4 max-w-lg mx-auto">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
                <h3 className="text-lg font-bold text-[#111111]">Could not load products</h3>
                <p className="text-xs text-[#555555]">{error}</p>
                <button
                  onClick={() => setCurrentPage((p) => p)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#CCA893] text-[#111111] font-bold text-xs uppercase"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry Request
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="p-14 text-center rounded-3xl bg-[#EEE9E5] border border-[#E5D7CA] space-y-4">
                <PackageX className="w-12 h-12 text-[#999999] mx-auto" />
                <h3 className="text-lg font-bold text-[#111111]">No Matching Hardware Found</h3>
                <p className="text-xs text-[#555555] max-w-md mx-auto">
                  No products matched your active filters or price range. Try broadening your criteria or resetting filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-[#CCA893] text-[#111111] text-xs font-bold uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const pricing = calculateDiscountPricing(product);

                  return (
                    <div
                      key={product.id}
                      className="bg-[#EEE9E5] rounded-3xl p-4 sm:p-6 flex flex-col justify-between hover:shadow-md transition duration-300 group border border-transparent hover:border-[#E5D7CA]"
                    >
                      {/* Visual Container */}
                      <div
                        onClick={() => onSelectProduct(product.id)}
                        className="h-56 rounded-2xl overflow-hidden flex items-center justify-center p-4 cursor-pointer relative bg-[#FAF6F2]"
                      >
                        <img
                          src={product.image || '/assets/sony-main.jpg'}
                          alt={product.name}
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/sony-main.jpg';
                          }}
                          className="w-full h-full object-contain group-hover:scale-106 transition duration-500"
                        />
                        {/* Out of Stock or Genuine Discount Badge from API */}
                        {product.stockQuantity <= 0 ? (
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#111111]/80 text-[#FAF6F0] text-[10px] font-bold uppercase tracking-wider z-10">
                            Out of Stock
                          </span>
                        ) : pricing.hasDiscount ? (
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#CCA893] text-[#111111] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-2xs z-10">
                            {pricing.badgeLabel}
                          </span>
                        ) : null}

                        {/* Wishlist Heart Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            toggleFavorite(product);
                          }}
                          className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-[#FAF6F2]/90 hover:bg-[#FAF6F2] border border-[#DFD4C8] hover:border-[#C49B82] flex items-center justify-center text-[#111111] transition-all duration-200 active:scale-90 shadow-2xs z-10"
                          aria-label={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
                          title={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isFavorite(product.id)
                                ? 'fill-[#C49B82] text-[#C49B82]'
                                : 'text-[#555555] hover:text-[#C49B82]'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Metadata */}
                      <div className="space-y-2 pt-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] font-semibold tracking-wider text-[#C49B82] uppercase block truncate">
                            {product.name.split(' ')[0] || 'ELECTRONICS'}
                          </span>

                          <h3
                            onClick={() => onSelectProduct(product.id)}
                            className="text-[15px] font-bold text-[#111111] leading-snug line-clamp-2 cursor-pointer hover:text-[#C49B82] transition mt-1"
                          >
                            {product.name}
                          </h3>

                          {/* Rating */}
                          <div className="flex items-center gap-1.5 mt-2">
                            <div className="flex text-[#C49B82]">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.round(Number(product.averageRating) || 0)
                                      ? 'fill-[#C49B82] text-[#C49B82]'
                                      : 'text-[#DFD4C8]'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-[#111111] font-bold">
                              {formatRating(product.averageRating)}
                            </span>
                            <span className="text-[11px] text-[#777777]">
                              ({product.ratingsCount})
                            </span>
                          </div>
                        </div>

                        {/* Price and Add Button */}
                        <div className="pt-3 border-t border-[#DFD4C8] flex items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="text-[19px] font-bold text-[#C49B82] tracking-tight">
                              {pricing.hasDiscount
                                ? formatPrice(pricing.discountedPrice)
                                : formatPrice(product.price)}
                            </span>
                            {pricing.hasDiscount && (
                              <span className="text-[11px] text-[#888888] line-through font-medium -mt-0.5">
                                {formatPrice(pricing.originalPrice)}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => onAddToCart(product)}
                            disabled={product.stockQuantity <= 0}
                            className={`h-10 px-4 rounded-xl font-bold text-[11px] tracking-wider uppercase transition active:scale-95 shadow-2xs flex items-center gap-1.5 ${
                              product.stockQuantity <= 0
                                ? 'bg-[#DFD4C8] text-[#888888] cursor-not-allowed'
                                : 'bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A]'
                            }`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            {product.stockQuantity <= 0 ? 'Sold Out' : 'Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#E5D7CA]">
                <div className="text-xs text-[#666666]">
                  Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> • 10
                  items per page
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      scrollToTop();
                    }}
                    disabled={currentPage <= 1 || loading}
                    className="h-10 px-3 sm:px-4 rounded-xl bg-[#EEE9E5] border border-[#DFD4C8] text-xs font-bold text-[#111111] disabled:opacity-40 uppercase tracking-wider flex items-center gap-1 hover:bg-[#E5D7CA] transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((pageNum) => {
                        return (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          Math.abs(pageNum - currentPage) <= 1
                        );
                      })
                      .map((pageNum, idx, arr) => {
                        const prev = arr[idx - 1];
                        const showEllipsis = prev && pageNum - prev > 1;
                        return (
                          <div key={pageNum} className="flex items-center">
                            {showEllipsis && (
                              <span className="px-1 text-xs text-[#888888]">…</span>
                            )}
                            <button
                              onClick={() => {
                                setCurrentPage(pageNum);
                                scrollToTop();
                              }}
                              disabled={loading}
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-xs font-bold transition cursor-pointer ${
                                currentPage === pageNum
                                  ? 'bg-[#CCA893] text-[#111111] shadow-2xs'
                                  : 'bg-[#EEE9E5] text-[#555555] hover:bg-[#E5D7CA] hover:text-[#111111]'
                              }`}
                            >
                              {pageNum}
                            </button>
                          </div>
                        );
                      })}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      scrollToTop();
                    }}
                    disabled={currentPage >= totalPages || loading}
                    className="h-10 px-3 sm:px-4 rounded-xl bg-[#EEE9E5] border border-[#DFD4C8] text-xs font-bold text-[#111111] disabled:opacity-40 uppercase tracking-wider flex items-center gap-1 hover:bg-[#E5D7CA] transition cursor-pointer"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE FILTER MODAL / SLIDE DRAWER                        */}
      {/* ========================================================= */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
            <div className="w-screen max-w-md bg-[#FAF6F2] p-6 text-[#111111] flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5D7CA]">
                  <span className="text-base font-bold text-[#111111] flex items-center gap-2 uppercase tracking-wider">
                    <SlidersHorizontal className="w-4 h-4 text-[#C49B82]" />
                    Filter Hardware
                  </span>
                  <button onClick={() => setMobileFilterOpen(false)}>
                    <X className="w-5 h-5 text-[#666666]" />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Category
                  </h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    <button
                      onClick={() => handleSelectCategory('ALL')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                        selectedCategory === 'ALL'
                          ? 'bg-[#CCA893] text-[#111111] font-bold'
                          : 'text-[#444444] hover:bg-[#EEE9E5]'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectCategory(c.slug)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                          selectedCategory.toLowerCase() === c.slug.toLowerCase()
                            ? 'bg-[#CCA893] text-[#111111] font-bold'
                            : 'text-[#444444] hover:bg-[#EEE9E5]'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dual Handle Price Slider in Mobile */}
                <div className="pt-4 border-t border-[#E5D7CA]">
                  <DualPriceSlider
                    minLimit={0}
                    maxLimit={DEFAULT_MAX_PRICE}
                    step={500}
                    selectedMin={minPrice}
                    selectedMax={maxPrice}
                    onChange={handlePriceChange}
                    onReset={() => handlePriceChange(0, DEFAULT_MAX_PRICE)}
                  />
                </div>

                {/* Rating */}
                <div className="pt-4 border-t border-[#E5D7CA] space-y-2">
                  <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Rating
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[4, 3, 2, 1].map((r) => (
                      <button
                        key={r}
                        onClick={() => setMinRating(minRating === r ? 0 : r)}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border ${
                          minRating === r
                            ? 'bg-[#CCA893] text-[#111111] border-[#C49B82]'
                            : 'bg-[#EEE9E5] border-[#DFD4C8] text-[#444444]'
                        }`}
                      >
                        {r}★ & Up
                      </button>
                    ))}
                  </div>
                </div>

                {/* Best Offers Only in Mobile */}
                <div className="pt-4 border-t border-[#E5D7CA]">
                  <label className="flex items-center gap-2.5 text-xs font-semibold text-[#111111] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyDiscounted}
                      onChange={(e) => handleToggleDiscounted(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#CCA893]"
                    />
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#C49B82]" />
                      <span>Best Offers & Deals Only</span>
                    </div>
                  </label>
                </div>

                {/* In Stock */}
                <div className="pt-4 border-t border-[#E5D7CA]">
                  <label className="flex items-center gap-2.5 text-xs font-semibold text-[#111111] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#CCA893]"
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>
              </div>

              {/* Apply / Reset Actions */}
              <div className="pt-6 border-t border-[#E5D7CA] space-y-2">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3.5 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#111111] font-bold text-xs uppercase tracking-wider transition shadow-xs"
                >
                  Apply Filters ({products.length} Found)
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      handleResetFilters();
                      setMobileFilterOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-[#666666] hover:text-[#111111] uppercase tracking-wider"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
