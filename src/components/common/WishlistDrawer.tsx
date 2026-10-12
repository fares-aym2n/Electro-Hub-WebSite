import type { FC } from 'react';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import type { Product } from '../../types';
import { ImageWithFallback } from './ImageWithFallback';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onAddToCart,
  onRemoveFromWishlist,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['Plus_Jakarta_Sans']">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0b101c] border-l border-cyan-500/30 text-slate-100 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                SAVED HARDWARE
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {items.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-24 text-slate-400">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-30 text-rose-400" />
                <p className="font-medium text-base mb-1 font-['Space_Grotesk'] text-white">
                  NO HARDWARE SAVED YET
                </p>
                <p className="text-xs font-mono max-w-xs mx-auto">
                  Click the heart icon on any component to save it for your next build review.
                </p>
              </div>
            ) : (
              items.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 rounded-xl bg-[#0e1424] border border-slate-800 flex gap-3.5 items-center justify-between"
                >
                  <div
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="w-16 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shrink-0 cursor-pointer"
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      category={product.category}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {product.brand}
                    </span>
                    <h4
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="text-xs font-bold text-white truncate cursor-pointer hover:text-cyan-300 mb-1"
                    >
                      {product.name}
                    </h4>
                    <div className="text-xs font-mono font-bold text-cyan-400">
                      ${product.price}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onAddToCart(product);
                        onRemoveFromWishlist(product);
                      }}
                      className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition shadow-sm"
                      title="Move to Cart"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(product)}
                      className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-800">
              <button
                onClick={() => {
                  items.forEach((item) => onAddToCart(item));
                  onClose();
                }}
                className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-['Space_Grotesk'] text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition"
              >
                MOVE ALL ({items.length}) TO MANIFEST CART
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
