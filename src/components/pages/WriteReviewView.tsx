import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Star, CheckCircle2, AlertCircle, LogIn, Loader2 } from 'lucide-react';
import type { PageId } from '../electro/ElectroHeader';
import type { ApiProduct } from '../../types/api';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, formatRating } from '../../utils/formatters';
import { BackButton } from '../common/BackButton';
import { StarRatingSelector } from '../common/StarRating';

interface WriteReviewViewProps {
  productId?: number;
  onNavigate: (page: PageId) => void;
}

export const WriteReviewView: FC<WriteReviewViewProps> = ({
  productId = 29, // Default to Sony WH-1000XM5
  onNavigate,
}) => {
  const { user, openAuthModal } = useAuth();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch real product details for the summary card
  useEffect(() => {
    productService.getProductById(productId)
      .then((data) => setProduct(data))
      .catch((err) => console.error('Failed to load review target product:', err));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    if (!user) {
      setErrorMessage('You must be signed in to submit a product review.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await reviewService.createProductReview(productId, {
        review: reviewText.trim(),
        rating,
      });

      setSubmitted(true);
      setTimeout(() => {
        onNavigate('product-details');
      }, 2000);
    } catch (err: any) {
      console.error('Failed to submit review to backend:', err);
      setErrorMessage(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FBF6F0] min-h-[calc(100vh-140px)] py-10 lg:py-16">
      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton label="Back to Product Details" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ========================================================= */}
          {/* LEFT: REAL PRODUCT CARD SUMMARY */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 max-w-sm w-full mx-auto lg:mx-0">
            <div className="bg-[#EEE9E5] rounded-3xl p-6 sm:p-7 space-y-4">
              {/* Product Image */}
              <div className="h-64 sm:h-72 rounded-2xl overflow-hidden flex items-center justify-center p-2 bg-[#FAF6F2]">
                <img
                  src={product?.image || '/assets/review-card.jpg'}
                  alt={product?.name || 'Product'}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/review-card.jpg';
                  }}
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>

              {/* Product Meta */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[12px] font-medium tracking-[0.08em] text-[#C49B82] uppercase block truncate">
                  {product ? product.name.split(' ')[0] : 'HEADPHONES'}
                </span>
                <h3 className="text-[15px] sm:text-[16px] font-bold text-[#111111] leading-snug line-clamp-2">
                  {product?.name || 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones'}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex text-[#C49B82]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.round(Number(product?.averageRating) || 5)
                            ? 'fill-[#C49B82] text-[#C49B82]'
                            : 'text-[#DFD4C8]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[13px] text-[#111111] font-medium">
                    {formatRating(product?.averageRating || '4.2')} ({product?.ratingsCount || 5} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="text-[20px] sm:text-[22px] font-bold text-[#C49B82] tracking-tight pt-1">
                  {formatPrice(product?.price || '18500.00')}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: REVIEW INPUT FORM */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 lg:border-l lg:border-[#EAE0D5] lg:pl-12 space-y-6">
            <div>
              <h1 className="text-[30px] sm:text-[36px] font-bold text-[#111111] leading-tight tracking-tight">
                Share your experience
              </h1>
              <p className="text-[15px] text-[#444444] mt-2">
                Your review helps others choose the right product and updates real catalog ratings.
              </p>
            </div>

            {/* If user is not logged in, prompt sign in */}
            {!user && (
              <div className="p-5 rounded-2xl bg-[#EEE9E5] border border-[#C49B82]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#C49B82] shrink-0">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#111111]">Sign in required to post reviews</h4>
                    <p className="text-xs text-[#555555]">
                      The backend API requires an authenticated user token to associate reviews.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="px-5 py-2 rounded-lg bg-[#CCA893] text-[#111111] font-bold text-xs uppercase tracking-wider shrink-0 hover:bg-[#C29D87] cursor-pointer"
                >
                  Sign In Now
                </button>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {submitted ? (
              <div className="p-8 rounded-2xl bg-[#EEE9E5] border border-[#C49B82]/40 text-[#111111] space-y-3">
                <div className="flex items-center gap-2.5 text-[#C49B82] font-bold text-base uppercase">
                  <CheckCircle2 className="w-6 h-6" />
                  Review Published Successfully!
                </div>
                <p className="text-sm text-[#444444]">
                  Thank you for contributing to Electro Hub reviews. Your feedback has been saved to the live backend. Redirecting to product page...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Overall Rating Stars */}
                <div>
                  <label className="block text-[13px] font-bold text-[#111111] uppercase tracking-[0.06em] mb-2.5">
                    OVERALL RATING
                  </label>
                  <StarRatingSelector
                    value={rating}
                    onChange={(val) => setRating(val)}
                    disabled={submitting}
                  />
                </div>

                {/* Review Text Area */}
                <div>
                  <label className="block text-[13px] font-bold text-[#111111] uppercase tracking-[0.06em] mb-2">
                    YOUR REVIEW
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="What did you like or dislike? How is the sound quality, comfort, and build?"
                    className="w-full rounded-2xl bg-[#FAF6F2] border border-[#DFD4C8] p-4 text-[14px] text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#C49B82] transition"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={submitting || !reviewText.trim()}
                    className="h-12 px-9 rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase transition active:scale-98 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {submitting ? 'SUBMITTING TO API...' : 'SUBMIT REVIEW'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('product-details')}
                    className="h-12 px-6 rounded-lg bg-transparent text-[#666666] hover:text-[#111111] font-bold text-[13px] tracking-[0.08em] uppercase transition"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
