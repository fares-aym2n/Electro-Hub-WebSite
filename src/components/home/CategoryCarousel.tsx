import type { FC } from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import type { ApiCategory } from "../../types/api";
import { categoryService } from "../../services/categoryService";

interface CategoryCarouselProps {
  onSelectCategory: (categorySlug: string) => void;
}

export const CategoryCarousel: FC<CategoryCarouselProps> = ({
  onSelectCategory,
}) => {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [categoryImages, setCategoryImages] = useState<Record<number, string>>(
    {},
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeftState, setScrollLeftState] = useState<number>(0);
  const [dragDistance, setDragDistance] = useState<number>(0);

  const carouselRef = useRef<HTMLDivElement>(null);

  // 1. Fetch categories and category card preview images
  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cats = await categoryService.getCategories();
      setCategories(cats);

      // Preload preview images
      const images = await categoryService.getCategoryCardImages(cats);
      setCategoryImages(images);
    } catch (err: any) {
      console.error("Failed to load categories:", err);
      setError(err.message || "Unable to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // 2. Auto-scrolling logic (relaxed ~3.8s interval, smooth scroll, pause on hover/interaction)
  useEffect(() => {
    // Respect prefers-reduced-motion accessibility setting
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (
      prefersReducedMotion ||
      isPaused ||
      loading ||
      categories.length === 0
    ) {
      return;
    }

    // 3.8 second interval between automatic movements per requirement (3.5 - 4.0s)
    const interval = setInterval(() => {
      const container = carouselRef.current;
      if (!container) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const scrollStep = container.clientWidth > 640 ? 220 : 160;

      // When reaching or near the end, loop smoothly back to start
      if (container.scrollLeft >= maxScrollLeft - 15) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollStep, behavior: "smooth" });
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isPaused, loading, categories.length]);

  // 3. Manual Navigation via Left and Right Arrows
  const handleScroll = (direction: "left" | "right") => {
    const container = carouselRef.current;
    if (!container) return;

    const scrollStep = container.clientWidth > 640 ? 300 : 200;
    container.scrollBy({
      left: direction === "left" ? -scrollStep : scrollStep,
      behavior: "smooth",
    });
  };

  // 4. Mouse Drag Support (click and drag)
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = carouselRef.current;
    if (!container) return;

    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeftState(container.scrollLeft);
    setDragDistance(0);
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = carouselRef.current;
    if (!container) return;

    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeftState - walk;
    setDragDistance(Math.abs(walk));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Brief timeout before unpausing so user feels in control
    setTimeout(() => setIsPaused(false), 800);
  };

  // 5. Handle Click on Category Item
  const handleItemClick = (slug: string) => {
    // If user dragged more than 6px, treat as drag rather than intentional click
    if (dragDistance > 6) return;
    onSelectCategory(slug);
  };

  return (
    <section
      id="categories-section"
      className="scroll-mt-24 space-y-6 pt-4"
      aria-label="Explore by Category"
    >
      {/* Header with Title */}
      <div>
        <h2 className="text-[24px] sm:text-[28px] font-bold text-[#111111] tracking-tight flex items-center gap-2.5">
          <Layers className="w-6 h-6 text-[#C49B82]" />
          Explore by Category
        </h2>
        <p className="text-[13px] text-[#555555] mt-1">
          Browse our specialized silicon, computing, and electronic hardware
          categories.
        </p>
      </div>

      {/* Carousel Body */}
      {loading ? (
        // Loading Skeleton
        <div className="flex items-center gap-4 overflow-hidden py-2">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-32 sm:w-36 shrink-0 flex flex-col items-center animate-pulse"
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-[#EEE9E5] border border-[#E5D7CA]" />
              <div className="h-3.5 bg-[#E5D7CA] rounded w-20 mt-2.5" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-[#EEE9E5] border border-red-200 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-xs text-[#555555]">{error}</p>
          <button
            type="button"
            onClick={loadCategories}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#CCA893] text-[#111111] text-xs font-bold uppercase tracking-wider"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Categories
          </button>
        </div>
      ) : (
        /* Horizontal Carousel with circular arrows vertically centered at far left and far right */
        <div className="relative flex items-center gap-2 sm:gap-4">
          {/* Left Arrow at far left */}
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#EEE9E5] hover:bg-[#E5D7CA] border border-[#DFD4C8] hover:border-[#C49B82] text-[#111111] flex items-center justify-center transition active:scale-95 shadow-sm hover:shadow-md cursor-pointer z-10"
            aria-label="Previous categories"
            title="Previous categories"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Horizontal Scroll Track */}
          <div
            ref={carouselRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              if (!isDragging) setIsPaused(false);
              setIsDragging(false);
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setTimeout(() => setIsPaused(false), 800)}
            className="flex-1 flex items-start gap-4 sm:gap-6 overflow-x-auto py-2 scroll-smooth select-none cursor-grab active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((cat) => {
              const cardImg =
                categoryImages[cat.id] ||
                categoryImages[Number(cat.id)] ||
                "/assets/review-card.jpg";

              return (
                <div
                  key={cat.id}
                  onClick={() =>
                    handleItemClick(cat.slug || cat.name.toLowerCase())
                  }
                  className="w-28 sm:w-36 shrink-0 flex flex-col items-center text-center group cursor-pointer"
                  title={`Browse ${cat.name}`}
                >
                  {/* Rounded rectangular container with subtle warm border */}
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-[#FAF6F2] border-2 border-[#E5D7CA] group-hover:border-[#C49B82] group-hover:shadow-md transition-all duration-300 p-3 flex items-center justify-center relative overflow-hidden group-hover:-translate-y-1">
                    <img
                      src={cardImg}
                      alt={cat.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/assets/review-card.jpg";
                      }}
                      className="w-full h-full object-contain group-hover:scale-108 transition duration-300 drop-shadow-2xs pointer-events-none"
                    />
                  </div>

                  {/* Category Name directly below image */}
                  <span className="mt-2.5 text-xs sm:text-[13px] font-bold text-[#111111] group-hover:text-[#C49B82] transition line-clamp-2 max-w-[140px] leading-tight">
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Arrow at far right */}
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#EEE9E5] hover:bg-[#E5D7CA] border border-[#DFD4C8] hover:border-[#C49B82] text-[#111111] flex items-center justify-center transition active:scale-95 shadow-sm hover:shadow-md cursor-pointer z-10"
            aria-label="Next categories"
            title="Next categories"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}
    </section>
  );
};
