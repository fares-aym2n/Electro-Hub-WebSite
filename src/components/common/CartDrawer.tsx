import type { FC } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import type { CartItem } from '../../types';
import { ImageWithFallback } from './ImageWithFallback';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  theme: 'cyberforge' | 'nordic' | 'apex';
}

export const CartDrawer: FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  theme,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100
  );
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Theme styling helpers
  const isDark = theme === 'cyberforge' || theme === 'apex';
  const bgClass =
    theme === 'cyberforge'
      ? 'bg-[#0b101c] text-slate-100 border-l border-cyan-500/30'
      : theme === 'apex'
      ? 'bg-[#080a11] text-slate-100 border-l border-amber-500/30'
      : 'bg-white text-slate-900 border-l border-slate-200';

  const accentButtonClass =
    theme === 'cyberforge'
      ? 'bg-cyan-400 hover:bg-cyan-300 text-black font-["Space_Grotesk"]'
      : theme === 'apex'
      ? 'bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 text-black font-["Syne"]'
      : 'bg-slate-950 hover:bg-slate-800 text-white font-["Plus_Jakarta_Sans"]';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen max-w-md ${bgClass} shadow-2xl flex flex-col`}>
          {/* Header */}
          <div className="p-5 border-b border-slate-700/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag
                className={`w-5 h-5 ${
                  theme === 'cyberforge'
                    ? 'text-cyan-400'
                    : theme === 'apex'
                    ? 'text-amber-400'
                    : 'text-slate-900'
                }`}
              />
              <h2 className="text-lg font-bold">
                {theme === 'cyberforge'
                  ? 'HARDWARE MANIFEST'
                  : theme === 'apex'
                  ? 'RESERVED SPECIMENS'
                  : 'Shopping Bag'}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800/40 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-5 py-3 bg-slate-500/10 border-b border-slate-700/20 text-xs">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-mono text-[11px] text-slate-400">
                {remainingForFreeShipping > 0
                  ? `Add $${remainingForFreeShipping.toFixed(2)} for Free Courier Shipping`
                  : '🎉 You have unlocked Free Courier Delivery!'}
              </span>
              <span className="font-mono font-bold">
                {progressToFreeShipping.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-slate-700/40 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  theme === 'cyberforge'
                    ? 'bg-cyan-400'
                    : theme === 'apex'
                    ? 'bg-amber-400'
                    : 'bg-blue-600'
                }`}
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-24 text-slate-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="font-medium text-base mb-1">Your cart is empty</p>
                <p className="text-xs font-mono max-w-xs mx-auto">
                  Select high-performance components from our catalog to build your manifest.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className={`p-3 rounded-xl border flex gap-3.5 items-center ${
                    isDark
                      ? 'bg-slate-900/50 border-slate-800'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-700/40">
                    <ImageWithFallback
                      src={item.product.image}
                      alt={item.product.name}
                      category={item.product.category}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      {item.product.brand}
                    </div>
                    <h4 className="text-xs font-bold truncate mb-1">
                      {item.product.name}
                    </h4>
                    <div className="text-xs font-mono font-semibold">
                      ${item.product.price.toFixed(2)}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-slate-700/50 rounded-md">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-400 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-700/30 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-slate-200">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Shipping</span>
                  <span className="font-mono text-emerald-400">
                    {subtotal >= freeShippingThreshold ? 'FREE' : '$14.99'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-700/30">
                  <span>Total</span>
                  <span className="font-mono">
                    $
                    {(
                      subtotal +
                      (subtotal >= freeShippingThreshold ? 0 : 14.99)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-98 shadow-lg ${accentButtonClass}`}
              >
                PROCEED TO CHECKOUT
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit Encrypted Hardware Order Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
