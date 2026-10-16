import React, { useState, useEffect } from 'react';
import { Star, X, Loader2, AlertCircle } from 'lucide-react';
import type { ApiReview } from '../../types/api';
import { reviewService } from '../../services/reviewService';

interface EditReviewModalProps {
  isOpen: boolean;
  review: ApiReview | null;
  onClose: () => void;
  onSaveSuccess: (updatedReview: ApiReview) => void;
}

export const EditReviewModal: React.FC<EditReviewModalProps> = ({
  isOpen,
  review,
  onClose,
  onSaveSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Prepopulate form whenever target review changes or modal opens
  useEffect(() => {
    if (review && isOpen) {
      setRating(Math.min(5, Math.max(1, Math.round(review.rating || 5))));
      setHoverRating(0);
      setReviewText(review.review || '');
      setValidationError(null);
      setApiError(null);
      setIsSubmitting(false);
    }
  }, [review, isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !review) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setApiError(null);

    const trimmed = reviewText.trim();
    if (!trimmed) {
      setValidationError('Review text cannot be empty or only whitespace.');
      return;
    }

    if (rating < 1 || rating > 5) {
      setValidationError('Rating must be between 1 and 5 stars.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await reviewService.updateReview(review.id, {
        rating,
        review: trimmed,
      });

      onSaveSuccess(updated);
      onClose();
    } catch (err: any) {
      console.error('Failed to update review:', err);
      const msg = err.messages?.[0] || err.message || 'Failed to update review. Please try again.';
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-lg bg-[#FAF6F2] rounded-3xl border border-[#DFD4C8] shadow-2xl p-5 sm:p-8 space-y-6 relative max-h-[calc(100vh-2rem)] overflow-y-auto animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-review-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 p-2 rounded-full text-[#666666] hover:text-[#111111] hover:bg-[#EEE9E5] transition disabled:opacity-40"
          aria-label="Close edit dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <span className="text-[12px] font-bold text-[#C49B82] uppercase tracking-[0.08em] block mb-1">
            Manage Review
          </span>
          <h2 id="edit-review-title" className="text-[22px] sm:text-[24px] font-bold text-[#111111] tracking-tight">
            Edit Your Review
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Update your star rating or comments. Changes will be saved directly to the catalog.
          </p>
        </div>

        {/* Error Messages */}
        {validationError && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{validationError}</span>
          </div>
        )}

        {apiError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Rating Selector */}
          <div>
            <label className="block text-[12px] font-bold text-[#111111] uppercase tracking-[0.06em] mb-2">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  disabled={isSubmitting}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition group disabled:cursor-not-allowed"
                  aria-label={`Rate ${star} of 5 stars`}
                >
                  <Star
                    className={`w-7 h-7 transition ${
                      star <= (hoverRating || rating)
                        ? 'fill-[#C49B82] text-[#C49B82]'
                        : 'text-[#DFD4C8] hover:text-[#CCA893]'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs sm:text-sm font-semibold text-[#111111] ml-2">
                {hoverRating || rating} of 5 Stars
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="edit-review-textarea"
                className="block text-[12px] font-bold text-[#111111] uppercase tracking-[0.06em]"
              >
                Review Comments
              </label>
              <span className="text-[11px] text-[#777777]">
                {reviewText.length} characters
              </span>
            </div>
            <textarea
              id="edit-review-textarea"
              rows={5}
              disabled={isSubmitting}
              value={reviewText}
              onChange={(e) => {
                setReviewText(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Share what you liked, disliked, or any details about performance..."
              className="w-full rounded-2xl bg-[#FBF6F0] border border-[#DFD4C8] p-4 text-[14px] text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#C49B82] transition disabled:opacity-50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 px-5 rounded-lg border border-[#DFD4C8] bg-transparent text-[#555555] hover:text-[#111111] hover:bg-[#EEE9E5] font-bold text-[12px] tracking-[0.08em] uppercase transition disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !reviewText.trim()}
              className="h-11 px-7 rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[12px] tracking-[0.08em] uppercase transition active:scale-98 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
