import type { FC } from 'react';
import { useState } from 'react';
import { ChevronDown, CheckCircle2, ShoppingBag, Info, AlertCircle, Lock, ArrowRight, Trash2, Loader2 } from 'lucide-react';
import type { PageId } from '../electro/ElectroHeader';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatters';
import { calculateDiscountPricing } from '../../services/offersService';
import { BackButton } from '../common/BackButton';

interface CheckoutViewProps {
  onNavigate: (page: PageId) => void;
  onClearCart?: () => void;
}

export const CheckoutView: FC<CheckoutViewProps> = ({ onNavigate, onClearCart }) => {
  const { items, subtotal, clearCart, updateQuantity, removeFromCart, loading, error: cartError } = useCart();
  const { user, openAuthModal } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'online'>('cod');
  const [fullName, setFullName] = useState(() => user?.username || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Egypt');
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Clear Cart Dialog & In-flight states
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearActionError, setClearActionError] = useState<string | null>(null);

  // Egypt shipping calculation
  const shippingFee = items.length > 0 ? 120.0 : 0;
  const grandTotal = subtotal + shippingFee;

  const handleConfirmClearCart = async () => {
    if (isClearing) return;
    setIsClearing(true);
    setClearActionError(null);
    try {
      await clearCart();
      setShowClearConfirm(false);
      onClearCart?.();
    } catch (err: any) {
      console.error('Failed to clear cart:', err);
      setClearActionError(err.message || 'Unable to clear cart. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Add products before placing an order.');
      return;
    }

    if (!fullName.trim() || !phoneNumber.trim() || !address.trim()) {
      setErrorMessage('Please fill in your name, phone number, and delivery address.');
      return;
    }

    setErrorMessage(null);
    setOrderId(`#EH-${Math.floor(100000 + Math.random() * 900000)}-2026`);
    setIsOrdered(true);
    await clearCart();
    onClearCart?.();
  };

  return (
    <div className="bg-[#FBF6F0] min-h-[calc(100vh-140px)] py-6 sm:py-8 lg:py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14">
        {/* Back Button */}
        <div>
          <BackButton label="Back to Products" />
        </div>

        {/* Title */}
        <h1 className="text-[26px] sm:text-[38px] lg:text-[46px] font-bold text-[#111111] leading-tight mb-6 sm:mb-8">
          Checkout
        </h1>

        {/* Backend Note Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-[#EEE9E5] border border-[#DFD4C8] text-xs text-[#555555] flex items-center gap-3">
          <Info className="w-5 h-5 text-[#C49B82] shrink-0" />
          <div>
            <strong>Catalog Order Dispatch:</strong> Products in your cart are synchronized with live backend catalog pricing and inventory.
          </div>
        </div>

        {!user ? (
          <div className="max-w-2xl mx-auto my-12 p-10 sm:p-14 rounded-3xl bg-[#EEE9E5] border border-[#E5D7CA] text-center space-y-6 shadow-xs">
            <div className="w-18 h-18 rounded-full bg-[#FAF6F2] border border-[#DFD4C8] flex items-center justify-center mx-auto text-[#C49B82] shadow-2xs">
              <Lock className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h2 className="text-[22px] sm:text-[26px] font-bold text-[#111111] tracking-tight">
                Sign In to View Your Cart
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto leading-relaxed">
                Your shopping cart is synchronized directly with your account on the server. Please sign in or create an account to view your items, update quantities, and place orders.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="h-12 px-8 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase flex items-center gap-2 transition active:scale-98 shadow-xs cursor-pointer"
              >
                <span>Sign In to Your Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="h-12 px-6 rounded-xl bg-[#FAF6F2] hover:bg-[#EAE0D5] border border-[#DFD4C8] text-[#111111] font-semibold text-[13px] tracking-[0.06em] uppercase transition"
              >
                Explore Products
              </button>
            </div>
          </div>
        ) : loading && items.length === 0 ? (
          <div className="max-w-md mx-auto my-12 p-10 rounded-3xl bg-[#EEE9E5] border border-[#E5D7CA] text-center space-y-4 animate-pulse">
            <ShoppingBag className="w-12 h-12 text-[#C49B82]/50 mx-auto" />
            <h2 className="text-xl font-bold text-[#111111]">Loading Your Cart...</h2>
            <p className="text-xs sm:text-sm text-[#555555]">
              Connecting to your account and synchronizing cart items...
            </p>
          </div>
        ) : isOrdered ? (
          <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-[#EEE9E5] border border-[#C49B82]/40 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#C49B82]/20 text-[#C49B82] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">Order Placed Successfully!</h2>
            <p className="text-sm text-[#444444] font-medium">
              Thank you for shopping with Electro Hub. Your order confirmation and receipt
              has been recorded.
            </p>
            <div className="p-4 rounded-xl bg-[#FAF6F2] border border-[#DFD4C8] text-xs text-[#111111] space-y-1 font-mono text-left">
              <div>ORDER ID: {orderId}</div>
              <div>RECIPIENT: {fullName}</div>
              <div>DELIVERY: {address}, {city}, {governorate}</div>
              <div>TOTAL CHARGED: {formatPrice(grandTotal)}</div>
              <div>PAYMENT: {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Online Payment'}</div>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="mt-4 px-8 py-3 rounded-lg bg-[#CCA893] text-[#1A1A1A] font-bold text-xs uppercase tracking-wider hover:bg-[#C29D87] transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="max-w-md mx-auto my-12 p-10 rounded-3xl bg-[#EEE9E5] border border-[#E5D7CA] text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-[#C49B82] mx-auto" />
            <h2 className="text-xl font-bold text-[#111111]">Your Cart is Empty</h2>
            <p className="text-xs sm:text-sm text-[#555555]">
              You don't have any items in your cart yet. Explore our live catalog to add electronics.
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="mt-2 px-6 py-2.5 rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#111111] font-bold text-xs uppercase tracking-wider"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder}>
            {(errorMessage || cartError) && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{cartError || errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
              
              {/* ========================================================= */}
              {/* LEFT COLUMN: SHIPPING DETAILS & PAYMENT METHOD */}
              {/* ========================================================= */}
              <div className="lg:col-span-5 space-y-6">
                {/* Shipping Details Section */}
                <div className="space-y-3.5">
                  <div className="text-[13px] font-medium tracking-[0.08em] text-[#C49B82] uppercase">
                    SHIPPING DETAILS
                  </div>

                  {/* Row: Full name & Phone number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-[46px] rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] px-4 text-xs sm:text-sm text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#C49B82]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full h-[46px] rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] px-4 text-xs sm:text-sm text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#C49B82]"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Address (Street, Building, Flat)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full h-[46px] rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] px-4 text-xs sm:text-sm text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#C49B82]"
                    />
                  </div>

                  {/* Row: City & Governorate */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="City / Area"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-[46px] rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] px-4 text-xs sm:text-sm text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#C49B82]"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Governorate"
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="w-full h-[46px] rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] px-4 text-xs sm:text-sm text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#C49B82]"
                    />
                  </div>

                  {/* Row: Postal code & Country Select */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Postal code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full h-[46px] rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] px-4 text-xs sm:text-sm text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#C49B82]"
                    />
                    <div className="relative">
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full h-[46px] rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] px-4 pr-10 text-xs sm:text-sm text-[#111111] appearance-none focus:outline-none focus:border-[#C49B82] cursor-pointer"
                      >
                        <option value="Egypt">Egypt</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#555555] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Payment Method Section */}
                <div className="space-y-3 pt-2">
                  <div className="text-[13px] font-medium tracking-[0.08em] text-[#C49B82] uppercase">
                    PAYMENT METHOD
                  </div>

                  {/* Radio 1: Cash on delivery */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center gap-3.5 p-3.5 rounded-lg border cursor-pointer transition ${
                      paymentMethod === 'cod'
                        ? 'bg-[#FAF6F2] border-[#DFD4C8] ring-1 ring-[#C49B82]/50'
                        : 'bg-[#FAF6F2] border-[#DFD4C8]'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border border-[#888888] flex items-center justify-center shrink-0">
                      {paymentMethod === 'cod' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#C49B82]" />
                      )}
                    </div>
                    <span className="text-[13px] sm:text-[14px] text-[#111111] font-medium">
                      Cash on delivery
                    </span>
                  </label>

                  {/* Radio 2: Credit / Debit card */}
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center gap-3.5 p-3.5 rounded-lg border cursor-pointer transition ${
                      paymentMethod === 'card'
                        ? 'bg-[#FAF6F2] border-[#DFD4C8] ring-1 ring-[#C49B82]/50'
                        : 'bg-[#FAF6F2] border-[#DFD4C8]'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border border-[#888888] flex items-center justify-center shrink-0">
                      {paymentMethod === 'card' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#C49B82]" />
                      )}
                    </div>
                    <span className="text-[13px] sm:text-[14px] text-[#111111] font-medium">
                      Credit / Debit card
                    </span>
                  </label>

                  {/* Radio 3: Online payment */}
                  <label
                    onClick={() => setPaymentMethod('online')}
                    className={`flex items-center gap-3.5 p-3.5 rounded-lg border cursor-pointer transition ${
                      paymentMethod === 'online'
                        ? 'bg-[#FAF6F2] border-[#DFD4C8] ring-1 ring-[#C49B82]/50'
                        : 'bg-[#FAF6F2] border-[#DFD4C8]'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border border-[#888888] flex items-center justify-center shrink-0">
                      {paymentMethod === 'online' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#C49B82]" />
                      )}
                    </div>
                    <span className="text-[13px] sm:text-[14px] text-[#111111] font-medium">
                      Online payment (InstaPay / Mobile Wallet)
                    </span>
                  </label>
                </div>
              </div>
              {/* ========================================================= */}
              {/* RIGHT COLUMN: ORDER SUMMARY WITH REAL CART PRODUCTS */}
              {/* ========================================================= */}
              <div className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between gap-2 pb-1 border-b border-[#EAE0D5]">
                  <div className="text-[13px] font-bold tracking-[0.08em] text-[#111111] uppercase">
                    ORDER SUMMARY ({items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'})
                  </div>
                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setClearActionError(null);
                        setShowClearConfirm(true);
                      }}
                      disabled={isClearing || loading}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      title="Clear all items from your cart"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Cart</span>
                    </button>
                  )}
                </div>

                {/* Product Items List */}
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {items.map((item) => {
                    const pricing = calculateDiscountPricing(item.product);
                    const unitPrice = pricing.hasDiscount ? pricing.discountedPrice : pricing.originalPrice;
                    return (
                      <div key={item.product.id} className="flex items-center gap-3 py-2 border-b border-[#EAE0D5]/50">
                        <div className="w-14 h-14 rounded-lg bg-[#EEE9E5] p-1 flex items-center justify-center shrink-0">
                          <img
                            src={item.product.image || '/assets/checkout-item-thumb.jpg'}
                            alt={item.product.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/checkout-item-thumb.jpg';
                            }}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[12px] font-medium text-[#111111] line-clamp-1 leading-snug">
                            {item.product.name}
                          </div>
                          <div className="text-[11px] text-[#666666] flex items-center gap-2 mt-0.5">
                            <span>Qty: {item.quantity}</span>
                            <div className="inline-flex items-center gap-1 border border-[#DFD4C8] rounded px-1 bg-[#FAF6F2]">
                              <button
                                type="button"
                                disabled={loading}
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="px-1 text-xs hover:text-[#C49B82] disabled:opacity-50 cursor-pointer"
                              >
                                -
                              </button>
                              <button
                                type="button"
                                disabled={loading}
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="px-1 text-xs hover:text-[#C49B82] disabled:opacity-50 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                            <span>× {formatPrice(unitPrice)}</span>
                            {pricing.hasDiscount && (
                              <span className="line-through text-[#999999] text-[10px]">
                                {formatPrice(pricing.originalPrice)}
                              </span>
                            )}
                          </div>
                          <div className="text-[12px] font-bold text-[#C49B82] mt-0.5">
                            {formatPrice(unitPrice * item.quantity)}
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-xs text-red-500 hover:text-red-700 px-1 disabled:opacity-50 cursor-pointer"
                          title="Remove item"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-[#EAE0D5] pt-3 space-y-2 text-[13px] text-[#111111]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold">{formatPrice(shippingFee)}</span>
                  </div>
                  <div className="border-t border-[#EAE0D5] pt-2 flex justify-between text-[15px] font-bold text-[#111111]">
                    <span>Total</span>
                    <span className="text-[#C49B82]">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Place Order CTA Button */}
                <button
                  type="submit"
                  className="w-full h-[46px] rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase transition active:scale-98 shadow-xs cursor-pointer"
                >
                  PLACE ORDER
                </button>
              </div>

            </div>
          </form>
        )}
      </div>

      {/* Clear Cart Confirmation Dialog */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-cart-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isClearing) {
              setShowClearConfirm(false);
              setClearActionError(null);
            }
          }}
        >
          <div
            className="w-full max-w-md bg-[#FAF6F2] rounded-3xl border border-[#DFD4C8] shadow-2xl p-6 sm:p-8 space-y-5 text-[#111111] relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2
                  id="clear-cart-modal-title"
                  className="text-lg sm:text-xl font-bold tracking-tight text-[#111111]"
                >
                  Clear Shopping Cart?
                </h2>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                  Are you sure you want to remove all {items.length} item{items.length === 1 ? '' : 's'} from your shopping cart? This action cannot be undone.
                </p>
              </div>
            </div>

            {clearActionError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{clearActionError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isClearing}
                onClick={() => {
                  setShowClearConfirm(false);
                  setClearActionError(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#EEE9E5] hover:bg-[#E5D7CA] text-[#111111] font-bold text-xs uppercase tracking-wider transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isClearing}
                onClick={handleConfirmClearCart}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isClearing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Clearing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Clear All</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
