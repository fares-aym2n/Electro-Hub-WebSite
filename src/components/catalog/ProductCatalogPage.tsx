import type { FC } from 'react';
import { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Star,
  ShoppingCart,
  ChevronRight,
  RotateCcw,
  LayoutGrid,
  List,
  Filter,
  X,
  Heart,
  Zap,
} from 'lucide-react';
import type { Product, ActivePageView } from '../../types';
import { CATEGORIES, BRANDS, PRODUCTS } from '../../data/products';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface ProductCatalogPageProps {
  initialCategory?: string;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistMap: Record<string, boolean>;
  onNavigate: (view: ActivePageView, category?: string) => void;
}

export const ProductCatalogPage: FC<ProductCatalogPageProps> = ({
  initialCategory = 'All Products',
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistMap,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2500);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Toggle brand selection
  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory('All Products');
    setSearchQuery('');
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(2500);
    setOnlyInStock(false);
    setMinRating(0);
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'All Products' ||
    searchQuery.trim() !== '' ||
    selectedBrands.length > 0 ||
    minPrice > 0 ||
    maxPrice < 2500 ||
    onlyInStock ||
    minRating > 0;

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category
      if (selectedCategory !== 'All Products' && product.category !== selectedCategory) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        const matchesSpecs = product.specs.some((s) =>
          s.value.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesBrand && !matchesCat && !matchesSpecs) return false;
      }
      // Brand
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }
      // Price
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }
      // Stock
      if (onlyInStock && !product.inStock) {
        return false;
      }
      // Rating
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, selectedBrands, minPrice, maxPrice, onlyInStock, minRating, sortBy]);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-['Plus_Jakarta_Sans'] pb-20">
      {/* Breadcrumb Header */}
      <div className="border-b border-slate-800 bg-[#090d16] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span
              onClick={() => onNavigate('home')}
              className="hover:text-cyan-400 cursor-pointer"
            >
              HOME
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-cyan-400 font-bold">HARDWARE INVENTORY</span>
            {selectedCategory !== 'All Products' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-white">{selectedCategory}</span>
              </>
            )}
          </div>

          <div className="text-xs font-mono text-slate-400 hidden sm:block">
            ACTIVE SILICON NODES: <span className="text-cyan-400 font-bold">{filteredProducts.length}</span> / {PRODUCTS.length}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ========================================================= */}
          {/* DESKTOP SIDEBAR FILTERS */}
          {/* ========================================================= */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-[#0e1424] p-5 rounded-2xl border border-slate-800 space-y-6 sticky top-28">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="font-['Space_Grotesk'] text-base font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                  FILTER HARDWARE
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3 h-3" /> RESET
                  </button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-['Space_Grotesk'] font-bold text-white uppercase tracking-wider mb-2.5">
                  Category Nodes
                </h4>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center justify-between ${
                        selectedCategory === cat
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      {selectedCategory === cat && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-['Space_Grotesk'] font-bold text-white uppercase tracking-wider">
                    Price Range
                  </h4>
                  <span className="text-xs font-mono text-cyan-400 font-semibold">
                    ${minPrice} - ${maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>$0</span>
                  <span>$1,000</span>
                  <span>$2,500</span>
                </div>
              </div>

              {/* In Stock Only */}
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2.5 text-xs font-mono text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-800/40 transition">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="w-4 h-4 rounded accent-cyan-400"
                  />
                  <span>IN STOCK INVENTORY ONLY</span>
                </label>
              </div>

              {/* Brands */}
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-xs font-['Space_Grotesk'] font-bold text-white uppercase tracking-wider mb-2.5">
                  Component Manufacturers
                </h4>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {BRANDS.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center justify-between text-xs font-mono text-slate-400 hover:text-white cursor-pointer px-2 py-1 rounded hover:bg-slate-800/40 transition"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleToggleBrand(brand)}
                          className="rounded accent-cyan-400"
                        />
                        <span>{brand}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-xs font-['Space_Grotesk'] font-bold text-white uppercase tracking-wider mb-2">
                  Customer Benchmarks
                </h4>
                <div className="space-y-1">
                  {[4, 4.5, 4.8].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                      className={`w-full text-left px-2.5 py-1 rounded text-xs font-mono flex items-center gap-2 transition ${
                        minRating === rating
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rating} Stars & Higher</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ========================================================= */}
          {/* MAIN PRODUCT LIST & CONTROLS */}
          {/* ========================================================= */}
          <main className="lg:col-span-3 space-y-6">
            {/* Top Toolbar */}
            <div className="bg-[#0e1424] p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              {/* Search in Catalog */}
              <div className="flex-1 min-w-[200px] max-w-md">
                <input
                  type="text"
                  placeholder="Filter silicon specs (e.g. 24GB, DDR5, AM5, OLED)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#141b2e] border border-slate-700/80 rounded-lg px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden px-3 py-2 rounded-lg bg-[#141b2e] border border-slate-700 text-xs font-mono text-cyan-400 flex items-center gap-1.5"
                >
                  <Filter className="w-3.5 h-3.5" />
                  FILTERS
                </button>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#141b2e] border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="featured">ORDER: FEATURED SILICON</option>
                  <option value="price-asc">PRICE: LOWEST FIRST</option>
                  <option value="price-desc">PRICE: HIGHEST FIRST</option>
                  <option value="rating">HIGHEST BENCHMARK / RATING</option>
                </select>

                {/* Grid / List View Toggle */}
                <div className="hidden sm:flex items-center bg-[#141b2e] rounded-lg p-0.5 border border-slate-700/80">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${
                      viewMode === 'grid'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${
                      viewMode === 'list'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Bar */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-mono text-slate-500">ACTIVE FILTERS:</span>
                {selectedCategory !== 'All Products' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                    Category: {selectedCategory}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-white"
                      onClick={() => setSelectedCategory('All Products')}
                    />
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                    Query: "{searchQuery}"
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-white"
                      onClick={() => setSearchQuery('')}
                    />
                  </span>
                )}
                {selectedBrands.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-xs font-mono"
                  >
                    {b}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-white"
                      onClick={() => handleToggleBrand(b)}
                    />
                  </span>
                ))}

                {onlyInStock && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                    In Stock Only
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-white"
                      onClick={() => setOnlyInStock(false)}
                    />
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-mono text-rose-400 hover:text-rose-300 underline ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product Grid / List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-[#0e1424] rounded-2xl border border-slate-800">
                <Zap className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-2">
                  NO HARDWARE UNITS MATCHED
                </h3>
                <p className="text-slate-400 text-xs font-mono max-w-sm mx-auto mb-5">
                  Try broadening your price range, clearing brand checkboxes, or scanning other categories.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-lg bg-cyan-500 text-black font-bold font-mono text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  RESET INVENTORY FILTERS
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const isWishlisted = !!wishlistMap[product.id];
                  return (
                    <div
                      key={product.id}
                      className="group relative bg-[#0d1322] hover:bg-[#11182c] border border-slate-800 hover:border-cyan-500/50 rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-1"
                    >
                      {/* Top Bar */}
                      <div className="p-4 pb-0 flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-slate-400 tracking-wider uppercase">
                          {product.brand}
                        </span>
                        <div className="flex items-center gap-2">
                          {product.badge && (
                            <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                              {product.badge}
                            </span>
                          )}
                          <button
                            onClick={() => onToggleWishlist(product)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Image */}
                      <div className="p-4">
                        <div
                          onClick={() => onSelectProduct(product)}
                          className="h-48 rounded-lg overflow-hidden bg-[#070b14] border border-slate-800 relative cursor-pointer group-hover:border-cyan-500/30 transition"
                        >
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            category={product.category}
                            className="w-full h-full group-hover:scale-105 transition duration-500"
                          />
                          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-black/75 backdrop-blur text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            {product.stockCount} IN STOCK
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="px-4 pb-3 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Rating */}
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-mono font-bold text-slate-200">
                              {product.rating}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              ({product.reviewsCount})
                            </span>
                          </div>

                          <h3
                            onClick={() => onSelectProduct(product)}
                            className="font-['Space_Grotesk'] text-sm font-bold text-white hover:text-cyan-400 transition line-clamp-2 cursor-pointer mb-2.5 leading-snug"
                          >
                            {product.name}
                          </h3>

                          {/* Key Specs */}
                          <div className="grid grid-cols-2 gap-1.5 mb-3 bg-[#080d18] p-2 rounded border border-slate-800/60">
                            {product.specs.slice(0, 2).map((spec, i) => (
                              <div key={i} className="text-[10px] font-mono">
                                <span className="text-slate-500 block truncate">{spec.label}</span>
                                <span className="text-cyan-300 font-semibold truncate block">
                                  {spec.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Price & Add */}
                        <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                          <div>
                            {product.originalPrice && (
                              <div className="text-[11px] font-mono text-slate-500 line-through">
                                ${product.originalPrice}
                              </div>
                            )}
                            <div className="text-lg font-bold font-['Space_Grotesk'] text-white">
                              ${product.price}
                            </div>
                          </div>

                          <button
                            onClick={() => onAddToCart(product)}
                            className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-['Space_Grotesk'] font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] transition active:scale-95"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            ADD
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectProduct(product)}
                        className="w-full py-1.5 bg-[#0a0f1d] hover:bg-cyan-950/40 text-[10px] font-mono text-slate-400 hover:text-cyan-300 border-t border-slate-800 transition flex items-center justify-center gap-1"
                      >
                        VIEW FULL DOSSIER <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="space-y-4">
                {filteredProducts.map((product) => {
                  const isWishlisted = !!wishlistMap[product.id];
                  return (
                    <div
                      key={product.id}
                      className="bg-[#0e1424] hover:bg-[#12192c] border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 transition flex flex-col md:flex-row gap-5 items-center justify-between"
                    >
                      <div
                        onClick={() => onSelectProduct(product)}
                        className="w-full md:w-44 h-36 rounded-lg overflow-hidden bg-[#070b14] border border-slate-800 shrink-0 cursor-pointer relative"
                      >
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          category={product.category}
                          className="w-full h-full object-cover"
                        />
                        {product.badge && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-cyan-300 text-[10px] font-mono font-bold">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-slate-400 uppercase">
                            {product.brand} • {product.category}
                          </span>
                          <span className="text-emerald-400 text-xs font-mono font-bold">
                            • {product.stockCount} in stock
                          </span>
                        </div>

                        <h3
                          onClick={() => onSelectProduct(product)}
                          className="text-base font-bold font-['Space_Grotesk'] text-white hover:text-cyan-400 cursor-pointer"
                        >
                          {product.name}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {product.specs.slice(0, 4).map((spec, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-cyan-300 border border-slate-800"
                            >
                              {spec.label}: {spec.value}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center justify-between md:justify-center gap-4 shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                        <div className="text-left md:text-right">
                          {product.originalPrice && (
                            <span className="text-xs font-mono text-slate-500 line-through block">
                              ${product.originalPrice}
                            </span>
                          )}
                          <span className="text-xl font-bold font-['Space_Grotesk'] text-white">
                            ${product.price}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onToggleWishlist(product)}
                            className="p-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => onAddToCart(product)}
                            className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-['Space_Grotesk'] text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            ADD TO RIG
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-[#0e1424] p-6 text-slate-100 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <span className="font-['Space_Grotesk'] text-lg font-bold text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                    FILTERS
                  </span>
                  <button onClick={() => setMobileFilterOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase mb-2">
                    Category
                  </h4>
                  <div className="space-y-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setMobileFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-xs font-mono ${
                          selectedCategory === cat
                            ? 'bg-cyan-500 text-black font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* In Stock */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="accent-cyan-400"
                    />
                    IN STOCK ONLY
                  </label>
                </div>
              </div>

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-lg bg-cyan-500 text-black font-bold font-mono text-xs"
              >
                APPLY FILTERS ({filteredProducts.length} FOUND)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
