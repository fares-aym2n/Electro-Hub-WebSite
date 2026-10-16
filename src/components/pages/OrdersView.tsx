import type { FC } from 'react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  CreditCard,
  Banknote,
  RotateCcw,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  RefreshCw,
  Lock,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import type { PageId } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
import {
  orderService,
  type UserOrder,
  type OrderStatus,
  type PaymentStatus,
} from '../../services/orderService';
import { formatPrice } from '../../utils/formatters';
import { BackButton } from '../common/BackButton';

interface OrdersViewProps {
  onNavigate: (page: PageId) => void;
  onSelectProduct?: (productId: number) => void;
}

type FilterTab = 'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export const OrdersView: FC<OrdersViewProps> = ({ onNavigate, onSelectProduct }) => {
  const { user, isLoading: authLoading, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const fetchOrders = useCallback(async (isManualRefresh = false) => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await orderService.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load user orders:', err);
      setError(
        err.message ||
          'Unable to retrieve your order history. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading) {
      fetchOrders();
    }
  }, [authLoading, fetchOrders]);

  // Tab filtering
  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  const orderCounts = useMemo(() => {
    const counts: Record<FilterTab, number> = {
      all: orders.length,
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((o) => {
      if (counts[o.status as FilterTab] !== undefined) {
        counts[o.status as FilterTab]++;
      }
    });
    return counts;
  }, [orders]);

  // Format order creation timestamp
  const formatOrderDate = (dateString?: string) => {
    if (!dateString) return 'Recent';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  // Status badge styling
  const renderOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Confirmed</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Shipped</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Delivered</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Cancelled</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending</span>
          </span>
        );
    }
  };

  // Payment status badge styling
  const renderPaymentStatusBadge = (status: PaymentStatus, method: string) => {
    const methodLabel = method === 'card' ? 'Stripe Card' : 'Cash on Delivery';

    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Paid ({methodLabel})</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Payment Failed</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-300">
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Refunded</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Payment Pending ({methodLabel})</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#FBF6F0] text-[#111111] pb-24 font-['Plus_Jakarta_Sans']">
      {/* 1. Breadcrumbs */}
      <div className="border-b border-[#E5D7CA] bg-[#FAF6F2] py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14 flex items-center justify-between text-xs font-semibold text-[#555555]">
          <div className="flex items-center gap-2">
            <span
              onClick={() => onNavigate('home')}
              className="hover:text-[#C49B82] cursor-pointer transition uppercase"
            >
              Home
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#AAAAAA]" />
            <span className="text-[#111111] uppercase">Order History</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#777777]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authenticated Customer Dashboard</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14 pt-6 sm:pt-8">
        {/* Back Navigation */}
        <div className="mb-2">
          <BackButton label="Back to Shopping" onClick={() => onNavigate('products')} />
        </div>

        {/* 2. Page Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#DFD4C8]">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C49B82]">
                Your Purchases
              </span>
              {user && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EEE9E5] border border-[#DFD4C8] font-mono font-bold text-[#111111]">
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              )}
            </div>
            <h1 className="text-[28px] sm:text-[36px] font-bold text-[#111111] tracking-tight leading-tight mt-1">
              My Orders
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] mt-1 max-w-xl">
              Track active hardware shipments, inspect verified invoices, and review your order
              details.
            </p>
          </div>

          {user && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fetchOrders(true)}
                disabled={loading || refreshing}
                className="px-4 py-2.5 rounded-xl bg-[#FAF6F2] hover:bg-[#E5D7CA] border border-[#DFD4C8] text-xs font-bold text-[#111111] transition flex items-center gap-2 uppercase tracking-wider shadow-2xs cursor-pointer disabled:opacity-50"
                title="Refresh Order List"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-[#C49B82] ${refreshing ? 'animate-spin' : ''}`}
                />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="px-5 py-2.5 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* 3. Loading Skeleton */}
        {authLoading || loading ? (
          <div className="py-10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#777777] uppercase tracking-wider">
              <RefreshCw className="w-4 h-4 animate-spin text-[#C49B82]" />
              <span>Fetching your order records from server...</span>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-3xl bg-[#EEE9E5] border border-[#E5D7CA] p-6 sm:p-8 animate-pulse space-y-4"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-[#DFD4C8]">
                    <div className="h-5 bg-[#DFD4C8] rounded w-48"></div>
                    <div className="h-6 bg-[#DFD4C8] rounded-full w-24"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="h-12 bg-[#DFD4C8] rounded-xl"></div>
                    <div className="h-12 bg-[#DFD4C8] rounded-xl"></div>
                    <div className="h-12 bg-[#DFD4C8] rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !user ? (
          /* 4. Unauthenticated State */
          <div className="rounded-3xl bg-[#EEE9E5] border border-[#E5D7CA] p-12 sm:p-16 text-center max-w-2xl mx-auto my-12 space-y-6 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#FAF6F2] border border-[#DFD4C8] flex items-center justify-center mx-auto text-[#C49B82] shadow-2xs">
              <Lock className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-[22px] sm:text-[26px] font-bold text-[#111111] tracking-tight">
                Sign In to View Your Orders
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto leading-relaxed">
                Your order history is private and tied directly to your authenticated customer
                profile. Please sign in to review your purchases and track shipments.
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
                onClick={() => onNavigate('products')}
                className="h-12 px-6 rounded-xl bg-[#FAF6F2] hover:bg-[#EAE0D5] border border-[#DFD4C8] text-[#111111] font-semibold text-[13px] tracking-[0.06em] uppercase transition cursor-pointer"
              >
                Browse Catalog
              </button>
            </div>
          </div>
        ) : error ? (
          /* 5. Error State */
          <div className="rounded-3xl bg-[#EEE9E5] border border-red-200 p-8 sm:p-12 text-center max-w-xl mx-auto my-12 space-y-5 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 flex items-center justify-center mx-auto text-red-600">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#111111]">Unable to Retrieve Orders</h3>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => fetchOrders(true)}
              className="px-6 py-2.5 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          /* 6. Empty Orders State */
          <div className="rounded-3xl bg-[#EEE9E5] border border-[#E5D7CA] p-12 sm:p-16 text-center max-w-2xl mx-auto my-12 space-y-6 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#FAF6F2] border border-[#DFD4C8] flex items-center justify-center mx-auto text-[#C49B82] shadow-2xs">
              <ShoppingBag className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-[22px] sm:text-[26px] font-bold text-[#111111] tracking-tight">
                No Orders Yet
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto leading-relaxed">
                You haven't placed any orders with Electro Hub yet. Explore our premier hardware
                spotlight, headphones, displays, and accessories to get started.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="h-12 px-8 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase inline-flex items-center gap-2 transition active:scale-98 shadow-xs cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>Start Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* 7. Live Orders List */
          <div className="py-6 space-y-6">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {(
                [
                  { id: 'all', label: 'All Orders' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'confirmed', label: 'Confirmed' },
                  { id: 'shipped', label: 'Shipped' },
                  { id: 'delivered', label: 'Delivered' },
                  { id: 'cancelled', label: 'Cancelled' },
                ] as const
              ).map((tab) => {
                const count = orderCounts[tab.id];
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer uppercase tracking-wider ${
                      isActive
                        ? 'bg-[#111111] text-[#FAF6F2] shadow-xs'
                        : 'bg-[#EEE9E5] hover:bg-[#E5D7CA] text-[#555555] border border-[#DFD4C8]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-[#CCA893] text-[#111111]'
                          : 'bg-[#FAF6F2] text-[#777777]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filtered Orders Count Alert if tab empty */}
            {filteredOrders.length === 0 ? (
              <div className="rounded-2xl bg-[#EEE9E5] border border-[#DFD4C8] p-8 text-center text-xs text-[#666666]">
                No orders found under the <strong className="capitalize">{activeTab}</strong> tab.
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const totalPrice = Number(order.totalPrice || 0);
                  const orderRef = `#EH-${order.id}-2026`;
                  const hasItems = Array.isArray(order.orderItems) && order.orderItems.length > 0;

                  return (
                    <div
                      key={order.id}
                      className="rounded-3xl bg-[#EEE9E5] border border-[#E5D7CA] overflow-hidden shadow-xs hover:border-[#C49B82]/50 transition duration-200"
                    >
                      {/* Order Card Header */}
                      <div className="p-5 sm:p-6 bg-[#FAF6F2]/80 border-b border-[#DFD4C8] flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                          <div className="space-y-0.5">
                            <div className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">
                              Order Reference
                            </div>
                            <div className="font-mono font-bold text-base text-[#111111]">
                              {orderRef}
                            </div>
                          </div>

                          <div className="h-8 w-px bg-[#DFD4C8] hidden sm:block" />

                          <div className="space-y-0.5">
                            <div className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">
                              Placed On
                            </div>
                            <div className="text-xs font-semibold text-[#555555]">
                              {formatOrderDate(order.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          {renderPaymentStatusBadge(order.paymentStatus, order.paymentMethod)}
                          {renderOrderStatusBadge(order.status)}
                        </div>
                      </div>

                      {/* Order Details & Items */}
                      <div className="p-5 sm:p-6 space-y-6">
                        {/* Meta Grid: Shipping, Recipient & Total */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#FAF6F2] border border-[#DFD4C8] text-xs">
                          {/* Recipient */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-[#888888] uppercase tracking-wider text-[10px]">
                              <User className="w-3.5 h-3.5 text-[#C49B82]" />
                              <span>Recipient</span>
                            </div>
                            <div className="font-bold text-[#111111]">{order.fullName}</div>
                            <div className="text-[#666666] flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#999999]" />
                              <span>{order.phoneNumber}</span>
                            </div>
                          </div>

                          {/* Delivery Address */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-[#888888] uppercase tracking-wider text-[10px]">
                              <MapPin className="w-3.5 h-3.5 text-[#C49B82]" />
                              <span>Delivery Address</span>
                            </div>
                            <div className="text-[#111111] font-medium leading-relaxed">
                              {order.shippingAddress}
                            </div>
                            <div className="text-[#666666]">
                              {order.city}, {order.country}
                            </div>
                          </div>

                          {/* Financials & Payment Method */}
                          <div className="space-y-1 sm:text-right">
                            <div className="font-bold text-[#888888] uppercase tracking-wider text-[10px]">
                              Total Amount
                            </div>
                            <div className="font-bold text-base sm:text-lg text-[#111111] font-mono">
                              {formatPrice(totalPrice)}
                            </div>
                            <div className="text-[11px] text-[#666666] flex sm:justify-end items-center gap-1">
                              {order.paymentMethod === 'card' ? (
                                <>
                                  <CreditCard className="w-3 h-3 text-[#C49B82]" />
                                  <span>Credit / Debit Card (Stripe)</span>
                                </>
                              ) : (
                                <>
                                  <Banknote className="w-3 h-3 text-emerald-600" />
                                  <span>Cash on Delivery</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Ordered Hardware Items */}
                        {hasItems && (
                          <div className="space-y-3">
                            <div className="text-xs font-bold uppercase tracking-wider text-[#777777] flex items-center justify-between">
                              <span>
                                Purchased Items ({order.orderItems.length})
                              </span>
                            </div>

                            <div className="divide-y divide-[#DFD4C8]/70 border border-[#DFD4C8] rounded-2xl bg-[#FAF6F2] overflow-hidden">
                              {order.orderItems.map((item) => {
                                const unitPrice = Number(item.unitPrice || 0);
                                const itemTotal = unitPrice * item.quantity;
                                const prodImage =
                                  item.product?.image ||
                                  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80';

                                return (
                                  <div
                                    key={item.id}
                                    className="p-3.5 sm:p-4 flex items-center justify-between gap-4"
                                  >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                      <div className="w-14 h-14 rounded-xl bg-[#EEE9E5] border border-[#DFD4C8] overflow-hidden shrink-0 flex items-center justify-center p-1">
                                        <img
                                          src={prodImage}
                                          alt={item.productName}
                                          className="w-full h-full object-contain"
                                          onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src =
                                              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80';
                                          }}
                                        />
                                      </div>

                                      <div className="min-w-0">
                                        <div className="font-bold text-xs sm:text-sm text-[#111111] truncate">
                                          {item.productName}
                                        </div>
                                        <div className="text-[11px] text-[#666666] flex items-center gap-2 mt-0.5">
                                          <span className="font-semibold">
                                            Qty: {item.quantity}
                                          </span>
                                          <span>•</span>
                                          <span>Unit: {formatPrice(unitPrice)}</span>
                                          {item.discount > 0 && (
                                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                              {item.discount}% OFF
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                      <div className="font-mono font-bold text-xs sm:text-sm text-[#111111]">
                                        {formatPrice(itemTotal)}
                                      </div>
                                      {item.product?.id && onSelectProduct && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            onSelectProduct(item.product!.id);
                                            onNavigate('product-details');
                                          }}
                                          className="text-[10px] text-[#C49B82] hover:underline font-bold uppercase tracking-wider inline-flex items-center gap-0.5 mt-1 cursor-pointer"
                                        >
                                          <span>View Product</span>
                                          <ExternalLink className="w-2.5 h-2.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="px-5 sm:px-6 py-3.5 bg-[#FAF6F2]/50 border-t border-[#DFD4C8] flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="text-[#777777] text-[11px]">
                          Need help with this order?{' '}
                          <button
                            type="button"
                            onClick={() => onNavigate('contact')}
                            className="font-bold text-[#111111] hover:text-[#C49B82] underline cursor-pointer"
                          >
                            Contact Support
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onNavigate('products')}
                            className="px-4 py-2 rounded-xl bg-[#FAF6F2] hover:bg-[#E5D7CA] border border-[#DFD4C8] text-[#111111] font-bold text-[11px] uppercase tracking-wider transition cursor-pointer"
                          >
                            Shop Similar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
