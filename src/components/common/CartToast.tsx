import type { FC } from 'react';
import { ArrowRight, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigation } from '../../context/NavigationContext';

export const CartToast: FC = () => {
  const {
    lastAddedNotice,
    dismissAddedNotice,
    cartErrorNotice,
    dismissErrorNotice,
    totalItems,
  } = useCart();
  const { navigate } = useNavigation();

  if (cartErrorNotice) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-[#FAF6F2] border border-rose-400 rounded-2xl shadow-2xl p-4 text-[#111111] animate-in slide-in-from-top-4 fade-in duration-300 motion-reduce:animate-none font-['Plus_Jakarta_Sans']"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0 text-rose-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <div className="text-xs font-bold text-rose-700 uppercase tracking-wider">
              Unable to Add Item
            </div>
            <p className="text-xs sm:text-sm text-[#333333] font-medium mt-1 leading-snug">
              {cartErrorNotice}
            </p>
          </div>
          <button
            type="button"
            onClick={dismissErrorNotice}
            aria-label="Dismiss error"
            className="text-[#888888] hover:text-[#111111] p-1 rounded-lg hover:bg-[#EEE9E5] transition cursor-pointer shrink-0 -mr-1 -mt-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!lastAddedNotice) return null;

  const { product, quantity } = lastAddedNotice;
  const imageSrc =
    product.image ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-[#FAF6F2] border border-[#C49B82]/60 rounded-2xl shadow-2xl p-4 text-[#111111] animate-in slide-in-from-top-4 fade-in duration-300 motion-reduce:animate-none font-['Plus_Jakarta_Sans']"
    >
      <div className="flex items-start gap-3">
        {/* Product Thumbnail */}
        <div className="w-13 h-13 rounded-xl bg-[#EEE9E5] border border-[#DFD4C8] overflow-hidden shrink-0 flex items-center justify-center p-1 relative">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-3 h-3 stroke-[3]" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <span>Added to Cart!</span>
          </div>

          <h4 className="font-bold text-xs sm:text-sm text-[#111111] truncate mt-0.5">
            {product.name}
          </h4>

          <div className="flex items-center gap-2 text-[11px] text-[#666666] mt-0.5">
            <span>+{quantity} item{quantity > 1 ? 's' : ''}</span>
            <span>•</span>
            <span className="font-semibold text-[#111111]">
              Cart total: {totalItems} item{totalItems === 1 ? '' : 's'}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-2.5">
            <button
              type="button"
              onClick={() => {
                dismissAddedNotice();
                navigate('checkout');
              }}
              className="h-8 px-3.5 rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[11px] tracking-wider uppercase transition flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
            >
              <span>View Cart</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={dismissAddedNotice}
              className="text-[11px] font-semibold text-[#777777] hover:text-[#111111] transition underline cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={dismissAddedNotice}
          aria-label="Close notification"
          className="text-[#888888] hover:text-[#111111] p-1 rounded-lg hover:bg-[#EEE9E5] transition cursor-pointer shrink-0 -mr-1 -mt-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
