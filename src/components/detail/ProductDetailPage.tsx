import type { FC } from 'react';
import { useState } from 'react';
import {
  Star,
  ShoppingCart,
  ShieldCheck,
  Zap,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Heart,
  Plus,
  Minus,
  Sparkles,
  BarChart3,
  MessageSquare,
  Cpu,
  Layers,
} from 'lucide-react';
import type { Product, ActivePageView } from '../../types';
import { PRODUCTS } from '../../data/products';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onNavigate: (view: ActivePageView, category?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailPage: FC<ProductDetailPageProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onNavigate,
  onSelectProduct,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'benchmarks' | 'reviews'>('overview');
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Gallery images
  const gallery = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];

  // Frequently paired together items
  const pairedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category !== product.category
  ).slice(0, 2);

  const bundleTotal = product.price + pairedProducts.reduce((sum, p) => sum + p.price, 0);
  const bundleDiscounted = bundleTotal * 0.95; // 5% bundle discount

  const handleAddBundle = () => {
    onAddToCart(product);
    pairedProducts.forEach((p) => onAddToCart(p));
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-['Plus_Jakarta_Sans'] pb-24">
      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-800 bg-[#090d16] py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs font-mono text-slate-400">
          <span
            onClick={() => onNavigate('home')}
            className="hover:text-cyan-400 cursor-pointer"
          >
            HOME
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span
            onClick={() => onNavigate('catalog')}
            className="hover:text-cyan-400 cursor-pointer"
          >
            CATALOG
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span
            onClick={() => onNavigate('catalog', product.category)}
            className="hover:text-cyan-400 cursor-pointer text-slate-300"
          >
            {product.category}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-cyan-400 font-semibold truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* ========================================================= */}
          {/* LEFT: GALLERY & HARDWARE MEDIA */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage Image */}
            <div className="relative rounded-2xl overflow-hidden bg-[#0d1322] border border-slate-800 p-6 shadow-[0_0_40px_rgba(6,182,212,0.1)] group">
              <div className="h-80 sm:h-[440px] rounded-xl overflow-hidden bg-[#070b14] border border-slate-800/80 relative flex items-center justify-center">
                <ImageWithFallback
                  src={selectedImage}
                  alt={product.name}
                  category={product.category}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 shadow-lg">
                    {product.badge}
                  </span>
                )}
                {/* Silicon Lot Badge */}
                <div className="absolute bottom-4 left-4 bg-black/85 backdrop-blur px-3 py-1.5 rounded-lg border border-cyan-500/30 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>FACTORY SEALED & LOTTERY BIN VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Thumbnail Selectors */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-3">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                      selectedImage === img
                        ? 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* RIGHT: BUY BOX & TECHNICAL TELEMETRY */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400">
                  {product.brand} • SKU #{product.id.toUpperCase()}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {product.stockCount} UNITS REMAINING
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 mt-3 text-xs font-mono">
                <div className="flex items-center text-amber-400 gap-1.5 bg-[#141b2e] px-2.5 py-1 rounded-lg border border-slate-700">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-white">{product.rating} / 5.0</span>
                </div>
                <span className="text-slate-400 hover:text-cyan-400 cursor-pointer transition">
                  {product.reviewsCount} Verified Hardware Benchmarks
                </span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="bg-[#0e1424] p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-white">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-base font-mono text-slate-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                    SAVE ${(product.originalPrice - product.price).toFixed(0)}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 font-mono">
                Or 4 interest-free installments of{' '}
                <strong className="text-cyan-300">${(product.price / 4).toFixed(2)}</strong> with
                Zero-Interest Hardware Financing.
              </p>
            </div>

            {/* Hardware Key Specs Grid */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase font-bold text-slate-400">
                Core Hardware Parameters:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {product.specs.slice(0, 4).map((spec, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-[#0d1322] border border-slate-800/80"
                  >
                    <div className="text-[10px] text-slate-500 uppercase">{spec.label}</div>
                    <div className="font-bold text-cyan-300 truncate">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar (Quantity & Add to Rig) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-700 bg-[#0e1424] rounded-xl">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 text-slate-400 hover:text-white transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 font-mono font-bold text-sm text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                    className="p-3 text-slate-400 hover:text-white transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Add Button */}
                <button
                  onClick={() => onAddToCart(product, quantity)}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-['Space_Grotesk'] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition transform active:scale-98"
                >
                  <ShoppingCart className="w-4 h-4" />
                  ADD TO RIG MANIFEST (${(product.price * quantity).toFixed(2)})
                </button>

                {/* Wishlist Heart */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3.5 rounded-xl border transition ${
                    isWishlisted
                      ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                      : 'border-slate-700 bg-[#0e1424] text-slate-400 hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Express buy */}
              <button
                onClick={() => {
                  onAddToCart(product, quantity);
                  onNavigate('cart');
                }}
                className="w-full py-3 rounded-xl bg-[#141b2e] hover:bg-[#1a233a] border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                1-CLICK INSTANT HARDWARE CHECKOUT
              </button>
            </div>

            {/* Shipping & Delivery guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Dispatches today if ordered before 3PM</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
                <span>30-Day Zero-Dead-Pixel Policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* FREQUENTLY PAIRED TOGETHER BUNDLE */}
        {/* ========================================================= */}
        <div className="my-16 p-6 rounded-2xl bg-[#0c1220] border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              FREQUENTLY PAIRED WITH THIS COMPONENT
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
              BUNDLE DISCOUNT: 5% OFF
            </span>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Product 1 */}
              <div className="w-28 text-center space-y-1">
                <div className="h-20 rounded-lg overflow-hidden bg-slate-900 border border-cyan-400/50">
                  <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-[10px] font-mono text-slate-300 truncate">{product.name}</div>
                <div className="text-xs font-mono font-bold text-cyan-400">${product.price}</div>
              </div>

              <span className="text-xl font-bold text-slate-500">+</span>

              {/* Product 2 */}
              {pairedProducts[0] && (
                <div
                  onClick={() => onSelectProduct(pairedProducts[0])}
                  className="w-28 text-center space-y-1 cursor-pointer group"
                >
                  <div className="h-20 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 group-hover:border-cyan-400 transition">
                    <ImageWithFallback
                      src={pairedProducts[0].image}
                      alt={pairedProducts[0].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[10px] font-mono text-slate-300 truncate group-hover:text-cyan-300">
                    {pairedProducts[0].name}
                  </div>
                  <div className="text-xs font-mono font-bold text-cyan-400">${pairedProducts[0].price}</div>
                </div>
              )}

              {pairedProducts[1] && (
                <>
                  <span className="text-xl font-bold text-slate-500">+</span>
                  <div
                    onClick={() => onSelectProduct(pairedProducts[1])}
                    className="w-28 text-center space-y-1 cursor-pointer group"
                  >
                    <div className="h-20 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 group-hover:border-cyan-400 transition">
                      <ImageWithFallback
                        src={pairedProducts[1].image}
                        alt={pairedProducts[1].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-[10px] font-mono text-slate-300 truncate group-hover:text-cyan-300">
                      {pairedProducts[1].name}
                    </div>
                    <div className="text-xs font-mono font-bold text-cyan-400">${pairedProducts[1].price}</div>
                  </div>
                </>
              )}
            </div>

            {/* Total and Action */}
            <div className="flex items-center gap-4 text-right">
              <div>
                <div className="text-xs font-mono text-slate-500 line-through">
                  Total: ${bundleTotal.toFixed(2)}
                </div>
                <div className="text-xl font-bold font-['Space_Grotesk'] text-white">
                  Bundle: <span className="text-cyan-400">${bundleDiscounted.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleAddBundle}
                className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-['Space_Grotesk'] text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition"
              >
                ADD ALL 3 TO RIG
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* DEEP TECHNICAL TABS CONTAINER */}
        {/* ========================================================= */}
        <div className="rounded-2xl bg-[#0d1322] border border-slate-800 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-800 overflow-x-auto bg-[#090d16]">
            {[
              { id: 'overview', label: 'ARCHITECTURE OVERVIEW', icon: Cpu },
              { id: 'specs', label: 'FULL TECHNICAL SPECIFICATIONS', icon: Layers },
              { id: 'benchmarks', label: 'VERIFIED 4K BENCHMARKS', icon: BarChart3 },
              { id: 'reviews', label: `USER REVIEWS (${product.reviews?.length || 0})`, icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 text-xs font-['Space_Grotesk'] font-bold flex items-center gap-2 whitespace-nowrap transition border-b-2 ${
                    active
                      ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6 sm:p-8">
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 max-w-4xl text-slate-300 leading-relaxed text-sm">
                <div>
                  <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">
                    Engineered for Absolute Performance
                  </h4>
                  <p className="text-slate-400">
                    {product.longDescription || product.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold font-['Space_Grotesk'] text-sm">
                      <Zap className="w-4 h-4" />
                      Thermal Dynamics Mastery
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Precision milled cold plate and high-density copper fins maximize surface
                      area dissipation to prevent thermal throttling under continuous 100% compute load.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold font-['Space_Grotesk'] text-sm">
                      <ShieldCheck className="w-4 h-4" />
                      Strict Hardware Binning
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Each unit is subjected to an automated 48-hour burn-in diagnostic cycle to ensure
                      stable voltage curves and zero post-assembly capacitor failure.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SPECS */}
            {activeTab === 'specs' && (
              <div className="space-y-4 max-w-4xl">
                <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white">
                  Technical Specifications Sheet
                </h4>
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
                  {product.specs.map((spec, i) => (
                    <div
                      key={i}
                      className={`grid grid-cols-1 sm:grid-cols-3 p-3.5 ${
                        i % 2 === 0 ? 'bg-[#090d16]' : 'bg-[#0d1322]'
                      }`}
                    >
                      <div className="text-slate-400 font-bold">{spec.label}</div>
                      <div className="sm:col-span-2 text-cyan-300 font-semibold mt-1 sm:mt-0">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                  {product.wattage && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 bg-[#090d16]">
                      <div className="text-slate-400 font-bold">Estimated Power Draw</div>
                      <div className="sm:col-span-2 text-cyan-300 font-semibold mt-1 sm:mt-0">
                        {product.wattage} Watts TDP
                      </div>
                    </div>
                  )}
                  {product.socket && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 bg-[#0d1322]">
                      <div className="text-slate-400 font-bold">Platform Socket</div>
                      <div className="sm:col-span-2 text-cyan-300 font-semibold mt-1 sm:mt-0">
                        {product.socket} Compatible
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* BENCHMARKS */}
            {activeTab === 'benchmarks' && (
              <div className="space-y-6 max-w-4xl font-mono text-xs">
                <div>
                  <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-1">
                    Verified Lab Telemetry & Framerates
                  </h4>
                  <p className="text-slate-400">
                    Tested in our diagnostic lab with an open test bench at 21°C ambient room temperature.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Metric 1 */}
                  <div>
                    <div className="flex justify-between mb-1 text-slate-300">
                      <span>Cyberpunk 2077 (4K Ray Tracing Overdrive / DLSS Frame Gen)</span>
                      <span className="text-cyan-400 font-bold">118 FPS Avg</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full w-[94%]" />
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div>
                    <div className="flex justify-between mb-1 text-slate-300">
                      <span>Black Myth: Wukong (4K Cinematic Max Settings)</span>
                      <span className="text-cyan-400 font-bold">96 FPS Avg</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full w-[82%]" />
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div>
                    <div className="flex justify-between mb-1 text-slate-300">
                      <span>Blender 4.2 Benchmark (Monster Scene Score)</span>
                      <span className="text-amber-400 font-bold">6,420 Samples/sec</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full w-[98%]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-8 max-w-4xl">
                {/* Existing Reviews */}
                <div className="space-y-4">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-5 rounded-xl bg-[#090d16] border border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{rev.user}</span>
                            {rev.verified && (
                              <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> VERIFIED BUILDER
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-slate-500">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <h5 className="font-['Space_Grotesk'] text-sm font-bold text-white">
                          {rev.title}
                        </h5>
                        <p className="text-xs text-slate-300 font-mono leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-xs font-mono">
                      No customer reviews yet. Be the first to submit verified hardware feedback!
                    </p>
                  )}
                </div>

                {/* Add Review Form */}
                <div className="p-6 rounded-xl bg-[#0e1424] border border-cyan-500/20 space-y-4">
                  <h4 className="font-['Space_Grotesk'] text-base font-bold text-white">
                    Submit Silicon Feedback & Benchmark Note
                  </h4>

                  {reviewSubmitted ? (
                    <div className="p-3 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Review submitted for verification and published to telemetry database!</span>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (userReview.trim()) setReviewSubmitted(true);
                      }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                        <span>Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setUserRating(star)}
                            className="p-1 text-amber-400"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= userRating ? 'fill-amber-400' : 'text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      <textarea
                        rows={3}
                        required
                        placeholder="Detail thermals, clock frequencies, motherboard pairing, and noise profile..."
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)}
                        className="w-full bg-[#111726] border border-slate-700 rounded-lg p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                      />

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs transition"
                      >
                        PUBLISH BENCHMARK REVIEW
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
