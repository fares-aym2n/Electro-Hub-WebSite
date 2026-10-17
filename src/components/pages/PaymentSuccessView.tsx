import type { FC } from 'react';
import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Package,
  Receipt,
  X,
  Clock,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import type { PageId } from '../../context/NavigationContext';
import { useCart } from '../../context/CartContext';
import { orderService, type UserOrder } from '../../services/orderService';
import { formatPrice } from '../../utils/formatters';

interface PaymentSuccessViewProps {
  onNavigate: (page: PageId) => void;
}

export const PaymentSuccessView: FC<PaymentSuccessViewProps> = ({ onNavigate }) => {
  const { refreshCart } = useCart();
  const [verifiedOrder, setVerifiedOrder] = useState<UserOrder | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);
  const [orderReference, setOrderReference] = useState<string>('');

  useEffect(() => {
    // Read Stripe session_id or order reference from URL query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const sId = searchParams.get('session_id') || searchParams.get('sessionId') || '';
    const oId = searchParams.get('orderId') || searchParams.get('order_id') || '';

    if (oId) {
      setOrderReference(`#EH-${oId}-2026`);
    } else {
      setOrderReference('');
    }

    // Refresh client cart state after checkout
    refreshCart().catch(() => {});

    // Backend order verification: check authenticated user's orders
    let isCancelled = false;
    async function verifyFromBackend() {
      setIsVerifying(true);
      try {
        let matched: UserOrder | undefined;

        // 1. If explicit orderId is present in URL, try fetching direct order details
        if (oId) {
          const numId = parseInt(oId, 10);
          if (!isNaN(numId) && numId > 0) {
            try {
              const directOrder = await orderService.getOrderById(numId);
              if (directOrder && directOrder.id) {
                matched = directOrder;
              }
            } catch {
              // Ignore if non-admin or not found, fall through to user's order list
            }
          }
        }

        // 2. Fall back to authenticated user's full order list
        if (!matched) {
          const userOrders = await orderService.getMyOrders();
          if (Array.isArray(userOrders) && userOrders.length > 0) {
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
          }
        }

        if (!isCancelled && matched) {
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

  // Payment correctness evaluation
  const paymentStatus = (verifiedOrder?.paymentStatus || '').toLowerCase();
  const isPaid = paymentStatus === 'paid';
  const isPending = paymentStatus === 'pending';

  // Format order date
  const formattedDate = verifiedOrder?.createdAt
    ? new Date(verifiedOrder.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#FBF6F0] flex items-center justify-center p-4 sm:p-6 font-['Plus_Jakarta_Sans'] text-[#111111]">
      {/* Centered Success Card */}
      <div className="w-full max-w-md bg-[#EEE9E5] border border-[#E5D7CA] rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-xs">
        {/* Compact Success Icon */}
        <div className="flex justify-center">
          {isVerifying ? (
            <div
              className="w-14 h-14 rounded-full bg-[#FAF6F2] border border-[#DFD4C8] flex items-center justify-center text-[#C49B82] shadow-2xs"
              aria-label="Verifying Payment"
            >
              <RefreshCw className="w-6 h-6 animate-spin text-[#C49B82]" />
            </div>
          ) : isPending ? (
            <div
              className="w-14 h-14 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-2xs"
              aria-label="Payment Pending"
            >
              <Clock className="w-7 h-7" />
            </div>
          ) : (
            <div
              className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-400 flex items-center justify-center text-emerald-600 shadow-2xs"
              aria-label="Payment Successful"
            >
              <CheckCircle2 className="w-7 h-7 stroke-[2.4]" />
            </div>
          )}
        </div>

        {/* Short Heading and Brief Confirmation Sentence */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#111111] tracking-tight">
            {isPending ? 'Payment Processing' : 'Payment Successful!'}
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed max-w-sm mx-auto">
            {isPending
              ? 'Your payment was submitted and is awaiting confirmation from our payment provider.'
              : 'Your payment has been processed successfully. Thank you for your purchase.'}
          </p>
        </div>

        {/* Order Reference Badge (when available) */}
        {(orderReference || formattedDate) && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF6F2] border border-[#DFD4C8] text-[11px] font-mono font-semibold text-[#666666]">
            {orderReference && <span>{orderReference}</span>}
            {orderReference && formattedDate && <span>•</span>}
            {formattedDate && <span className="font-sans">{formattedDate}</span>}
          </div>
        )}

        {/* Action Buttons: View Receipt, Continue Shopping, My Orders */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsReceiptOpen(true)}
            className="h-11 px-4 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-98 shadow-xs cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>View Receipt</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('products')}
            className="h-11 px-4 rounded-xl bg-[#FAF6F2] hover:bg-[#EAE0D5] border border-[#DFD4C8] text-[#111111] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#777777]" />
            <span>Continue Shopping</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="h-11 px-3.5 rounded-xl bg-transparent hover:bg-[#FAF6F2] text-[#555555] hover:text-[#111111] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
            title="My Orders"
          >
            <Package className="w-4 h-4" />
            <span className="sm:hidden">My Orders</span>
          </button>
        </div>
      </div>

      {/* Compact Receipt / Order Details Modal */}
      {isReceiptOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-[#EEE9E5] border border-[#E5D7CA] rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#DFD4C8]">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#C49B82]" />
                <h3 className="text-base sm:text-lg font-bold text-[#111111] tracking-tight">
                  Order Details & Receipt
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReceiptOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FAF6F2] hover:bg-[#E5D7CA] border border-[#DFD4C8] text-[#555555] hover:text-[#111111] flex items-center justify-center transition cursor-pointer"
                aria-label="Close receipt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            {verifiedOrder ? (
              <div className="space-y-4 text-xs">
                {/* Meta Summary */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#FAF6F2] border border-[#DFD4C8]">
                  <div>
                    <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider block">
                      Order Reference
                    </span>
                    <span className="font-mono font-bold text-sm text-[#111111]">
                      {orderReference || `#EH-${verifiedOrder.id}-2026`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider block">
                      Order Date
                    </span>
                    <span className="font-semibold text-xs text-[#111111]">
                      {formattedDate || 'Recent'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider block">
                      Payment Status
                    </span>
                    <span
                      className={`font-bold text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {verifiedOrder.paymentStatus || 'Processing'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider block">
                      Order Status
                    </span>
                    <span className="font-bold text-[11px] uppercase tracking-wider text-[#111111] mt-0.5 block">
                      {verifiedOrder.status || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Purchased Products List */}
                <div className="space-y-2">
                  <div className="font-bold text-[11px] text-[#777777] uppercase tracking-wider">
                    Purchased Items (
                    {verifiedOrder.orderItems?.length || 0})
                  </div>

                  {verifiedOrder.orderItems && verifiedOrder.orderItems.length > 0 ? (
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {verifiedOrder.orderItems.map((item) => {
                        const price = Number(item.unitPrice || 0);
                        const qty = item.quantity || 1;
                        const itemTotal = price * qty;
                        const imgSrc = item.product?.image || '/assets/sony-main.jpg';

                        return (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-xl bg-[#FAF6F2] border border-[#DFD4C8] flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-[#EEE9E5] border border-[#DFD4C8] overflow-hidden shrink-0 flex items-center justify-center p-1">
                                <img
                                  src={imgSrc}
                                  alt={item.productName}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/assets/sony-main.jpg';
                                  }}
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-[#111111] truncate text-xs">
                                  {item.productName}
                                </div>
                                <div className="text-[11px] text-[#666666]">
                                  Qty: {qty} × {formatPrice(price)}
                                </div>
                              </div>
                            </div>
                            <div className="font-mono font-bold text-xs text-[#111111] shrink-0">
                              {formatPrice(itemTotal)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[#FAF6F2] text-[#666666] text-center text-xs">
                      Item breakdown is being summarized by warehouse.
                    </div>
                  )}
                </div>

                {/* Shipping Destination if available */}
                {verifiedOrder.shippingAddress && (
                  <div className="p-3 rounded-xl bg-[#FAF6F2] border border-[#DFD4C8] flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#C49B82] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[11px] text-[#888888] uppercase tracking-wider">
                        Delivery Destination
                      </div>
                      <div className="text-xs text-[#111111] font-medium mt-0.5">
                        {verifiedOrder.shippingAddress}, {verifiedOrder.city},{' '}
                        {verifiedOrder.country}
                      </div>
                    </div>
                  </div>
                )}

                {/* Final Order Total */}
                <div className="p-3.5 rounded-2xl bg-[#111111] text-[#FAF6F2] flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider">
                    Total Paid / Billed
                  </span>
                  <span className="font-mono font-bold text-base text-[#CCA893]">
                    {formatPrice(Number(verifiedOrder.totalPrice || 0))}
                  </span>
                </div>
              </div>
            ) : (
              /* Graceful Fallback if backend details are unavailable */
              <div className="p-6 text-center space-y-3 bg-[#FAF6F2] rounded-2xl border border-[#DFD4C8]">
                <Package className="w-8 h-8 text-[#C49B82] mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#111111]">
                    Receipt Pending Confirmation
                  </h4>
                  <p className="text-xs text-[#666666] leading-relaxed max-w-sm mx-auto">
                    Your order details are currently being finalized on the server. You can view
                    your full verified order records in My Orders at any time.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsReceiptOpen(false);
                    onNavigate('orders');
                  }}
                  className="px-5 py-2 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-xs uppercase tracking-wider transition cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Go to My Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Modal Footer Close */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsReceiptOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#FAF6F2] hover:bg-[#EAE0D5] border border-[#DFD4C8] text-xs font-semibold text-[#111111] transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
