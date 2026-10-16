import type { FC } from 'react';
import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Copy,
  Check,
  Home,
  Clock,
  Sparkles,
  Package,
  MapPin,
} from 'lucide-react';
import type { PageId } from '../../context/NavigationContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { BackButton } from '../common/BackButton';
import { orderService, type UserOrder } from '../../services/orderService';
import { formatPrice } from '../../utils/formatters';

interface PaymentSuccessViewProps {
  onNavigate: (page: PageId) => void;
}

export const PaymentSuccessView: FC<PaymentSuccessViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const [copied, setCopied] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [orderReference, setOrderReference] = useState<string>('');
  const [verifiedOrder, setVerifiedOrder] = useState<UserOrder | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);

  useEffect(() => {
    // Read Stripe session_id or order reference from URL query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const sId = searchParams.get('session_id') || searchParams.get('sessionId') || '';
    const oId = searchParams.get('orderId') || searchParams.get('order_id') || '';

    setSessionId(sId);
    if (oId) {
      setOrderReference(`#EH-${oId}-2026`);
    } else {
      const hash = Math.floor(100000 + Math.random() * 900000);
      setOrderReference(`#EH-${hash}-2026`);
    }

    // Synchronize client cart state after checkout
    refreshCart().catch(() => {});

    // Backend order verification: check authenticated user's orders
    let isCancelled = false;
    async function verifyFromBackend() {
      setIsVerifying(true);
      try {
        const userOrders = await orderService.getMyOrders();
        if (isCancelled || !Array.isArray(userOrders) || userOrders.length === 0) {
          setIsVerifying(false);
          return;
        }

        // Match order by orderId or stripeSessionId, or take the most recent order
        let matched: UserOrder | undefined;
        if (oId) {
          const numId = parseInt(oId, 10);
          matched = userOrders.find((o) => o.id === numId);
        }
        if (!matched && sId) {
          matched = userOrders.find((o) => o.stripeSessionId === sId);
        }
        if (!matched) {
          // Most recent order
          matched = userOrders[0];
        }

        if (matched) {
          setVerifiedOrder(matched);
          setOrderReference(`#EH-${matched.id}-2026`);
        }
      } catch (err) {
        console.warn('Backend order verification fetch:', err);
      } finally {
        if (!isCancelled) setIsVerifying(false);
      }
    }

    verifyFromBackend();

    return () => {
      isCancelled = true;
    };
  }, [refreshCart]);

  const handleCopyReference = () => {
    const textToCopy = orderReference || sessionId;
    if (textToCopy && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const [currentDate] = useState(() =>
    new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  );

  const isPaid = verifiedOrder?.paymentStatus === 'paid';

  return (
    <div className="bg-[#FBF6F0] min-h-[calc(100vh-140px)] py-8 lg:py-14 text-[#111111] font-['Plus_Jakarta_Sans']">
      <div className="max-w-[800px] mx-auto px-4 sm:px-8 space-y-6 sm:space-y-8">
        {/* Back Navigation */}
        <div>
          <BackButton label="Back to Products" onClick={() => onNavigate('products')} />
        </div>

        {/* Main Success Container Card */}
        <div className="rounded-3xl bg-[#EEE9E5] border border-[#E5D7CA] p-6 sm:p-10 lg:p-12 text-center space-y-6 sm:space-y-8 shadow-xs">
          {/* Success Icon: Checkmark inside a green circle */}
          <div className="flex justify-center">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-emerald-600 shadow-sm animate-in zoom-in-75 duration-300"
              aria-label="Payment Successful"
            >
              <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.2]" />
            </div>
          </div>

          {/* Heading and Primary Confirmation Message */}
          <div className="space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F2] border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {isPaid
                  ? 'Payment Verified & Confirmed'
                  : isVerifying
                  ? 'Verifying Order Status...'
                  : 'Payment Session Received'}
              </span>
            </div>

            <h1 className="text-[26px] sm:text-[34px] lg:text-[40px] font-bold text-[#111111] tracking-tight leading-tight">
              Payment Successful!
            </h1>

            <p className="text-sm sm:text-base text-[#444444] max-w-lg mx-auto leading-relaxed">
              Your payment has been processed successfully. Thank you for your purchase.
            </p>
          </div>

          {/* Order Confirmation Receipt Block */}
          <div className="rounded-2xl bg-[#FAF6F2] border border-[#DFD4C8] p-5 sm:p-6 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DFD4C8]/80 text-xs font-bold text-[#777777] uppercase tracking-wider">
              <span>Order Confirmation</span>
              <span className="flex items-center gap-1 text-[#555555]">
                <Clock className="w-3.5 h-3.5" />
                {currentDate}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
              We have received your payment and our logistics team is preparing your hardware
              shipment. A detailed confirmation receipt with warranty documentation has been
              dispatched
              {user?.email ? ` to ${user.email}` : ' to your account email address'}.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wide block">
                  Confirmation Reference
                </span>
                <span className="font-mono font-bold text-sm text-[#111111] select-all">
                  {orderReference}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyReference}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EEE9E5] hover:bg-[#E5D7CA] text-[#111111] font-semibold text-xs transition cursor-pointer border border-[#DFD4C8]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#C49B82]" />
                    <span>Copy Reference</span>
                  </>
                )}
              </button>
            </div>

            {/* Verified Backend Order Info */}
            {verifiedOrder && (
              <div className="mt-3 pt-3 border-t border-[#DFD4C8]/70 space-y-2 text-xs">
                <div className="flex justify-between items-center text-[#555555]">
                  <span>Order Status:</span>
                  <span className="font-bold text-[#111111] uppercase tracking-wider">
                    {verifiedOrder.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#555555]">
                  <span>Payment Status:</span>
                  <span className="font-bold text-emerald-700 uppercase tracking-wider">
                    {verifiedOrder.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#555555]">
                  <span>Total Amount:</span>
                  <span className="font-bold text-base font-mono text-[#111111]">
                    {formatPrice(Number(verifiedOrder.totalPrice))}
                  </span>
                </div>
                {verifiedOrder.shippingAddress && (
                  <div className="flex justify-between items-start text-[#555555] pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C49B82]" />
                      Shipping:
                    </span>
                    <span className="font-medium text-[#111111] text-right max-w-xs">
                      {verifiedOrder.shippingAddress}, {verifiedOrder.city}
                    </span>
                  </div>
                )}
              </div>
            )}

            {sessionId && (
              <div className="pt-2 border-t border-[#DFD4C8]/60 text-[11px] text-[#777777] font-mono break-all">
                <span className="font-sans font-semibold">Stripe Session: </span>
                {sessionId}
              </div>
            )}
          </div>

          {/* Delivery & Warranty Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="p-4 rounded-xl bg-[#FAF6F2]/80 border border-[#DFD4C8] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#EEE9E5] text-[#C49B82] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#111111] uppercase tracking-wide">
                  Express Dispatch
                </div>
                <div className="text-[11px] text-[#666666] truncate">
                  Prompt courier transit across Egypt
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF6F2]/80 border border-[#DFD4C8] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#EEE9E5] text-[#C49B82] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#111111] uppercase tracking-wide">
                  Official Warranty
                </div>
                <div className="text-[11px] text-[#666666] truncate">
                  100% genuine hardware coverage
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: View in My Orders, Continue Shopping, Home */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className="w-full sm:w-auto h-12 px-7 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase flex items-center justify-center gap-2 transition active:scale-98 shadow-xs cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>View in My Orders</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="w-full sm:w-auto h-12 px-6 rounded-xl bg-[#FAF6F2] hover:bg-[#EAE0D5] border border-[#DFD4C8] text-[#111111] font-semibold text-[13px] tracking-[0.06em] uppercase flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#777777]" />
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4 text-[#777777]" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto h-12 px-5 rounded-xl bg-[#FAF6F2] hover:bg-[#EAE0D5] border border-[#DFD4C8] text-[#111111] font-semibold text-[13px] tracking-[0.06em] uppercase flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#777777]" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
