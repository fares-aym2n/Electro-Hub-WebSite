import React, { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, X, Loader2, Star, AlertCircle } from 'lucide-react';
import type { ApiReview } from '../../types/api';
import { reviewService } from '../../services/reviewService';

interface DeleteReviewModalProps {
  isOpen: boolean;
  review: ApiReview | null;
  onClose: () => void;
  onDeleteSuccess: (deletedReviewId: number) => void;
}

export const DeleteReviewModal: React.FC<DeleteReviewModalProps> = ({
  isOpen,
  review,
  onClose,
  onDeleteSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsDeleting(false);
      setApiError(null);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !review) return null;

  const handleConfirmDelete = async () => {
    setApiError(null);
    setIsDeleting(true);

    try {
      await reviewService.deleteReview(review.id);
      onDeleteSuccess(review.id);
      onClose();
    } catch (err: any) {
      console.error('Failed to delete review:', err);
      const msg = err.messages?.[0] || err.message || 'Failed to delete review. Please try again.';
      setApiError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-md bg-[#FAF6F2] rounded-3xl border border-[#DFD4C8] shadow-2xl p-6 sm:p-7 space-y-5 relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-review-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-5 right-5 p-2 rounded-full text-[#666666] hover:text-[#111111] hover:bg-[#EEE9E5] transition disabled:opacity-40"
          aria-label="Close delete dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100/80 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 id="delete-review-title" className="text-[20px] font-bold text-[#111111] tracking-tight">
              Delete Review?
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-1 leading-relaxed">
              Are you sure you want to permanently delete this review? This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Review Snippet Card */}
        <div className="p-4 rounded-2xl bg-[#EEE9E5] border border-[#DFD4C8] space-y-2">
          <div className="flex items-center gap-1.5 text-[#C49B82]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.round(review.rating || 0)
                    ? 'fill-[#C49B82] text-[#C49B82]'
                    : 'text-[#DFD4C8]'
                }`}
              />
            ))}
            <span className="text-xs font-semibold text-[#111111] ml-1">
              {review.rating} / 5
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#333333] italic line-clamp-3 leading-relaxed">
            "{review.review}"
          </p>
        </div>

        {/* API Error Alert */}
        {apiError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="h-11 px-5 rounded-lg border border-[#DFD4C8] bg-transparent text-[#555555] hover:text-[#111111] hover:bg-[#EEE9E5] font-bold text-[12px] tracking-[0.08em] uppercase transition disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="h-11 px-6 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[12px] tracking-[0.08em] uppercase transition active:scale-98 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {isDeleting ? 'Deleting...' : 'Delete Review'}
          </button>
        </div>
      </div>
    </div>
  );
};
