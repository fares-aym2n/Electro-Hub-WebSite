import type { FC } from 'react';
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ChevronRight,
  Star,
  PackageOpen,
  Lock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import type { PageId } from '../electro/ElectroHeader';
import type { ApiProduct } from '../../types/api';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { calculateDiscountPricing } from '../../services/offersService';
import { formatPrice, formatRating } from '../../utils/formatters';

interface WishlistViewProps {
  onNavigate: (page: PageId) => void;
  onSelectProduct: (productId: number) => void;
  onAddToCart: (product: ApiProduct) => void;
}

export const WishlistView: FC<WishlistViewProps> = ({
  onNavigate,
  onSelectProduct,
  onAddToCart,
}) => {
  const { user, openAuthModal } = useAuth();
  const {
    favorites,
    favoritesCount,
    loading,
    error,
    removeFavorite,
    clearFavorites,
    refreshWishlist,
  } = useFavorites();

  const handleProductClick = (id: number) => {
    onSelectProduct(id);
    onNavigate('product-details');
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#FBF6F0] text-[#111111] pb-24">
      {/* 1. Breadcrumbs */}
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
            <span className="text-[#C49B82] font-bold uppercase">Wishlist</span>
          </div>

          <div className="text-xs">
            <span>SAVED ITEMS: </span>
            <strong className="text-[#111111]">
              {user ? favoritesCount : 0} {favoritesCount === 1 ? 'Product' : 'Products'}
            </strong>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14 py-6 sm:py-8 lg:py-12 space-y-8">
        {/* 2. Page Heading & Clear Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE0D5] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEE9E5] border border-[#DFD4C8] text-[11px] font-bold tracking-[0.08em] text-[#C49B82] uppercase mb-2">
              <Heart className="w-3.5 h-3.5 fill-[#C49B82]" />
              Personal Collection
            </div>
            <h1 className="text-[28px] sm:text-[34px] font-bold text-[#111111] tracking-tight">
              My Saved Favorites
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] mt-1">
              Synchronized directly with your authenticated account. Keep track of hardware prices and add items to your cart at any time.
            </p>
          </div>

          {user && favoritesCount > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="px-4 py-2.5 rounded-xl bg-[#FAF6F2] hover:bg-[#E5D7CA] border border-[#DFD4C8] text-xs font-bold text-[#111111] transition flex items-center gap-1.5 uppercase tracking-wider shadow-2xs"
              >
                <span>Browse More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={clearFavorites}
                className="px-4 py-2.5 rounded-xl bg-transparent hover:bg-red-50 border border-red-200 text-xs font-bold text-red-600 transition flex items-center gap-1.5 uppercase tracking-wider"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Wishlist</span>
              </button>
            </div>
          )}
        </div>

        {/* 3. Unauthenticated State */}
        {!user ? (
          <div className="rounded-3xl bg-[#EEE9E5] border border-[#E5D7CA] p-12 sm:p-16 text-center max-w-2xl mx-auto space-y-6 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#FAF6F2] border border-[#DFD4C8] flex items-center justify-center mx-auto text-[#C49B82] shadow-2xs">
              <Lock className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-[22px] sm:text-[26px] font-bold text-[#111111] tracking-tight">
                Sign In to View Your Wishlist
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto leading-relaxed">
                Your wishlist is tied to your personal account. Please log in or create an account to view and synchronize your saved hardware across all devices.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="h-12 px-8 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase flex items-center gap-2 transition active:scale-98 shadow-xs cursor-pointer"
              >
                <span>Sign In to Your Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="h-12 px-6 rounded-xl bg-[#FAF6F2] hover:bg-[#EAE0D5] border border-[#DFD4C8] text-[#111111] font-semibold text-[13px] tracking-[0.06em] uppercase transition"
              >
                Explore Products
              </button>
            </div>
          </div>
        ) : loading ? (
          /* 4. Loading Skeleton */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-[#EEE9E5] rounded-3xl p-5 flex flex-col justify-between animate-pulse h-[420px]"
              >
                <div className="h-52 bg-[#DFD4C8]/50 rounded-2xl w-full" />
                <div className="space-y-3 pt-4">
                  <div className="h-3 bg-[#DFD4C8] rounded w-1/4" />
                  <div className="h-5 bg-[#DFD4C8] rounded w-3/4" />
                  <div className="h-4 bg-[#DFD4C8]/60 rounded w-1/2" />
                  <div className="h-9 bg-[#DFD4C8] rounded w-full pt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* 5. Error State */
          <div className="p-10 rounded-3xl bg-[#EEE9E5] border border-red-200 text-center space-y-4 max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="text-lg font-bold text-[#111111]">Could not load your wishlist</h3>
            <p className="text-xs text-[#555555]">{error}</p>
            <button
              onClick={() => refreshWishlist()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#CCA893] text-[#111111] font-bold text-xs uppercase"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Request
            </button>
          </div>
        ) : favoritesCount === 0 ? (
          /* 6. Empty State */
          <div className="rounded-3xl bg-[#EEE9E5] border border-[#E5D7CA] p-12 sm:p-16 text-center max-w-2xl mx-auto space-y-6 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#FAF6F2] border border-[#DFD4C8] flex items-center justify-center mx-auto text-[#C49B82] shadow-2xs">
              <PackageOpen className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-[22px] sm:text-[26px] font-bold text-[#111111] tracking-tight">
                Your Wishlist is Currently Empty
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto leading-relaxed">
                You haven't saved any hardware yet. Browse our verified electronics catalog and tap the heart icon on any card to save items to your personal wishlist.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="h-12 px-8 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase flex items-center gap-2 transition active:scale-98 shadow-xs"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="h-12 px-6 rounded-xl bg-[#FAF6F2] hover:bg-[#EAE0D5] border border-[#DFD4C8] text-[#111111] font-semibold text-[13px] tracking-[0.06em] uppercase transition"
              >
                Return to Home
              </button>
            </div>
          </div>
        ) : (
          /* 7. Saved Product Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => {
              const pricing = calculateDiscountPricing(product);

              return (
                <div
                  key={product.id}
                  className="bg-[#EEE9E5] rounded-3xl p-5 flex flex-col justify-between hover:shadow-md transition duration-300 group border border-transparent hover:border-[#E5D7CA] relative"
                >
                  {/* Visual Container */}
                  <div
                    onClick={() => handleProductClick(product.id)}
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

                    {/* Stock Status Badge or Discount Badge */}
                    {product.stockQuantity <= 0 ? (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#111111]/80 text-[#FAF6F0] text-[10px] font-bold uppercase tracking-wider z-10">
                        Out of Stock
                      </span>
                    ) : pricing.hasDiscount ? (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#CCA893] text-[#111111] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-2xs z-10">
                        {pricing.badgeLabel}
                      </span>
                    ) : null}

                    {/* Remove from Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeFavorite(product.id);
                      }}
                      className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-[#FAF6F2]/90 hover:bg-[#FAF6F2] border border-[#DFD4C8] hover:border-red-400 flex items-center justify-center text-[#C49B82] hover:text-red-500 transition-all duration-200 active:scale-90 shadow-2xs z-10"
                      aria-label="Remove from wishlist"
                      title="Remove from wishlist"
                    >
                      <Heart className="w-4 h-4 fill-[#C49B82] text-[#C49B82] hover:text-red-500 hover:fill-red-500 transition-colors" />
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-2 pt-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-semibold tracking-wider text-[#C49B82] uppercase block truncate">
                        {product.name.split(' ')[0] || 'ELECTRONICS'}
                      </span>

                      <h3
                        onClick={() => handleProductClick(product.id)}
                        className="text-[15px] font-bold text-[#111111] leading-snug line-clamp-2 cursor-pointer hover:text-[#C49B82] transition mt-1"
                      >
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mt-2">
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
                        <span className="text-[12px] text-[#555555] font-medium">
                          {formatRating(product.averageRating)} ({product.ratingsCount})
                        </span>
                      </div>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="pt-3 border-t border-[#DFD4C8] flex items-center justify-between gap-3">
                      <div className="flex flex-col">
                        <span className="text-[18px] font-bold text-[#C49B82] tracking-tight">
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
                        className={`h-10 px-4 rounded-xl font-bold text-[11px] tracking-[0.08em] uppercase transition active:scale-95 shadow-xs flex items-center gap-1.5 ${
                          product.stockQuantity <= 0
                            ? 'bg-[#DFD4C8] text-[#888888] cursor-not-allowed'
                            : 'bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A]'
                        }`}
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
        )}
      </div>
    </div>
  );
};
