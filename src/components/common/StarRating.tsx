import type { FC } from "react";
import { useState } from "react";
import { Star } from "lucide-react";

export const ALLOWED_HALF_RATINGS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

interface StarRatingDisplayProps {
  rating: number | string | undefined | null;
  maxStars?: number;
  size?: "xs" | "sm" | "md" | "lg";
  showNumber?: boolean;
  className?: string;
}

/**
 * Clean star rating display supporting whole and half stars.
 */
export const StarRatingDisplay: FC<StarRatingDisplayProps> = ({
  rating,
  maxStars = 5,
  size = "sm",
  showNumber = false,
  className = "",
}) => {
  const numericRating = Math.max(0, Math.min(maxStars, Number(rating) || 0));

  const sizeMap = {
    xs: { box: "w-3 h-3", star: "w-3 h-3" },
    sm: { box: "w-3.5 h-3.5", star: "w-3.5 h-3.5" },
    md: { box: "w-4 h-4", star: "w-4 h-4" },
    lg: { box: "w-5 h-5", star: "w-5 h-5" },
  };

  const { box, star } = sizeMap[size] || sizeMap.sm;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center text-[#C49B82]">
        {[...Array(maxStars)].map((_, index) => {
          const starVal = index + 1;
          const isFull = numericRating >= starVal;
          const isHalf = !isFull && numericRating >= starVal - 0.5;

          return (
            <div key={index} className={`relative ${box} shrink-0`}>
              {/* Background empty star */}
              <Star className={`${star} text-[#DFD4C8]`} />
              {/* Foreground filled or clipped half star */}
              {isFull ? (
                <div className="absolute inset-0 pointer-events-none">
                  <Star className={`${star} fill-[#C49B82] text-[#C49B82]`} />
                </div>
              ) : isHalf ? (
                <div className="absolute inset-0 w-1/2 overflow-hidden pointer-events-none">
                  <div className={box}>
                    <Star className={`${star} fill-[#C49B82] text-[#C49B82]`} />
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      {showNumber && (
        <span className="font-semibold text-xs text-[#111111] font-mono">
          {numericRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

interface StarRatingSelectorProps {
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Interactive star rating selector supporting 1.0 to 5.0 in 0.5 increments.
 * Works seamlessly on desktop (hover & half-click) and mobile (half-tap & quick pills).
 */
export const StarRatingSelector: FC<StarRatingSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className = "",
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = hoverRating !== null ? hoverRating : value;

  const handleSelect = (r: number) => {
    if (disabled) return;
    const clamped = Math.min(5, Math.max(1, r));
    onChange(clamped);
  };

  const handleHover = (r: number) => {
    if (disabled) return;
    const clamped = Math.min(5, Math.max(1, r));
    setHoverRating(clamped);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Stars + Label */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex items-center gap-1 select-none"
          onMouseLeave={() => setHoverRating(null)}
        >
          {[1, 2, 3, 4, 5].map((starIndex) => {
            const leftVal = Math.max(1, starIndex - 0.5);
            const rightVal = starIndex;

            const isFull = activeRating >= starIndex;
            const isHalf = !isFull && activeRating >= starIndex - 0.5;

            return (
              <div
                key={starIndex}
                className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center"
              >
                {/* Left Half Hit Zone (e.g. 1.5, 2.5, 3.5, 4.5) */}
                <button
                  type="button"
                  disabled={disabled}
                  aria-label={`${leftVal} Stars`}
                  onClick={() => handleSelect(leftVal)}
                  onMouseEnter={() => handleHover(leftVal)}
                  className="absolute left-0 top-0 w-1/2 h-full z-10 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />

                {/* Right Half Hit Zone (e.g. 1, 2, 3, 4, 5) */}
                <button
                  type="button"
                  disabled={disabled}
                  aria-label={`${rightVal} Stars`}
                  onClick={() => handleSelect(rightVal)}
                  onMouseEnter={() => handleHover(rightVal)}
                  className="absolute right-0 top-0 w-1/2 h-full z-10 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />

                {/* Base Empty Star */}
                <Star className="w-full h-full text-[#DFD4C8] pointer-events-none transition-colors" />

                {/* Full or Half Star Overlay */}
                {isFull ? (
                  <div className="absolute inset-0 pointer-events-none">
                    <Star className="w-full h-full fill-[#C49B82] text-[#C49B82] transition-colors" />
                  </div>
                ) : isHalf ? (
                  <div className="absolute inset-0 w-1/2 overflow-hidden pointer-events-none">
                    <div className="w-8 h-8 sm:w-9 sm:h-9">
                      <Star className="w-full h-full fill-[#C49B82] text-[#C49B82] transition-colors" />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
