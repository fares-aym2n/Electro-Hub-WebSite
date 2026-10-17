import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import {
  Star,
  Minus,
  Plus,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  MessageSquarePlus,
  Heart,
  Edit3,
  Trash2,
  ShoppingCart,
} from 'lucide-react';
import type { PageId } from '../electro/ElectroHeader';
import type { ApiProduct, ApiReview } from '../../types/api';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import type { AddToCartOptions } from '../../context/CartContext';
import { formatPrice, formatRating, formatDate } from '../../utils/formatters';
import { BackButton } from '../common/BackButton';
import { StarRatingDisplay } from '../common/StarRating';
import { EditReviewModal } from '../reviews/EditReviewModal';
import { DeleteReviewModal } from '../reviews/DeleteReviewModal';

interface ProductDetailsViewProps {
  productId?: number;
  onNavigate: (page: PageId) => void;
  onAddToCart: (
    product: ApiProduct,
    quantity: number,
    options?: AddToCartOptions
  ) => Promise<boolean> | void;
}

export const ProductDetailsView: FC<ProductDetailsViewProps> = ({
  productId = 29, // Default to Sony WH-1000XM5 id 29 matching design reference
  onNavigate,
  onAddToCart,
}) => {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [addedNotice, setAddedNotice] = useState(false);

  // Review management states
  const [editingReview, setEditingReview] = useState<ApiReview | null>(null);
  const [deletingReview, setDeletingReview] = useState<ApiReview | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Fetch real product by ID and enrich reviews with author info
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    productService
      .getProductById(productId)
      .then(async (data) => {
        if (!isMounted) return;
        setProduct(data);
        const rawReviews = data.reviews || [];
        setReviews(rawReviews);
        setSelectedThumb(0);

        // If backend product reviews lack user relation, fetch individual review details in parallel
        if (rawReviews.some((r) => !r.user || !r.user.id)) {
          try {
            const enriched = await Promise.all(
              rawReviews.map(async (r) => {
                if (r.user && r.user.id) return r;
                try {
                  return await reviewService.getReviewById(r.id);
                } catch {
                  return r;
                }
              })
            );
            if (isMounted) {
              setReviews(enriched);
            }
          } catch {
            // Keep rawReviews if individual fetches fail
          }
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          console.error(`Failed to load product ${productId}:`, err);
          setError(err.message || 'Unable to retrieve product details from backend.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  // Gallery thumbnails: Use product.image or angle thumbnails if available
  const thumbnails = useMemo(() => {
    if (!product) return [];
    const baseImg = product.image || '/assets/sony-main.jpg';
    // Provide gallery angles or fallback angles
    if (product.id === 29) {
      return [
        baseImg,
        '/assets/sony-thumb-1.jpg',
        '/assets/sony-thumb-2.jpg',
        '/assets/sony-thumb-3.jpg',
        '/assets/sony-thumb-4.jpg',
      ];
    }
    return [baseImg];
  }, [product]);

  // Calculate real rating distribution breakdown from reviews
  const ratingsBreakdown = useMemo(() => {
    const total = reviews.length;

    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });

    return [5, 4, 3, 2, 1].map((star) => {
      const count = counts[star] || 0;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return { star: `${star} STAR`, pct, count };
    });
  }, [reviews]);

  // Dynamic live average rating from active reviews, synchronized with product aggregate
  const currentAverageRating = useMemo(() => {
    if (reviews.length === 0) return product?.averageRating || '0.0';
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews, product?.averageRating]);

  const handleSaveReviewSuccess = (updatedReview: ApiReview) => {
    // 1. Update review in local state immediately
    setReviews((prev) =>
      prev.map((r) => (r.id === updatedReview.id ? updatedReview : r))
    );

    // 2. Refetch product details so backend recalculation of averageRating & ratingsCount is synchronized
    productService
      .getProductById(productId)
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        console.warn('Failed to refresh product aggregates:', err);
      });

    // 3. Display success toast notification
    setFeedbackToast({
      message: 'Your review was updated successfully!',
      type: 'success',
    });
    setTimeout(() => {
      setFeedbackToast((cur) => (cur?.message.includes('updated') ? null : cur));
    }, 4000);
  };

  const handleDeleteReviewSuccess = (deletedReviewId: number) => {
    // 1. Remove review from local state immediately
    setReviews((prev) => prev.filter((r) => r.id !== deletedReviewId));

    // 2. Refetch product details so backend recalculation of averageRating & ratingsCount is synchronized
    productService
      .getProductById(productId)
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        console.warn('Failed to refresh product aggregates:', err);
      });

    // 3. Display success toast notification
    setFeedbackToast({
      message: 'Your review was deleted successfully.',
      type: 'success',
    });
    setTimeout(() => {
      setFeedbackToast((cur) => (cur?.message.includes('deleted') ? null : cur));
    }, 4000);
  };

  const handleAdd = async (e?: React.MouseEvent) => {
    if (!product) return;
    const mainImgEl = document.querySelector('[data-product-main-image="true"]') as HTMLElement | null;
    const fallbackEl = (e?.currentTarget as HTMLElement | null) || mainImgEl;
    const rect = (mainImgEl || fallbackEl)?.getBoundingClientRect();

    const res = await onAddToCart(product, quantity, {
      sourceElement: mainImgEl || fallbackEl,
      startRect: rect
        ? {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          }
        : null,
      imageSrc: currentDisplayImage,
    });
    if (res !== false) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    const mainImgEl = document.querySelector('[data-product-main-image="true"]') as HTMLElement | null;
    const rect = mainImgEl?.getBoundingClientRect();
    onAddToCart(product, quantity, {
      sourceElement: mainImgEl,
      startRect: rect
        ? {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          }
        : null,
      imageSrc: currentDisplayImage,
    });
    onNavigate('checkout');
  };

  if (loading) {
    return (
      <div className="bg-[#FBF6F0] min-h-[calc(100vh-140px)] py-12">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
            <div className="lg:col-span-5 h-[440px] bg-[#EEE9E5] rounded-3xl" />
            <div className="lg:col-span-4 space-y-4">
              <div className="h-4 bg-[#DFD4C8] rounded w-1/4" />
              <div className="h-8 bg-[#DFD4C8] rounded w-3/4" />
              <div className="h-6 bg-[#DFD4C8] rounded w-1/3" />
              <div className="h-24 bg-[#DFD4C8] rounded w-full" />
            </div>
            <div className="lg:col-span-3 h-[300px] bg-[#EEE9E5] rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-[#FBF6F0] min-h-[calc(100vh-140px)] py-16 flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-[#EEE9E5] border border-red-300 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-[#111111]">Product Not Found</h2>
          <p className="text-sm text-[#555555]">
            {error || 'The requested product could not be retrieved from the catalog.'}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-2.5 rounded-lg bg-[#CCA893] text-[#111111] font-bold text-xs uppercase"
            >
              Back to Catalog
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2.5 rounded-lg bg-transparent border border-[#DFD4C8] text-[#111111] font-bold text-xs uppercase flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentDisplayImage = thumbnails[selectedThumb] || product.image || '/assets/sony-main.jpg';

  return (
    <div className="bg-[#FBF6F0] min-h-[calc(100vh-140px)] py-6 sm:py-8 lg:py-14">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14 space-y-6">
        {/* Back Navigation */}
        <div>
          <BackButton label="Back to Products" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          
          {/* ========================================================= */}
          {/* LEFT: THUMBNAILS + MAIN PRODUCT SHOWCASE CARD */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-3 sm:gap-6">
            {/* Thumbnails Row on mobile / Column on tablet+ */}
            {thumbnails.length > 1 && (
              <div className="flex flex-row sm:flex-col gap-2.5 sm:gap-3 shrink-0 overflow-x-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {thumbnails.map((src, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedThumb(index)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl overflow-hidden bg-[#EEE9E5] p-1 border transition cursor-pointer ${
                      selectedThumb === index
                        ? 'border-[#C49B82] ring-1 ring-[#C49B82]'
                        : 'border-transparent hover:border-[#DFD4C8]'
                    }`}
                  >
                    <img
                      src={src}
                      alt={`Angle ${index + 1}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/sony-main.jpg';
                      }}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Showcase Card */}
            <div className="flex-1 bg-[#EEE9E5] rounded-3xl p-4 sm:p-8 flex items-center justify-center min-h-[300px] sm:min-h-[440px] relative">
              <img
                data-product-main-image="true"
                src={currentDisplayImage}
                alt={product.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/sony-main.jpg';
                }}
                className="w-full h-auto max-h-[320px] sm:max-h-[380px] object-contain drop-shadow-md"
              />

              {/* Wishlist Heart Button */}
              <button
                type="button"
                onClick={() => toggleFavorite(product)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FAF6F2]/90 hover:bg-[#FAF6F2] border border-[#DFD4C8] hover:border-[#C49B82] flex items-center justify-center text-[#111111] transition-all duration-200 active:scale-90 shadow-2xs z-10 cursor-pointer"
                aria-label={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
                title={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isFavorite(product.id)
                      ? 'fill-[#C49B82] text-[#C49B82]'
                      : 'text-[#555555] hover:text-[#C49B82]'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* MIDDLE: PRODUCT DETAILS, PRICING & ACTIONS */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-4 xl:space-y-5">
            <div>
              <span className="text-[13px] font-medium tracking-[0.08em] text-[#C49B82] uppercase block mb-1">
                {product.name.split(' ')[0] || 'ELECTRONICS'}
              </span>
              <h1 className="text-[24px] sm:text-[30px] xl:text-[34px] font-bold text-[#111111] leading-[1.18] tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Star Rating Line */}
            <div className="flex items-center gap-2">
              <div className="flex text-[#C49B82]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(Number(currentAverageRating) || 0)
                        ? 'fill-[#C49B82] text-[#C49B82]'
                        : 'text-[#DFD4C8]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[14px] text-[#111111] font-medium">
                {formatRating(currentAverageRating)} ({reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-[24px] xl:text-[28px] font-bold text-[#C49B82] tracking-tight">
              {formatPrice(product.price)}
            </div>

            {/* In Stock Status */}
            <div className="flex items-center gap-2">
              <span
                className={`text-[13px] font-bold tracking-wide uppercase ${
                  product.stockQuantity > 0 ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {product.stockQuantity > 0
                  ? `IN STOCK (${product.stockQuantity} UNITS AVAILABLE)`
                  : 'OUT OF STOCK'}
              </span>
            </div>

            {/* Quantity & Add to Cart Row */}
            <div className="space-y-2 pt-1">
              <div className="text-[12px] font-bold text-[#111111] uppercase tracking-[0.06em]">
                QUANTITY
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Quantity Box */}
                <div className="bg-[#EDE8E4] rounded-lg h-11 px-3 sm:px-4 flex items-center justify-between gap-3 sm:gap-5 text-[#111111] font-semibold text-sm w-28 sm:w-32 shrink-0 select-none">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={product.stockQuantity <= 0}
                    className="p-1 hover:text-[#C49B82] transition disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity || 99, q + 1))}
                    disabled={product.stockQuantity <= 0 || quantity >= product.stockQuantity}
                    className="p-1 hover:text-[#C49B82] transition disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={product.stockQuantity <= 0}
                  className={`flex-1 font-bold text-[12px] sm:text-[13px] tracking-[0.08em] uppercase h-11 px-4 sm:px-8 rounded-lg transition-all duration-200 active:scale-98 shadow-xs cursor-pointer truncate flex items-center justify-center gap-2 ${
                    product.stockQuantity <= 0
                      ? 'bg-[#DFD4C8] text-[#888888] cursor-not-allowed'
                      : 'bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A]'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 text-[#1A1A1A]" />
                  <span>ADD TO CART</span>
                </button>

                {/* Wishlist Heart Button */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(product)}
                  className={`h-11 w-11 shrink-0 rounded-lg border border-[#DFD4C8] hover:border-[#C49B82] flex items-center justify-center transition active:scale-95 shadow-xs cursor-pointer ${
                    isFavorite(product.id)
                      ? 'bg-[#E5D7CA] text-[#C49B82]'
                      : 'bg-[#EDE8E4] text-[#555555] hover:text-[#C49B82]'
                  }`}
                  aria-label={isFavorite(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  title={isFavorite(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite(product.id) ? 'fill-[#C49B82] text-[#C49B82]' : ''
                    }`}
                  />
                </button>
              </div>

              {addedNotice && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Added {quantity} unit(s) to cart successfully!
                </div>
              )}
            </div>

            {/* Buy Now Button */}
            {product.stockQuantity > 0 && (
              <button
                onClick={handleBuyNow}
                className="w-full h-11 rounded-lg bg-transparent border border-[#C49B82] text-[#111111] font-bold text-[13px] tracking-[0.08em] uppercase hover:bg-[#EEE9E5] transition"
              >
                BUY NOW
              </button>
            )}

            {/* Divider */}
            <div className="border-t border-[#EAE0D5] pt-4" />

            {/* Description */}
            <div className="space-y-2">
              <div className="text-[13px] font-bold text-[#111111] uppercase tracking-[0.06em]">
                DESCRIPTION
              </div>
              <p className="text-[14px] text-[#333333] leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: CUSTOMER REVIEWS RATING BREAKDOWN */}
          {/* ========================================================= */}
          <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-[#EAE0D5] lg:pl-8 xl:pl-10 pt-6 lg:pt-0 space-y-4">
            <h3 className="text-[14px] font-bold text-[#111111] uppercase tracking-[0.06em]">
              CUSTOMER REVIEWS
            </h3>

            {/* Big Score */}
            <div className="pt-2">
              <div className="text-[52px] font-bold text-[#C49B82] leading-none tracking-tight">
                {formatRating(currentAverageRating)}
              </div>

              {/* 5 Stars */}
              <div className="flex text-[#C49B82] mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(Number(currentAverageRating) || 0)
                        ? 'fill-[#C49B82] text-[#C49B82]'
                        : 'text-[#DFD4C8]'
                    }`}
                  />
                ))}
              </div>

              <div className="text-[14px] text-[#111111] font-medium mt-2">
                {reviews.length} reviews
              </div>
            </div>

            {/* Real Star Distribution Progress Bars */}
            <div className="space-y-3 pt-3">
              {ratingsBreakdown.map((item) => (
                <div key={item.star} className="flex items-center gap-3 text-[12px] font-semibold text-[#111111]">
                  <span className="w-14 shrink-0 uppercase tracking-wide">{item.star}</span>
                  <div className="flex-1 h-3 rounded-full bg-[#EFEAE4] overflow-hidden">
                    <div
                      className="h-full bg-[#CCA893] rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right shrink-0">{item.pct}%</span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="pt-6 space-y-3">
              <button
                onClick={() => onNavigate('review')}
                className="w-full py-2.5 px-4 rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[12px] tracking-[0.08em] uppercase flex items-center justify-center gap-2 transition"
              >
                <MessageSquarePlus className="w-4 h-4" />
                WRITE A REVIEW
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('recent-reviews-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block text-[13px] font-bold text-[#C49B82] tracking-[0.08em] uppercase hover:underline transition"
              >
                VIEW ALL ({reviews.length}) REVIEWS ↓
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RECENT REVIEWS SECTION (REAL BACKEND REVIEWS) */}
        {/* ========================================================= */}
        <div id="recent-reviews-section" className="mt-16 pt-10 border-t border-[#EAE0D5] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[22px] sm:text-[26px] font-bold text-[#111111]">
                Customer Testimonials
              </h2>
              <p className="text-xs sm:text-sm text-[#555555]">
                Real feedback submitted by verified buyers on Electro Hub
              </p>
            </div>
            <button
              onClick={() => onNavigate('review')}
              className="text-xs font-bold uppercase tracking-wider text-[#C49B82] hover:underline"
            >
              + Add Review
            </button>
          </div>

          {/* Feedback Toast Notification */}
          {feedbackToast && (
            <div
              className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm transition animate-in fade-in duration-200 ${
                feedbackToast.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-medium">{feedbackToast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackToast(null)}
                className="text-xs font-bold uppercase tracking-wider hover:underline opacity-70 hover:opacity-100"
              >
                Dismiss
              </button>
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#EEE9E5] text-center space-y-2">
              <p className="text-sm text-[#555555]">No customer reviews submitted for this product yet.</p>
              <button
                onClick={() => onNavigate('review')}
                className="text-xs font-bold text-[#C49B82] uppercase tracking-wider underline"
              >
                Be the first to write a review
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {reviews.map((rev) => {
                const isOwner = Boolean(user && rev.user && rev.user.id === user.id);
                const canDelete = Boolean(isOwner || (user && user.role === 'admin'));
                const authorName = rev.user?.username || 'Verified Buyer';
                const avatarInitial = (authorName.charAt(0) || 'U').toUpperCase();
                const isEdited = Boolean(
                  rev.updatedAt &&
                  rev.createdAt &&
                  new Date(rev.updatedAt).getTime() - new Date(rev.createdAt).getTime() > 2000
                );

                return (
                  <div
                    key={rev.id}
                    className={`p-5 sm:p-6 rounded-2xl bg-[#EEE9E5] border transition space-y-3.5 relative ${
                      isOwner
                        ? 'border-[#C49B82] shadow-xs'
                        : 'border-[#E5D7CA]'
                    }`}
                  >
                    {/* Header: Author Info + Date + Action Buttons */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-[#DFD4C8] border border-[#C49B82]/30 flex items-center justify-center text-[#111111] font-bold text-xs shrink-0 uppercase overflow-hidden">
                          {rev.user?.profile_image ? (
                            <img
                              src={rev.user.profile_image}
                              alt={authorName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            avatarInitial
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-[#111111]">
                              {authorName}
                            </span>
                            {isOwner && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#C49B82] text-[#FAF6F2]">
                                You
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#777777] font-medium">
                            <span>{formatDate(rev.createdAt)}</span>
                            {isEdited && (
                              <>
                                <span>•</span>
                                <span className="italic text-[#888888]">(edited)</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: Render ONLY if current user is owner (or admin for delete) */}
                      {(isOwner || canDelete) && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isOwner && (
                            <button
                              type="button"
                              onClick={() => setEditingReview(rev)}
                              className="px-2.5 py-1 rounded-lg border border-[#DFD4C8] bg-[#FAF6F2] hover:bg-[#FAF6F2] hover:border-[#C49B82] text-[#333333] hover:text-[#111111] text-xs font-semibold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                              title="Edit this review"
                              aria-label="Edit review"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#C49B82]" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                          )}

                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => setDeletingReview(rev)}
                              className="px-2.5 py-1 rounded-lg border border-[#DFD4C8] bg-[#FAF6F2] hover:border-red-300 hover:bg-red-50 text-[#555555] hover:text-red-700 text-xs font-semibold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                              title="Delete this review"
                              aria-label="Delete review"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-2">
                      <StarRatingDisplay rating={rev.rating} size="sm" />
                      <span className="text-[12px] font-semibold text-[#111111] font-mono">
                        {formatRating(rev.rating)}
                      </span>
                    </div>

                    {/* Review Content */}
                    <p className="text-sm text-[#222222] leading-relaxed italic">
                      "{rev.review}"
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Edit Review Modal */}
      <EditReviewModal
        isOpen={Boolean(editingReview)}
        review={editingReview}
        onClose={() => setEditingReview(null)}
        onSaveSuccess={handleSaveReviewSuccess}
      />

      {/* Delete Review Modal */}
      <DeleteReviewModal
        isOpen={Boolean(deletingReview)}
        review={deletingReview}
        onClose={() => setDeletingReview(null)}
        onDeleteSuccess={handleDeleteReviewSuccess}
      />
    </div>
  );
};
