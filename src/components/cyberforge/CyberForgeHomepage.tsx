import type { FC } from 'react';
import { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Zap,
  Cpu,
  ShieldCheck,
  Flame,
  Star,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Terminal,
  Layers,
  Heart,
  Wrench,
  Clock,
} from 'lucide-react';
import type { Product, ActivePageView } from '../../types';
import { CATEGORIES, PRODUCTS } from '../../data/products';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface CyberForgeHomepageProps {
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: ActivePageView, category?: string) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistMap: Record<string, boolean>;
}

export const CyberForgeHomepage: FC<CyberForgeHomepageProps> = ({
  onAddToCart,
  onQuickView,
  onSelectProduct,
  onNavigate,
  onToggleWishlist,
  wishlistMap,
}) => {

  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Flash drop countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        return { hours: Math.max(0, prev.hours - 1), minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-['Plus_Jakarta_Sans'] selection:bg-cyan-500 selection:text-black">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-[#0c1222] via-[#090d16] to-[#07090e]">
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d18_1px,transparent_1px),linear-gradient(to_bottom,#1f293d18_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-cyan-400 text-xs font-['JetBrains_Mono'] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
                <span>GEN-5 ARCHITECTURE AVAILABLE NOW</span>
              </div>

              <h1 className="font-['Space_Grotesk'] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                MAXIMUM COMPUTE. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400">
                  ZERO COMPROMISE.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
                Source bin-sorted GPUs, factory-delidded processors, and military-grade
                motherboards. Verified telemetry benchmarks, guaranteed silicon binning,
                and zero artificial markups.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('catalog')}
                  className="px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-['Space_Grotesk'] tracking-wide text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition transform active:scale-95"
                >
                  EXPLORE HARDWARE CATALOG
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('builder')}
                  className="px-5 py-3.5 rounded-xl bg-[#141b2c] hover:bg-[#1a233a] border border-cyan-500/30 text-cyan-300 text-sm font-['JetBrains_Mono'] font-bold flex items-center gap-2 transition"
                >
                  <Wrench className="w-4 h-4 text-cyan-400" />
                  RIG BUILDER TOOL
                </button>
              </div>

              {/* Hardware Telemetry stats pill */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
                <div>
                  <div className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                    4.98<span className="text-cyan-400">/5</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">Enthusiast Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-['Space_Grotesk'] text-cyan-400">
                    48-HR
                  </div>
                  <div className="text-xs text-slate-400 font-mono">Silicon Burn-in Test</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-['Space_Grotesk'] text-amber-400">
                    100%
                  </div>
                  <div className="text-xs text-slate-400 font-mono">Original Factory Sealed</div>
                </div>
              </div>
            </div>

            {/* Right Featured Hardware Card (Spotlight) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl p-1 bg-gradient-to-b from-cyan-500/40 via-blue-500/20 to-slate-800/40 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
                <div className="bg-[#0e1424] rounded-xl p-6 relative overflow-hidden">
                  {/* Top pill */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" /> SPOTLIGHT SILICON
                    </span>
                    <span className="text-xs font-mono text-cyan-400">STOCK: 4 UNITS</span>
                  </div>

                  {/* Image */}
                  <div
                    onClick={() => onSelectProduct(PRODUCTS[0])}
                    className="h-56 sm:h-64 rounded-lg overflow-hidden border border-slate-700/60 mb-5 relative group cursor-pointer"
                  >
                    <ImageWithFallback
                      src={PRODUCTS[0].image}
                      alt={PRODUCTS[0].name}
                      category={PRODUCTS[0].category}
                      className="w-full h-full group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <div className="bg-black/80 backdrop-blur px-2.5 py-1 rounded text-xs font-mono text-cyan-300 border border-cyan-500/30">
                        24GB GDDR6X • 2640 MHz
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickView(PRODUCTS[0]);
                        }}
                        className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition"
                      >
                        SPECS
                      </button>
                    </div>
                  </div>

                  <h3
                    onClick={() => onSelectProduct(PRODUCTS[0])}
                    className="font-['Space_Grotesk'] text-lg font-bold text-white hover:text-cyan-300 transition cursor-pointer mb-2 leading-snug"
                  >
                    {PRODUCTS[0].name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                    {PRODUCTS[0].description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <div>
                      <div className="text-xs text-slate-500 line-through font-mono">
                        ${PRODUCTS[0].originalPrice}
                      </div>
                      <div className="text-2xl font-bold font-['Space_Grotesk'] text-cyan-400">
                        ${PRODUCTS[0].price}
                      </div>
                    </div>
                    <button
                      onClick={() => onAddToCart(PRODUCTS[0])}
                      className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-['Space_Grotesk'] font-bold text-sm flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      ADD TO RIG
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLASH DROP / DAILY HARDWARE DEALS BANNER */}
      <section className="bg-gradient-to-r from-[#0d1425] via-[#101b33] to-[#0a101d] border-b border-cyan-500/30 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 animate-pulse">
              <Flame className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <div className="font-['Space_Grotesk'] text-base font-extrabold text-white flex items-center gap-2">
                DAILY SILICON FLASH DROP
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono text-[10px] font-bold">
                  LIMITED ALLOCATION
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Get up to 25% off flagship NVMe storage and unlocked desktop processors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown timer */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400">ENDS IN:</span>
              <span className="px-2 py-1 rounded bg-black/80 border border-cyan-500/30 text-cyan-300 font-bold">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={() => onNavigate('catalog', 'Storage (SSD)')}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-['Space_Grotesk'] font-bold text-xs shadow-sm transition"
            >
              SHOP DROP →
            </button>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY TAXONOMY STRIP */}
      <section className="border-b border-slate-800 bg-[#0a0f1d] py-3.5 sticky top-20 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 ${
                    active
                      ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-[#121929] hover:bg-[#1a2338] text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat === 'All Products' && <Layers className="w-3.5 h-3.5" />}
                  {cat === 'Graphics Cards' && <Zap className="w-3.5 h-3.5" />}
                  {cat === 'Processors' && <Cpu className="w-3.5 h-3.5" />}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HARDWARE CATALOG & FILTERS */}
      <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-[#0e1424] p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-['Space_Grotesk'] text-lg font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
              HARDWARE INVENTORY
            </span>
            <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              {filteredProducts.length} UNITS DETECTED
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Search */}
            <input
              type="text"
              placeholder="Filter hardware..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#141b2e] border border-slate-700/60 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />

            {/* In stock toggle */}
            <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer bg-[#141b2e] px-3 py-2 rounded-lg border border-slate-700/60 hover:border-cyan-500/40 transition">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded accent-cyan-400"
              />
              IN STOCK ONLY
            </label>


            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#141b2e] border border-slate-700/60 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="featured">SORT: FEATURED SILICON</option>
              <option value="price-asc">PRICE: LOWEST FIRST</option>
              <option value="price-desc">PRICE: HIGHEST FIRST</option>
              <option value="rating">HIGHEST BENCHMARK / RATING</option>
            </select>

            <button
              onClick={() => onNavigate('catalog')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 ml-1"
            >
              FULL CATALOG <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isWishlisted = !!wishlistMap[product.id];
            return (
              <div
                key={product.id}
                className="group relative bg-[#0d1322] hover:bg-[#11182c] border border-slate-800/80 hover:border-cyan-500/50 rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-1"
              >
                {/* Top Badge strip */}
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
                      title="Save item"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Product Image */}
                <div className="p-4 relative">
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="h-48 rounded-lg overflow-hidden bg-[#070b14] border border-slate-800/80 relative cursor-pointer group-hover:border-cyan-500/30 transition"
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

                {/* Info & Specs */}
                <div className="px-4 pb-2 flex-1 flex flex-col justify-between">
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

                    <h4
                      onClick={() => onSelectProduct(product)}
                      className="font-['Space_Grotesk'] text-sm font-bold text-white hover:text-cyan-400 transition line-clamp-2 cursor-pointer mb-2 leading-snug"
                    >
                      {product.name}
                    </h4>

                    {/* Hardware Key Specs Grid */}
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

                  {/* Pricing and Action */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
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
                      className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-['Space_Grotesk'] font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] transition transform active:scale-95"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      ADD
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onSelectProduct(product)}
                  className="w-full py-1.5 bg-[#0a0f1d] hover:bg-cyan-950/40 text-[10px] font-mono text-slate-400 hover:text-cyan-300 border-t border-slate-800/80 transition flex items-center justify-center gap-1"
                >
                  VIEW TECHNICAL DOSSIER <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* 5. INTERACTIVE RIG BUILDER CALLOUT BANNER */}
      <section className="my-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl p-8 bg-gradient-to-r from-cyan-950/70 via-[#0e172a] to-blue-950/80 border border-cyan-500/40 relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-3">
              <span className="px-3 py-1 rounded-full bg-cyan-500 text-black font-mono font-bold text-xs inline-block">
                COMPATIBILITY CHECKER ENGINE
              </span>
              <h3 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold text-white">
                Building a Custom Battle Rig or Compute Workstation?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-mono max-w-xl">
                Use our automated PC Rig Builder to match CPU sockets, estimate system peak wattage,
                verify chassis GPU clearance, and order all parts together.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <button
                onClick={() => onNavigate('builder')}
                className="px-6 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-['Space_Grotesk'] text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition"
              >
                <Wrench className="w-5 h-5" />
                LAUNCH RIG BUILDER
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ENGINEERING VALUE PROPOSITION */}
      <section className="border-t border-slate-800 bg-[#090e1c] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-[#0f1629] border border-cyan-500/20 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                Guaranteed Silicon Binning
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Every top-tier SKU is batch-verified for optimal voltage curves, thermal headroom,
                and zero coil whine before warehouse sealing.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0f1629] border border-cyan-500/20 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                Same-Day Insured Air Courier
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Dispatched in anti-static ESD custom foam containers. Tracked with thermal & drop
                shock telemetry indicators on all packages.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0f1629] border border-cyan-500/20 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Terminal className="w-5 h-5" />
              </div>
              <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                Expert PC Architecture Support
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Direct access to seasoned system engineers for PCIe lane allocation, VRM thermal
                matching, and custom BIOS tuning guidance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
