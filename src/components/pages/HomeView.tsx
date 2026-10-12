import type { FC } from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Star,
  ArrowRight,
  Search,
  AlertCircle,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import type { PageId } from "../electro/ElectroHeader";
import type { ApiProduct, ApiCategory } from "../../types/api";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { useNavigation } from "../../context/NavigationContext";
import { formatPrice, formatRating } from "../../utils/formatters";

interface HomeViewProps {
  onNavigate: (page: PageId) => void;
  onSelectProduct: (productId: number) => void;
  onAddToCart: (product: ApiProduct) => void;
}

const ITEMS_PER_PAGE = 10;

export const HomeView: FC<HomeViewProps> = ({
  onNavigate,
  onSelectProduct,
  onAddToCart,
}) => {
  const { activeCategory, setActiveCategory, scrollToSection } =
    useNavigation();

  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [categoryImages, setCategoryImages] = useState<Record<number, string>>(
    {},
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [appliedMinPrice, setAppliedMinPrice] = useState<string>("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Categories and all Catalog Products on Mount
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Parallel load of categories and all catalog products
      const [cats, prods] = await Promise.all([
        categoryService.getCategories(),
        productService.getAllProducts(),
      ]);

      setCategories(cats);
      setAllProducts(prods);

      // Cache category preview images
      categoryService.getCategoryCardImages(cats).then((images) => {
        setCategoryImages(images);
      });
    } catch (err: any) {
      console.error("Failed to load initial catalog data:", err);
      setError(
        err.message ||
          "Unable to connect to product catalog. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset to page 1 whenever category or search filter changes
  const handleCategoryChange = (catName: string) => {
    setActiveCategory(catName);
    setCurrentPage(1);
    scrollToSection("products-section");
  };

  const handleApplyPriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setAppliedMinPrice("");
    setAppliedMaxPrice("");
    setSearchQuery("");
    setActiveCategory("ALL");
    setCurrentPage(1);
  };

  // Flagship spotlight product (prefer Sony WH-1000XM5 id 29 or first featured product)
  const featuredProduct = useMemo(() => {
    if (!allProducts.length) return null;
    const sony = allProducts.find((p) => p.id === 29);
    if (sony) return sony;
    const featured = allProducts.find((p) => p.isFeatured);
    return featured || allProducts[0];
  }, [allProducts]);

  // 2. Filter products based on active category, search query, and applied price range
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category filter
      if (activeCategory !== "ALL") {
        const catObj = categories.find(
          (c) => c.name.toLowerCase() === activeCategory.toLowerCase(),
        );
        const slug = catObj?.slug || activeCategory;
        const matchesCategory = categoryService.isProductInCategory(
          product.name,
          product.description,
          slug,
        );
        if (!matchesCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Price filter
      const priceNum = parseFloat(product.price);
      if (appliedMinPrice && !isNaN(Number(appliedMinPrice))) {
        if (priceNum < Number(appliedMinPrice)) return false;
      }
      if (appliedMaxPrice && !isNaN(Number(appliedMaxPrice))) {
        if (priceNum > Number(appliedMaxPrice)) return false;
      }

      return true;
    });
  }, [
    allProducts,
    activeCategory,
    searchQuery,
    appliedMinPrice,
    appliedMaxPrice,
    categories,
  ]);

  // 3. Exact Category Pagination Calculations
  // Strictly render only existing page numbers (e.g. 10 products = 1 page, 16 products = 2 pages)
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
  );

  // Safeguard: clamp currentPage if filters reduced total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Sliced products for the current page
  const displayedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleProductClick = (id: number) => {
    onSelectProduct(id);
    onNavigate("product-details");
  };

  return (
    <div className="bg-[#FBF6F0] min-h-[calc(100vh-140px)] py-8 lg:py-12">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 space-y-12 lg:space-y-16">
        {/* ========================================================= */}
        {/* 1. HERO SHOWCASE BANNER (FLAGSHIP SPOTLIGHT)              */}
        {/* ========================================================= */}
        {featuredProduct && (
          <div className="rounded-3xl bg-[#EEE9E5] p-8 sm:p-12 lg:p-16 border border-[#E5D7CA] overflow-hidden shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                <span className="text-[13px] font-medium tracking-[0.08em] text-[#C49B82] uppercase block">
                  FLAGSHIP SPOTLIGHT
                </span>
                <h1 className="text-[32px] sm:text-[42px] lg:text-[48px] font-bold text-[#111111] leading-[1.12] tracking-tight">
                  {featuredProduct.name}
                </h1>
                <p className="text-[15px] sm:text-[16px] text-[#444444] leading-relaxed max-w-xl line-clamp-3">
                  {featuredProduct.description}
                </p>

                <div className="text-[26px] sm:text-[30px] font-bold text-[#C49B82] pt-1">
                  {formatPrice(featuredProduct.price)}
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => handleProductClick(featuredProduct.id)}
                    className="h-12 px-8 rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase flex items-center gap-2 transition active:scale-98 shadow-xs"
                  >
                    VIEW PRODUCT
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onAddToCart(featuredProduct)}
                    className="h-12 px-8 rounded-lg bg-transparent hover:bg-[#E5D7CA] border border-[#C49B82] text-[#111111] font-bold text-[13px] tracking-[0.08em] uppercase transition"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>

              {/* Right Hero Image */}
              <div className="lg:col-span-5 flex justify-center">
                <div
                  onClick={() => handleProductClick(featuredProduct.id)}
                  className="w-full max-w-md h-72 sm:h-96 rounded-2xl flex items-center justify-center p-4 cursor-pointer group"
                >
                  <img
                    src={featuredProduct.image || "/assets/sony-main.jpg"}
                    alt={featuredProduct.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/sony-main.jpg";
                    }}
                    className="w-full h-full object-contain group-hover:scale-105 transition duration-500 drop-shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 1. EXPLORE CATEGORIES (NOW POSITIONED ABOVE PRODUCTS)     */}
        {/* ========================================================= */}
        <section
          id="categories-section"
          className="scroll-mt-24 space-y-6 pt-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[24px] sm:text-[28px] font-bold text-[#111111] tracking-tight flex items-center gap-2.5">
                <Layers className="w-6 h-6 text-[#C49B82]" />
                Explore by Category
              </h2>
              <p className="text-[13px] text-[#555555] mt-1">
                Browse our complete catalog across all 10 specialized
                electronics categories.
              </p>
            </div>
            {activeCategory !== "ALL" && (
              <button
                onClick={() => handleCategoryChange("ALL")}
                className="text-xs font-bold text-[#C49B82] uppercase tracking-wider hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Clear Category Filter
              </button>
            )}
          </div>

          {/* 10 Category Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const cardImg =
                categoryImages[cat.id] || "/assets/review-card.jpg";
              const isSelected =
                activeCategory.toLowerCase() === cat.name.toLowerCase();

              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`p-4 rounded-2xl bg-[#EEE9E5] border transition-all duration-300 cursor-pointer flex flex-col items-center justify-between text-center group ${
                    isSelected
                      ? "border-[#C49B82] ring-2 ring-[#C49B82]/60 shadow-md bg-[#EDE8E4]"
                      : "border-[#E5D7CA] hover:border-[#C49B82] hover:shadow-xs"
                  }`}
                >
                  {/* Category Image (First Available Product Image) */}
                  <div className="w-full h-28 rounded-xl bg-[#FAF6F2] p-2 flex items-center justify-center overflow-hidden mb-3">
                    <img
                      src={cardImg}
                      alt={cat.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/assets/review-card.jpg";
                      }}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Category Name */}
                  <div className="w-full">
                    <h3 className="text-xs sm:text-sm font-bold text-[#111111] leading-tight group-hover:text-[#C49B82] transition truncate">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] text-[#777777] mt-0.5 block">
                      {isSelected ? "Active Filter" : "View Collection"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. FEATURED ELECTRONICS (PRODUCTS CATALOG SECTION)        */}
        {/* ========================================================= */}
        <section id="products-section" className="scroll-mt-24 space-y-8">
          {/* Search & Price Filter Bar */}
          <div
            id="search-filter-bar"
            className="bg-[#EEE9E5] border border-[#E5D7CA] rounded-2xl p-5 sm:p-6 space-y-4"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search Input */}
              <div className="relative w-full md:max-w-md">
                <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search products by title or keyword..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#FAF6F2] border border-[#DFD4C8] text-sm text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#C49B82] transition"
                />
              </div>

              {/* Price Filter Form */}
              <form
                onSubmit={handleApplyPriceFilter}
                className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end"
              >
                <span className="text-xs font-bold text-[#666666] uppercase tracking-wider">
                  Price (EGP):
                </span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-24 h-10 px-3 rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] text-xs text-[#111111] focus:outline-none focus:border-[#C49B82]"
                />
                <span className="text-[#888888]">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-24 h-10 px-3 rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] text-xs text-[#111111] focus:outline-none focus:border-[#C49B82]"
                />
                <button
                  type="submit"
                  className="h-10 px-4 rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#111111] font-bold text-xs uppercase tracking-wider transition"
                >
                  Apply
                </button>
                {(appliedMinPrice ||
                  appliedMaxPrice ||
                  minPrice ||
                  maxPrice ||
                  searchQuery ||
                  activeCategory !== "ALL") && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="h-10 px-3 rounded-lg bg-transparent border border-[#DFD4C8] text-[#666666] hover:text-[#111111] text-xs font-semibold uppercase transition"
                  >
                    Clear All
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Catalog Header & Category Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE0D5] pb-4">
            <div>
              <h2 className="text-[24px] sm:text-[28px] font-bold text-[#111111] tracking-tight">
                {activeCategory === "ALL"
                  ? "Featured Electronics"
                  : activeCategory}
              </h2>
            </div>

            {/* Category Pills Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 max-w-full">
              <button
                onClick={() => handleCategoryChange("ALL")}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-[12px] font-semibold tracking-wider uppercase transition ${
                  activeCategory === "ALL"
                    ? "bg-[#CCA893] text-[#1A1A1A]"
                    : "bg-[#EEE9E5] text-[#555555] hover:text-[#111111] hover:bg-[#E5D7CA]"
                }`}
              >
                ALL
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-[12px] font-semibold tracking-wider uppercase transition ${
                    activeCategory.toLowerCase() === cat.name.toLowerCase()
                      ? "bg-[#CCA893] text-[#1A1A1A]"
                      : "bg-[#EEE9E5] text-[#555555] hover:text-[#111111] hover:bg-[#E5D7CA]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid / Loading Skeleton / Empty State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#EEE9E5] rounded-3xl p-6 sm:p-7 flex flex-col justify-between animate-pulse h-[430px]"
                >
                  <div className="h-56 bg-[#DFD4C8]/50 rounded-2xl w-full" />
                  <div className="space-y-3 pt-4">
                    <div className="h-3 bg-[#DFD4C8]/60 rounded w-1/4" />
                    <div className="h-5 bg-[#DFD4C8]/60 rounded w-3/4" />
                    <div className="h-4 bg-[#DFD4C8]/40 rounded w-1/2" />
                    <div className="h-8 bg-[#DFD4C8]/60 rounded w-full pt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 rounded-3xl bg-[#EEE9E5] border border-red-300 text-center space-y-4 max-w-lg mx-auto">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
              <h3 className="text-lg font-bold text-[#111111]">
                Could not load products
              </h3>
              <p className="text-sm text-[#555555]">{error}</p>
              <button
                onClick={loadData}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#CCA893] text-[#111111] font-bold text-xs uppercase"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#EEE9E5] border border-[#E5D7CA] space-y-3">
              <p className="text-[#555555] font-medium text-base">
                No products match the selected category or filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 rounded-lg bg-[#CCA893] text-[#111111] text-xs font-bold uppercase tracking-wider"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#EEE9E5] rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition duration-300 group border border-transparent hover:border-[#E5D7CA]"
                >
                  {/* Image Showcase */}
                  <div
                    onClick={() => handleProductClick(product.id)}
                    className="h-56 sm:h-64 rounded-2xl overflow-hidden flex items-center justify-center p-4 cursor-pointer relative bg-[#FAF6F2]"
                  >
                    <img
                      src={product.image || "/assets/sony-main.jpg"}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/assets/sony-main.jpg";
                      }}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
                    />
                    {product.stockQuantity <= 0 && (
                      <span className="absolute top-2 right-2 px-2.5 py-1 rounded bg-[#111111]/80 text-[#FAF6F0] text-[10px] font-bold uppercase tracking-wider">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="space-y-2 pt-4">
                    <span className="text-[12px] font-medium tracking-[0.08em] text-[#C49B82] uppercase block truncate">
                      {product.name.split(" ")[0] || "ELECTRONICS"}
                    </span>

                    <h3
                      onClick={() => handleProductClick(product.id)}
                      className="text-[15px] sm:text-[16px] font-bold text-[#111111] leading-snug line-clamp-2 cursor-pointer hover:text-[#C49B82] transition"
                    >
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex text-[#C49B82]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i <
                              Math.round(Number(product.averageRating) || 0)
                                ? "fill-[#C49B82] text-[#C49B82]"
                                : "text-[#DFD4C8]"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[13px] text-[#111111] font-medium">
                        {formatRating(product.averageRating)} (
                        {product.ratingsCount} reviews)
                      </span>
                    </div>

                    {/* Price & Action Button */}
                    <div className="pt-2 flex items-center justify-between gap-3">
                      <span className="text-[20px] font-bold text-[#C49B82] tracking-tight">
                        {formatPrice(product.price)}
                      </span>

                      <button
                        onClick={() => onAddToCart(product)}
                        disabled={product.stockQuantity <= 0}
                        className={`h-10 px-5 rounded-lg font-bold text-[12px] tracking-[0.08em] uppercase transition active:scale-95 shadow-xs ${
                          product.stockQuantity <= 0
                            ? "bg-[#DFD4C8] text-[#888888] cursor-not-allowed"
                            : "bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A]"
                        }`}
                      >
                        {product.stockQuantity <= 0
                          ? "SOLD OUT"
                          : "ADD TO CART"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ========================================================= */}
          {/* EXACT PAGINATION CONTROLS (10 PRODUCTS/PAGE)              */}
          {/* Strictly renders only existing page numbers without empty pages */}
          {/* ========================================================= */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#EAE0D5]">
            <div className="text-xs text-[#666666]">
              Showing page <strong>{currentPage}</strong> of{" "}
              <strong>{totalPages}</strong> • 10 items per page
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  scrollToSection("products-section");
                }}
                disabled={currentPage <= 1 || loading}
                className="h-10 px-4 rounded-xl bg-[#EEE9E5] border border-[#DFD4C8] text-xs font-bold text-[#111111] disabled:opacity-40 uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#E5D7CA] transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {/* Number buttons strictly for available pages (e.g. 1 page for laptops, 2 for smartphones, 7 for ALL) */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        scrollToSection("products-section");
                      }}
                      disabled={loading}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition ${
                        currentPage === pageNum
                          ? "bg-[#CCA893] text-[#111111] shadow-xs"
                          : "bg-[#EEE9E5] text-[#555555] hover:bg-[#E5D7CA] hover:text-[#111111]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  scrollToSection("products-section");
                }}
                disabled={currentPage >= totalPages || loading}
                className="h-10 px-4 rounded-xl bg-[#EEE9E5] border border-[#DFD4C8] text-xs font-bold text-[#111111] disabled:opacity-40 uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#E5D7CA] transition"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
