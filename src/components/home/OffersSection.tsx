import type { FC } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Tag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingCart,
  Heart,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import type { ApiProduct } from '../../types/api';
import { offersService, calculateDiscountPricing } from '../../services/offersService';
import { useFavorites } from '../../context/FavoritesContext';
import { formatPrice, formatRating } from '../../utils/formatters';

interface OffersSectionProps {
  onSelectProduct: (productId: number) => void;
  onAddToCart: (product: ApiProduct) => void;
  onNavigateToOffers: () => void;
}

export const OffersSection: FC<OffersSectionProps> = ({
  onSelectProduct,
  onAddToCart,
  onNavigateToOffers,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeftState, setScrollLeftState] = useState<number>(0);
  const [dragDistance, setDragDistance] = useState<number>(0);

  const carouselRef = useRef<HTMLDivElement>(null);

  // 1. Fetch discounted offer products directly from API using discount=true
  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await offersService.getOffers(1);
      setProducts(res.products);
    } catch (err: any) {
      console.error('Failed to load discounted offers:', err);
      setError(err.message || 'Unable to load best offers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  // 2. Monitor scroll position to update arrow disabled states
  const updateScrollBounds = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    updateScrollBounds();
    el.addEventListener('scroll', updateScrollBounds, { passive: true });
    window.addEventListener('resize', updateScrollBounds);
    return () => {
      el.removeEventListener('scroll', updateScrollBounds);
      window.removeEventListener('resize', updateScrollBounds);
    };
  }, [products, updateScrollBounds]);

  // 3. Carousel Navigation: scroll by one view width
  const handleScroll = (direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;

    // Scroll by the visible width so 4 cards advance cleanly on desktop
    const scrollStep = el.clientWidth;
    el.scrollBy({
      left: direction === 'left' ? -scrollStep : scrollStep,
      behavior: 'smooth',
    });
  };

  // 4. Mouse Drag & Touch Gesture Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = carouselRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
    setDragDistance(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = carouselRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeftState - walk;
    setDragDistance(Math.abs(walk));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCardClick = (id: number) => {
    if (dragDistance > 6) return;
    onSelectProduct(id);
  };

  if (!loading && products.length === 0 && !error) {
    return null;
  }

  return (
    <section
      id="offers-section"
      className="scroll-mt-24 space-y-6 pt-4"
      aria-label="Best Offers"
    >
      {/* 1. SECTION HEADER: Title & View All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#EEE9E5] border border-[#DFD4C8] text-[#C49B82] text-[11px] font-bold tracking-[0.08em] uppercase flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              Limited Time Deals
            </span>
          </div>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#111111] tracking-tight mt-1.5 flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#C49B82]" />
            Best Offers
          </h2>
          <p className="text-[13px] text-[#555555] mt-1">
            Exclusive discounted pricing directly from our verified electronics catalog.
          </p>
        </div>

        {/* View All Link */}
        <button
          type="button"
          onClick={onNavigateToOffers}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-[#EEE9E5] hover:bg-[#E5D7CA] border border-[#DFD4C8] hover:border-[#C49B82] text-[#111111] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition active:scale-95 shadow-2xs"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4 text-[#C49B82]" />
        </button>
      </div>

      {/* 2. OFFERS CAROUSEL BODY */}
      {loading ? (
        // Loading Skeleton: 4 cards visible across
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[#EEE9E5] rounded-3xl p-5 flex flex-col justify-between animate-pulse h-[420px]"
            >
              <div className="h-48 bg-[#DFD4C8]/60 rounded-2xl w-full" />
              <div className="space-y-3 pt-4">
                <div className="h-3 bg-[#DFD4C8] rounded w-1/3" />
                <div className="h-5 bg-[#DFD4C8] rounded w-3/4" />
                <div className="h-4 bg-[#DFD4C8]/50 rounded w-1/2" />
                <div className="h-8 bg-[#DFD4C8] rounded w-full pt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-3xl bg-[#EEE9E5] border border-red-200 text-center space-y-3 max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="text-sm font-bold text-[#111111]">Could not load Best Offers</h3>
          <p className="text-xs text-[#555555]">{error}</p>
          <button
            type="button"
            onClick={fetchOffers}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#CCA893] text-[#111111] text-xs font-bold uppercase tracking-wider transition hover:bg-[#C29D87]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      ) : (
        /* Horizontal Carousel with Circular Navigation Arrows at the sides */
        <div className="relative flex items-center gap-2 sm:gap-4">
          {/* Circular Left Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#EEE9E5] hover:bg-[#E5D7CA] border border-[#DFD4C8] hover:border-[#C49B82] text-[#111111] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition active:scale-95 shadow-sm hover:shadow-md cursor-pointer z-10"
            aria-label="Previous offers"
            title="Previous offers"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Carousel Scroll Track: Exactly 4 cards visible at a time on desktop */}
          <div
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="flex-1 flex gap-6 overflow-x-auto py-3 scroll-smooth select-none cursor-grab active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product) => {
              const pricing = calculateDiscountPricing(product);

              return (
                <div
                  key={product.id}
                  className="w-full sm:w-[calc(50%-12px)] md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 bg-[#EEE9E5] hover:bg-[#EDE7E2] rounded-3xl p-5 border border-[#E5D7CA] hover:border-[#C49B82] transition-all duration-300 flex flex-col justify-between hover:shadow-md group relative"
                >
                  {/* Card Visual Showcase */}
                  <div
                    onClick={() => handleCardClick(product.id)}
                    className="h-48 sm:h-52 rounded-2xl bg-[#FAF6F2] p-4 flex items-center justify-center cursor-pointer relative overflow-hidden group-hover:bg-white transition"
                  >
                    <img
                      src={product.image || '/assets/sony-main.jpg'}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/sony-main.jpg';
                      }}
                      className="w-full h-full object-contain group-hover:scale-106 transition duration-300 drop-shadow-xs pointer-events-none"
                    />

                    {/* Genuine Discount Badge from API */}
                    {pricing.hasDiscount && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#CCA893] text-[#111111] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-2xs z-10">
                        {pricing.badgeLabel}
                      </span>
                    )}

                    {/* Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleFavorite(product);
                      }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#FAF6F2]/90 hover:bg-[#FAF6F2] border border-[#DFD4C8] hover:border-[#C49B82] flex items-center justify-center text-[#111111] transition-all duration-200 active:scale-90 shadow-2xs z-10"
                      aria-label={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                      title={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          isFavorite(product.id)
                            ? 'fill-[#C49B82] text-[#C49B82]'
                            : 'text-[#555555] hover:text-[#C49B82]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Metadata & Pricing Details */}
                  <div className="pt-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#777777] font-medium uppercase tracking-wider mb-1">
                        <span>{product.name.split(' ')[0] || 'HARDWARE'}</span>
                        <div className="flex items-center gap-1 text-[#C49B82]">
                          <Star className="w-3.5 h-3.5 fill-[#C49B82]" />
                          <span className="font-bold text-[#111111]">
                            {formatRating(product.averageRating)}
                          </span>
                          <span className="text-[10px] text-[#777777]">
                            ({product.ratingsCount})
                          </span>
                        </div>
                      </div>

                      <h3
                        onClick={() => handleCardClick(product.id)}
                        className="text-[14px] sm:text-[15px] font-bold text-[#111111] group-hover:text-[#C49B82] transition line-clamp-2 leading-snug cursor-pointer"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                    </div>

                    {/* Pricing with Strikethrough & Action Button */}
                    <div className="pt-2 border-t border-[#DFD4C8] flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[17px] sm:text-[19px] font-bold text-[#C49B82] tracking-tight">
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
                        type="button"
                        onClick={() => onAddToCart(product)}
                        disabled={product.stockQuantity <= 0}
                        className={`h-10 px-3.5 sm:px-4 rounded-xl font-bold text-[11px] tracking-[0.08em] uppercase transition active:scale-95 shadow-xs flex items-center gap-1.5 ${
                          product.stockQuantity <= 0
                            ? 'bg-[#DFD4C8] text-[#888888] cursor-not-allowed'
                            : 'bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A]'
                        }`}
                        title={product.stockQuantity <= 0 ? 'Out of stock' : 'Add to cart'}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{product.stockQuantity <= 0 ? 'SOLD' : 'ADD'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Circular Right Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#EEE9E5] hover:bg-[#E5D7CA] border border-[#DFD4C8] hover:border-[#C49B82] text-[#111111] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition active:scale-95 shadow-sm hover:shadow-md cursor-pointer z-10"
            aria-label="Next offers"
            title="Next offers"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}
    </section>
  );
};
