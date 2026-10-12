import { useState } from 'react';
import type { FC } from 'react';
import {
  Search,
  ShoppingCart,
  Star,
  ShieldAlert,
  Crown,
  ChevronRight,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Gem,
  Award,
} from 'lucide-react';
import type { Product } from '../../types';
import { CATEGORIES, PRODUCTS } from '../../data/products';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface ApexHomepageProps {
  cartCount: number;
  onAddToCart: (product: Product) => void;
  onOpenCart: () => void;
  onQuickView: (product: Product) => void;
}

export const ApexHomepage: FC<ApexHomepageProps> = ({
  cartCount,
  onAddToCart,
  onOpenCart,
  onQuickView,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

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
    <div className="min-h-screen bg-[#040508] text-slate-200 font-['DM_Sans'] selection:bg-amber-500 selection:text-black">
      {/* 1. PRESTIGE MARQUEE BAR */}
      <div className="bg-[#090b12] border-b border-amber-500/20 text-[11px] py-2 px-4 text-amber-300/80 font-mono tracking-widest uppercase">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>APEX ATELIER • BESPOKE COMPUTING ARCHITECTURE & FLAGSHIP HARDWARE</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <span className="hover:text-amber-400 cursor-pointer transition">
              WHITE-GLOVE COURIER DISPATCH
            </span>
            <span>•</span>
            <span className="hover:text-amber-400 cursor-pointer transition">
              ATELIER CONCIERGE DIRECT
            </span>
          </div>
        </div>
      </div>

      {/* 2. LUXURY HEADER */}
      <header className="sticky top-0 z-40 bg-[#040508]/90 backdrop-blur-xl border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-22 flex items-center justify-between gap-6">
          {/* Brand Monogram */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 p-[1px] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <div className="w-full h-full bg-[#070910] rounded-[7px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="font-['Syne'] text-2xl font-bold tracking-wider text-white">
                APEX<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600"> ATELIER</span>
              </div>
              <p className="text-[10px] tracking-widest text-amber-400/60 uppercase font-mono">
                Boutique Hardware Haute Horlogerie
              </p>
            </div>
          </div>

          {/* Gold Framed Search */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/70" />
              <input
                type="text"
                placeholder="Curate Silicon (e.g. RTX 4090, 7950X3D, QD-OLED, DDR5)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0c0f18] border border-amber-500/30 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition"
              />
            </div>
          </div>

          {/* Concierge & Cart */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedCategory('All Products')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded border border-amber-500/30 text-xs font-mono text-amber-300 hover:bg-amber-500/10 transition"
            >
              <Gem className="w-3.5 h-3.5 text-amber-400" />
              BESPOKE BUILDS
            </button>

            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.35)] transition transform active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="font-['Syne'] tracking-wide">RESERVE</span>
              <span className="bg-black text-amber-300 text-xs px-2 py-0.5 rounded font-mono font-bold">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
            <input
              type="text"
              placeholder="Curate hardware..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c0f18] border border-amber-500/30 rounded-lg pl-9 pr-4 py-2 text-xs text-white"
            />
          </div>
        </div>
      </header>

      {/* 3. CINEMATIC LUXURY HERO */}
      <section className="relative overflow-hidden border-b border-amber-500/20 bg-radial from-[#151208] via-[#090b10] to-[#040508] py-16 md:py-24">
        {/* Subtle Gold light flare */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>LIMITED RUN • SILICON MASTERWORKS</span>
              </div>

              <h1 className="font-['Syne'] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                THE SUMMIT OF <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
                  COMPUTATIONAL ART.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light max-w-xl">
                Rare bin-sorted silicon, bespoke custom chassis, and artisanal liquid cooling
                assemblies. Hand-inspected and individually certified for the world's most
                demanding computational creators.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#products"
                  className="px-7 py-3.5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-['Syne'] font-bold text-sm flex items-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:brightness-110 transition"
                >
                  EXPLORE THE MASTERPIECES
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  onClick={() => setSelectedCategory('Motherboards')}
                  className="px-6 py-3.5 rounded-lg bg-[#0e121d] hover:bg-[#141a29] border border-amber-500/30 text-amber-300 text-sm font-mono flex items-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  FLAGSHIP EDITIONS
                </button>
              </div>

              {/* Atelier Pillars */}
              <div className="pt-6 border-t border-amber-500/20 grid grid-cols-3 gap-6 text-xs">
                <div>
                  <div className="font-['Syne'] text-xl font-bold text-amber-400">0.01%</div>
                  <div className="text-slate-400 font-mono mt-0.5">Top-Bin Silicon Selection</div>
                </div>
                <div>
                  <div className="font-['Syne'] text-xl font-bold text-amber-400">VIP</div>
                  <div className="text-slate-400 font-mono mt-0.5">White Glove Delivery</div>
                </div>
                <div>
                  <div className="font-['Syne'] text-xl font-bold text-amber-400">LIFETIME</div>
                  <div className="text-slate-400 font-mono mt-0.5">Atelier Concierge Care</div>
                </div>
              </div>
            </div>

            {/* Right Masterpiece Showcase */}
            <div className="lg:col-span-5">
              <div className="p-1 rounded-2xl bg-gradient-to-b from-amber-500/40 via-amber-500/10 to-transparent shadow-[0_0_50px_rgba(212,175,55,0.15)]">
                <div className="bg-[#0b0e16] rounded-xl p-6 border border-amber-500/30 relative">
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" /> ATELIER FLAGSHIP
                    </span>
                    <span className="text-xs font-mono text-amber-400">SERIAL #APX-4090-01</span>
                  </div>

                  <div className="h-60 rounded-lg overflow-hidden border border-amber-500/30 mb-5 relative group">
                    <ImageWithFallback
                      src={PRODUCTS[0].image}
                      alt={PRODUCTS[0].name}
                      category={PRODUCTS[0].category}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e16] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                      <div className="bg-black/90 backdrop-blur px-2.5 py-1 rounded text-xs font-mono text-amber-300 border border-amber-500/30">
                        24GB GDDR6X • TITANIUM EDITION
                      </div>
                      <button
                        onClick={() => onQuickView(PRODUCTS[0])}
                        className="px-2.5 py-1 rounded bg-amber-500 text-black text-xs font-mono font-bold"
                      >
                        DOSSIER
                      </button>
                    </div>
                  </div>

                  <h3 className="font-['Syne'] text-lg font-bold text-white mb-2 leading-snug">
                    {PRODUCTS[0].name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                    {PRODUCTS[0].description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-amber-500/20">
                    <div>
                      <div className="text-xs text-slate-500 line-through font-mono">
                        ${PRODUCTS[0].originalPrice}
                      </div>
                      <div className="text-2xl font-bold font-['Syne'] text-amber-400">
                        ${PRODUCTS[0].price}
                      </div>
                    </div>
                    <button
                      onClick={() => onAddToCart(PRODUCTS[0])}
                      className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 text-black font-['Syne'] font-bold text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] transition hover:brightness-110"
                    >
                      RESERVE SPECIMEN
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LUXURY CATEGORY PILL STRIP */}
      <section className="border-b border-amber-500/20 bg-[#06080d] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-mono transition ${
                    active
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                      : 'bg-[#0c0f18] hover:bg-[#131724] text-slate-300 border border-amber-500/20'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. MASTERPIECE CATALOG */}
      <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-[#0b0e16] p-4 rounded-xl border border-amber-500/20">
          <div className="flex items-center gap-3">
            <span className="font-['Syne'] text-lg font-bold text-white flex items-center gap-2">
              <Gem className="w-5 h-5 text-amber-400" />
              THE ATELIER ARCHIVE
            </span>
            <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              {filteredProducts.length} SPECIMENS
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer bg-[#121624] px-3 py-2 rounded-lg border border-amber-500/20 hover:border-amber-400/50 transition">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded accent-amber-500"
              />
              IMMEDIATE ALLOCATION ONLY
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#121624] border border-amber-500/20 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="featured">ORDER: CURATED EDITIONS</option>
              <option value="price-asc">VALUATION: ASCENDING</option>
              <option value="price-desc">VALUATION: DESCENDING</option>
              <option value="rating">CRITICS EVALUATION</option>
            </select>

            {(searchQuery || selectedCategory !== 'All Products' || onlyInStock) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Products');
                  setOnlyInStock(false);
                }}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> RESET
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#0b0e16] rounded-2xl border border-amber-500/20">
            <Crown className="w-12 h-12 text-amber-500/40 mx-auto mb-3" />
            <h3 className="font-['Syne'] text-xl font-bold text-white mb-1">
              NO HARDWARE SPECIMENS MATCH CURRENT FILTERS
            </h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-4 font-mono">
              Kindly reconfigure search parameters or browse all archive categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Products');
                setOnlyInStock(false);
              }}
              className="px-5 py-2.5 rounded bg-amber-500 text-black font-mono font-bold text-xs"
            >
              RELOAD VAULT
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-[#090c14] hover:bg-[#0e121d] border border-amber-500/20 hover:border-amber-400/60 rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_35px_rgba(212,175,55,0.15)] hover:-translate-y-1"
              >
                {/* Header Specimen Tag */}
                <div className="p-4 pb-0 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-400/80 tracking-widest uppercase">
                    {product.brand}
                  </span>
                  {product.badge && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Product Image Frame */}
                <div className="p-4">
                  <div
                    onClick={() => onQuickView(product)}
                    className="h-48 rounded-lg overflow-hidden bg-[#04060a] border border-amber-500/20 relative cursor-pointer group-hover:border-amber-400/40 transition"
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      category={product.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 backdrop-blur text-[10px] font-mono text-amber-300 border border-amber-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      VAULT: {product.stockCount} LEFT
                    </div>
                  </div>
                </div>

                {/* Info & Specs */}
                <div className="px-4 pb-3 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="flex text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-300">
                        {product.rating}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        ({product.reviewsCount} critiques)
                      </span>
                    </div>

                    <h4
                      onClick={() => onQuickView(product)}
                      className="font-['Syne'] text-sm font-bold text-white hover:text-amber-400 transition line-clamp-2 cursor-pointer mb-2.5 leading-snug"
                    >
                      {product.name}
                    </h4>

                    {/* Hardware Specs */}
                    <div className="grid grid-cols-2 gap-1.5 mb-3 bg-[#05070c] p-2 rounded border border-amber-500/15">
                      {product.specs.slice(0, 2).map((spec, i) => (
                        <div key={i} className="text-[10px] font-mono">
                          <span className="text-slate-500 block truncate">{spec.label}</span>
                          <span className="text-amber-200/90 font-medium truncate block">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-2.5 border-t border-amber-500/20 flex items-center justify-between gap-2">
                    <div>
                      {product.originalPrice && (
                        <div className="text-[11px] font-mono text-slate-500 line-through">
                          ${product.originalPrice}
                        </div>
                      )}
                      <div className="text-lg font-bold font-['Syne'] text-amber-400">
                        ${product.price}
                      </div>
                    </div>

                    <button
                      onClick={() => onAddToCart(product)}
                      className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 text-black font-['Syne'] font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.25)] transition active:scale-95"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      RESERVE
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onQuickView(product)}
                  className="w-full py-1.5 bg-[#05070c] hover:bg-amber-950/30 text-[10px] font-mono text-slate-400 hover:text-amber-300 border-t border-amber-500/20 transition flex items-center justify-center gap-1"
                >
                  INSPECT COMPONENT DOSSIER <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 6. BESPOKE ATELIER SERVICE GUARANTEE */}
      <section className="border-t border-amber-500/20 bg-[#070910] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-[#0b0e16] border border-amber-500/20 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Crown className="w-5 h-5" />
              </div>
              <h4 className="font-['Syne'] text-lg font-bold text-white">
                Certified Silicon Provenance
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Each unit includes an authenticated physical certificate of silicon purity,
                voltage calibration table, and individual serial registry.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0b0e16] border border-amber-500/20 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="font-['Syne'] text-lg font-bold text-white">
                Direct Atelier Concierge
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Dedicated hardware advisor on call 24/7 for custom assembly consulting,
                sub-zero cooling optimization, and rapid warranty replacement.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0b0e16] border border-amber-500/20 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Gem className="w-5 h-5" />
              </div>
              <h4 className="font-['Syne'] text-lg font-bold text-white">
                Bespoke Chassis Fitting
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Laser-scanned tolerance verification ensuring zero millimeter clearance
                clashes across liquid radiators, tall heatsinks, and oversized GPUs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LUXURY FOOTER */}
      <footer className="border-t border-amber-500/20 bg-[#030406] py-14 text-slate-400 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="font-['Syne'] text-xl font-bold text-white mb-2 flex items-center gap-2">
              APEX<span className="text-amber-400"> ATELIER</span>
            </div>
            <p className="text-slate-400 text-xs font-sans leading-relaxed">
              Purveyors of world-class silicon art, bespoke liquid hardware systems, and
              ultra-enthusiast computational equipment.
            </p>
          </div>
          <div>
            <div className="text-white font-bold mb-3 uppercase tracking-wider">THE ARCHIVE</div>
            <ul className="space-y-1.5 text-slate-400">
              <li className="hover:text-amber-400 cursor-pointer">Artisanal Graphics Cards</li>
              <li className="hover:text-amber-400 cursor-pointer">Overclocked Silicon Modules</li>
              <li className="hover:text-amber-400 cursor-pointer">Custom Liquid Cooling Loops</li>
              <li className="hover:text-amber-400 cursor-pointer">Audiophile Grade Equipment</li>
            </ul>
          </div>
          <div>
            <div className="text-white font-bold mb-3 uppercase tracking-wider">ATELIER PRIVILEGES</div>
            <ul className="space-y-1.5 text-slate-400">
              <li className="hover:text-amber-400 cursor-pointer">Private Salon Appointments</li>
              <li className="hover:text-amber-400 cursor-pointer">Bespoke Hard-Tube Bending</li>
              <li className="hover:text-amber-400 cursor-pointer">White-Glove Courier Service</li>
              <li className="hover:text-amber-400 cursor-pointer">Silicon Lottery Registry</li>
            </ul>
          </div>
          <div>
            <div className="text-white font-bold mb-3 uppercase tracking-wider">PRIVATE DISPATCH</div>
            <p className="text-[11px] text-slate-400 mb-2">
              Privileged access to limited production runs and unannounced flagship hardware drops.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="vip@client.com"
                className="bg-[#0b0e16] border border-amber-500/30 rounded-l px-3 py-2 text-xs text-white w-full focus:outline-none focus:border-amber-400"
              />
              <button className="bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold px-3 py-2 rounded-r">
                JOIN
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-amber-500/15 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[11px]">
          <div>© 2026 APEX ATELIER LTD. ALL REGISTERED TRADEMARKS & CERTIFICATES RESERVED.</div>
          <div className="flex gap-4">
            <span className="hover:text-amber-400 cursor-pointer">CONFIDENTIALITY</span>
            <span className="hover:text-amber-400 cursor-pointer">CERTIFICATE VERIFICATION</span>
            <span className="hover:text-amber-400 cursor-pointer">LEGAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
