import { useState } from 'react';
import type { FC, MouseEvent } from 'react';
import {
  Search,
  ShoppingCart,
  Star,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
  Shield,
  Truck,
  RotateCcw,
  Sparkles,
  Heart,
} from 'lucide-react';
import type { Product } from '../../types';
import { CATEGORIES, PRODUCTS } from '../../data/products';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface NordicHomepageProps {
  cartCount: number;
  onAddToCart: (product: Product) => void;
  onOpenCart: () => void;
  onQuickView: (product: Product) => void;
}

export const NordicHomepage: FC<NordicHomepageProps> = ({
  cartCount,
  onAddToCart,
  onOpenCart,
  onQuickView,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };


  // Filter products
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All Products' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.specs.some((s) => s.value.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStock = !onlyInStock || product.inStock;
    return matchesCategory && matchesSearch && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-800 font-['Plus_Jakarta_Sans'] selection:bg-slate-900 selection:text-white">
      {/* 1. TOP NOTICE ANNOUNCEMENT */}
      <div className="bg-slate-100/80 border-b border-slate-200/70 text-xs py-2.5 px-4 text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Complimentary courier shipping on all hardware systems above $150</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="hover:text-slate-900 cursor-pointer">Official Manufacturer Warranty</span>
            <span>•</span>
            <span className="hover:text-slate-900 cursor-pointer">30-Day Hassle-Free Returns</span>
            <span>•</span>
            <span className="hover:text-slate-900 cursor-pointer">Support Studio</span>
          </div>
        </div>
      </div>

      {/* 2. FLOATING MINIMAL HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-white font-bold text-lg tracking-tighter shadow-sm">
              E
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-slate-950">
                ELECTRO<span className="text-blue-600">STUDIO</span>
              </div>
              <p className="text-[10px] tracking-wider text-slate-400 font-medium uppercase">
                Nordic Hardware Atelier
              </p>
            </div>
          </div>

          {/* Clean Search Input */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search components by model, brand, or architecture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition"
              />
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedCategory('All Products')}
              className="text-sm font-medium text-slate-600 hover:text-slate-950 hidden lg:block transition"
            >
              Catalog
            </button>
            <button
              onClick={() => setSelectedCategory('Gaming Displays')}
              className="text-sm font-medium text-slate-600 hover:text-slate-950 hidden lg:block transition"
            >
              Studio Displays
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-medium text-sm transition shadow-sm active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-mono">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs"
            />
          </div>
        </div>
      </header>

      {/* 3. EDITORIAL HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-[#FDFDFD] border-b border-slate-200/60 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Next-Generation Architecture Series</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 leading-[1.12]">
                Hardware refined to its purest form.
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal max-w-lg">
                Engineered for creators, developers, and computational purists.
                Hand-curated silicon, silent cooling systems, and architectural workstations.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#products"
                  className="px-6 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-medium text-sm flex items-center gap-2 transition shadow-sm"
                >
                  Discover the Collection
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setSelectedCategory('Graphics Cards')}
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium text-sm transition"
                >
                  View Flagship GPUs
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 flex items-center gap-8 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified 100% Genuine</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>3-Year Direct Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-slate-700" />
                  <span>Free Global Express</span>
                </div>
              </div>
            </div>

            {/* Right Editorial Banner */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl bg-slate-100 p-3 border border-slate-200 shadow-sm">
                <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-900 group">
                  <ImageWithFallback
                    src={PRODUCTS[5].image}
                    alt={PRODUCTS[5].name}
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-medium inline-block mb-2">
                      Featured Hardware Showcase
                    </span>
                    <h3 className="text-xl font-bold mb-1">
                      {PRODUCTS[5].name}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-1 mb-3">
                      {PRODUCTS[5].description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold font-mono">
                        ${PRODUCTS[5].price}
                      </span>
                      <button
                        onClick={() => onAddToCart(PRODUCTS[5])}
                        className="px-4 py-2 rounded-full bg-white text-slate-950 font-medium text-xs hover:bg-slate-100 transition"
                      >
                        Add to Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REFINED CATEGORY NAVIGATION */}
      <section className="border-b border-slate-200/80 bg-white sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition ${
                    active
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. MAIN PRODUCT CATALOG */}
      <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              {selectedCategory}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Showing {filteredProducts.length} precision components
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 cursor-pointer transition">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded accent-slate-950"
              />
              In Stock Only
            </label>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 pr-8 appearance-none cursor-pointer focus:outline-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {(searchQuery || selectedCategory !== 'All Products' || onlyInStock) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Products');
                  setOnlyInStock(false);
                }}
                className="text-xs text-slate-400 hover:text-slate-800 underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">No matching products found</h3>
            <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">
              Try adjusting your search criteria or category filter to discover available items.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Products');
                setOnlyInStock(false);
              }}
              className="px-5 py-2.5 rounded-full bg-slate-950 text-white text-xs font-medium"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filteredProducts.map((product) => {
              const isWishlisted = !!wishlist[product.id];
              return (
                <div
                  key={product.id}
                  className="group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  {/* Top Header Badge & Wishlist */}
                  <div className="p-4 pb-0 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                      {product.brand}
                    </span>
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition"
                      aria-label="Save to wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Image Frame */}
                  <div className="p-4">
                    <div
                      onClick={() => onQuickView(product)}
                      className="h-52 rounded-xl bg-slate-50 overflow-hidden relative cursor-pointer group-hover:bg-slate-100/70 transition"
                    >
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        category={product.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      {product.badge && (
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur text-[11px] font-medium text-slate-800 shadow-xs border border-slate-200/50">
                          {product.badge}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="px-5 pb-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="flex text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                        </div>
                        <span className="text-xs font-semibold text-slate-700">
                          {product.rating}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({product.reviewsCount})
                        </span>
                      </div>

                      {/* Product Title */}
                      <h3
                        onClick={() => onQuickView(product)}
                        className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 cursor-pointer mb-2.5 leading-snug"
                      >
                        {product.name}
                      </h3>

                      {/* Clean Specs Pills */}
                      <div className="flex flex-wrap gap-1 mb-3.5">
                        {product.specs.slice(0, 2).map((spec, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] text-slate-600 font-mono"
                          >
                            {spec.label}: {spec.value}
                          </span>
                        ))}
                      </div>

                      {/* Stock state */}
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Ready to ship • {product.stockCount} units available</span>
                      </div>
                    </div>

                    {/* Price and Add to Bag */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        {product.originalPrice && (
                          <div className="text-[11px] text-slate-400 line-through">
                            ${product.originalPrice}
                          </div>
                        )}
                        <div className="text-lg font-bold text-slate-950 font-mono">
                          ${product.price}
                        </div>
                      </div>

                      <button
                        onClick={() => onAddToCart(product)}
                        className="px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 6. EDITORIAL FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-14 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="text-slate-950 font-bold text-base mb-2">
              ELECTRO<span className="text-blue-600">STUDIO</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Curating architectural hardware and precision computing equipment with Scandinavian
              design principles.
            </p>
          </div>
          <div>
            <div className="text-slate-900 font-semibold mb-3">Components</div>
            <ul className="space-y-2">
              <li className="hover:text-slate-900 cursor-pointer">Graphics Processing Units</li>
              <li className="hover:text-slate-900 cursor-pointer">Desktop Processors</li>
              <li className="hover:text-slate-900 cursor-pointer">High-Density Memory</li>
              <li className="hover:text-slate-900 cursor-pointer">Solid State Storage</li>
            </ul>
          </div>
          <div>
            <div className="text-slate-900 font-semibold mb-3">Customer Service</div>
            <ul className="space-y-2">
              <li className="hover:text-slate-900 cursor-pointer">Worldwide Shipping</li>
              <li className="hover:text-slate-900 cursor-pointer">Warranty & Authenticity</li>
              <li className="hover:text-slate-900 cursor-pointer">Enterprise Procurement</li>
              <li className="hover:text-slate-900 cursor-pointer">Contact Our Engineers</li>
            </ul>
          </div>
          <div>
            <div className="text-slate-900 font-semibold mb-3">Journal</div>
            <p className="text-xs mb-3">
              Receive quarterly dispatch on silicon engineering and workstation design.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter email address"
                className="bg-slate-50 border border-slate-200 rounded-l-full px-3 py-2 text-xs text-slate-800 w-full focus:outline-none"
              />
              <button className="bg-slate-950 text-white px-4 py-2 rounded-r-full font-medium text-xs hover:bg-slate-800">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px]">
          <div>© 2026 ElectroStudio Technologies. Designed with precision.</div>
          <div className="flex gap-4">
            <span className="hover:text-slate-900 cursor-pointer">Privacy</span>
            <span className="hover:text-slate-900 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-900 cursor-pointer">Accessibility</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
