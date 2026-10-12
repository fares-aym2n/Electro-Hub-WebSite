import type { FC } from 'react';
import { X, Star, ShoppingCart, CheckCircle2 } from 'lucide-react';
import type { Product } from '../../types';
import { ImageWithFallback } from './ImageWithFallback';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  theme: 'cyberforge' | 'nordic' | 'apex';
}

export const QuickViewModal: FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  theme,
}) => {
  if (!product) return null;

  const isDark = theme === 'cyberforge' || theme === 'apex';
  const modalBg =
    theme === 'cyberforge'
      ? 'bg-[#0c1220] border-cyan-500/40 text-slate-100 shadow-[0_0_50px_rgba(6,182,212,0.25)]'
      : theme === 'apex'
      ? 'bg-[#090b14] border-amber-500/40 text-slate-100 shadow-[0_0_50px_rgba(212,175,55,0.2)]'
      : 'bg-white border-slate-200 text-slate-900 shadow-2xl';

  const buttonStyle =
    theme === 'cyberforge'
      ? 'bg-cyan-400 hover:bg-cyan-300 text-black font-["Space_Grotesk"]'
      : theme === 'apex'
      ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black font-["Syne"]'
      : 'bg-slate-950 hover:bg-slate-800 text-white font-["Plus_Jakarta_Sans"]';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div
        className={`relative rounded-2xl border max-w-3xl w-full p-6 sm:p-8 z-10 overflow-hidden ${modalBg}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-700/30 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="relative rounded-xl overflow-hidden h-72 sm:h-80 bg-slate-950 border border-slate-700/50">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              category={product.category}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/80 backdrop-blur text-cyan-400 border border-cyan-500/30">
                {product.badge}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                {product.brand} • {product.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-1 leading-snug">
                {product.name}
              </h2>
            </div>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center text-amber-400 gap-1">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-slate-200">{product.rating}</span>
                <span className="text-slate-500">({product.reviewsCount} reviews)</span>
              </div>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {product.stockCount} Units in Stock
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {product.description}
            </p>

            {/* Hardware Key Specs */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase font-bold text-slate-300">
                Verified Architecture Specs:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {product.specs.map((spec, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded border ${
                      isDark
                        ? 'bg-slate-900/60 border-slate-800'
                        : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="text-slate-500 text-[10px] uppercase">
                      {spec.label}
                    </div>
                    <div className="font-bold text-slate-200 truncate">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Action */}
            <div className="pt-4 border-t border-slate-700/40 flex items-center justify-between gap-4">
              <div>
                {product.originalPrice && (
                  <span className="text-xs font-mono text-slate-500 line-through block">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="text-2xl font-bold font-mono text-white">
                  ${product.price}
                </span>
              </div>

              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition active:scale-95 shadow-md ${buttonStyle}`}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
