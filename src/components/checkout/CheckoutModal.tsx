import type { FC } from 'react';
import { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Package,
  Copy,
} from 'lucide-react';
import type { CartItem, CheckoutForm } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: () => void;
}

export const CheckoutModal: FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    firstName: 'Alex',
    lastName: 'Vance',
    email: 'alex.vance@blackmesa.tech',
    phone: '+1 (555) 019-2831',
    address: '4200 Silicon Avenue, Suite 400',
    city: 'San Jose',
    state: 'CA',
    zip: '95134',
    shippingMethod: 'air',
    paymentMethod: 'card',
    cardNumber: '•••• •••• •••• 4090',
    cardExpiry: '12/28',
    cardCvc: '888',
  });

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCost = form.shippingMethod === 'standard' ? 0 : form.shippingMethod === 'air' ? 24.99 : 65.00;
  const estimatedTax = subtotal * 0.0825;
  const total = subtotal + shippingCost + estimatedTax;

  const simulatedOrderNumber = 'CF-2026-984090';

  const handleCopyOrderNumber = () => {
    navigator.clipboard?.writeText(simulatedOrderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={step === 3 ? onOrderComplete : onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      <div className="relative rounded-2xl bg-[#0b101c] border border-cyan-500/40 text-slate-100 max-w-3xl w-full p-6 sm:p-8 z-10 shadow-[0_0_60px_rgba(6,182,212,0.25)] max-h-[90vh] overflow-y-auto font-['Plus_Jakarta_Sans']">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-['Space_Grotesk'] text-white">
                {step === 3 ? 'ORDER DISPATCH CONFIRMED' : 'HARDWARE ACQUISITION CHECKOUT'}
              </h2>
              <p className="text-xs font-mono text-cyan-400/80">
                256-BIT ENCRYPTED TELEMETRY GATEWAY
              </p>
            </div>
          </div>
          {step !== 3 && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Steps Breadcrumb */}
        {step !== 3 && (
          <div className="flex items-center justify-between my-6 px-4 py-2 rounded-xl bg-[#07090e] border border-slate-800 text-xs font-mono">
            <span className={step >= 1 ? 'text-cyan-400 font-bold' : 'text-slate-600'}>
              1. SHIPPING DESTINATION
            </span>
            <span className="text-slate-700">───</span>
            <span className={step >= 2 ? 'text-cyan-400 font-bold' : 'text-slate-600'}>
              2. PAYMENT GATEWAY
            </span>
            <span className="text-slate-700">───</span>
            <span className="text-slate-600">3. DISPATCH CONFIRMATION</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 1: SHIPPING DESTINATION */}
        {/* ========================================================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">FIRST NAME</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full bg-[#111726] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">LAST NAME</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full bg-[#111726] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#111726] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">CONTACT TELEPHONE</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-[#111726] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">DELIVERY ADDRESS</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-[#111726] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">CITY</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-[#111726] border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">STATE</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full bg-[#111726] border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">ZIP CODE</label>
                <input
                  type="text"
                  value={form.zip}
                  onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  className="w-full bg-[#111726] border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Courier Tiers */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">
                SELECT COURIER DISPATCH PROTOCOL:
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'standard',
                    name: 'Ground Courier (Carbon-Neutral)',
                    time: '3-5 Business Days',
                    cost: 'FREE',
                  },
                  {
                    id: 'air',
                    name: 'Insured Air Courier (Anti-Static Shock Crate)',
                    time: 'Next-Day Delivery',
                    cost: '$24.99',
                  },
                  {
                    id: 'whiteglove',
                    name: 'White-Glove Atelier Hand Delivery & Unboxing',
                    time: 'Same-Day Priority',
                    cost: '$65.00',
                  },
                ].map((tier) => (
                  <label
                    key={tier.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      form.shippingMethod === tier.id
                        ? 'bg-cyan-500/10 border-cyan-400 text-white'
                        : 'bg-[#090d16] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={form.shippingMethod === tier.id}
                        onChange={() =>
                          setForm({ ...form, shippingMethod: tier.id as any })
                        }
                        className="accent-cyan-400"
                      />
                      <div>
                        <div className="text-xs font-bold font-['Space_Grotesk'] text-white">
                          {tier.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">{tier.time}</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-cyan-300">{tier.cost}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold font-['Space_Grotesk'] text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                PROCEED TO PAYMENT GATEWAY
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: PAYMENT GATEWAY */}
        {/* ========================================================= */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'card', label: 'Credit Card', icon: CreditCard },
                { id: 'crypto', label: 'Crypto (BTC / USDT)', icon: ShieldCheck },
                { id: 'wire', label: 'Wire Transfer', icon: Truck },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setForm({ ...form, paymentMethod: m.id as any })}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                      form.paymentMethod === m.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-[#090d16] border-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[11px] font-mono">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {form.paymentMethod === 'card' && (
              <div className="space-y-4 bg-[#090d16] p-5 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    CARD NUMBER
                  </label>
                  <input
                    type="text"
                    value={form.cardNumber}
                    onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                    className="w-full bg-[#111726] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      EXPIRY DATE
                    </label>
                    <input
                      type="text"
                      value={form.cardExpiry}
                      onChange={(e) => setForm({ ...form, cardExpiry: e.target.value })}
                      className="w-full bg-[#111726] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      SECURITY CVC / CVV
                    </label>
                    <input
                      type="text"
                      value={form.cardCvc}
                      onChange={(e) => setForm({ ...form, cardCvc: e.target.value })}
                      className="w-full bg-[#111726] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Hardware Items ({items.length})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Courier Protocol</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Tax (8.25%)</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold font-['Space_Grotesk'] text-white pt-2 border-t border-slate-800">
                <span>Total Authorization</span>
                <span className="text-cyan-400 font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
              >
                ← BACK TO SHIPPING
              </button>

              <button
                onClick={() => setStep(3)}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-black font-bold font-['Space_Grotesk'] text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)]"
              >
                AUTHORIZE HARDWARE TRANSACTION (${total.toFixed(2)})
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: DISPATCH CONFIRMATION */}
        {/* ========================================================= */}
        {step === 3 && (
          <div className="space-y-6 py-4 text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(6,182,212,0.4)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-['Space_Grotesk'] text-2xl font-extrabold text-white">
                HARDWARE ACQUISITION COMPLETE
              </h3>
              <p className="text-slate-400 text-xs font-mono mt-1">
                Your components have been allocated in our temperature-controlled cleanroom.
              </p>
            </div>

            {/* Tracking pill */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#090d16] border border-cyan-500/30 text-xs font-mono">
              <Package className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400">ORDER TRACKING ID:</span>
              <span className="text-cyan-300 font-bold">{simulatedOrderNumber}</span>
              <button
                onClick={handleCopyOrderNumber}
                className="text-slate-400 hover:text-white p-1"
                title="Copy order number"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {copied && <span className="text-emerald-400 text-[10px]">COPIED</span>}
            </div>

            {/* Telemetry dispatch summary */}
            <div className="p-4 rounded-xl bg-[#0e1424] border border-slate-800 text-left text-xs font-mono space-y-2 max-w-lg mx-auto">
              <div className="flex justify-between text-slate-400">
                <span>Shipping Recipient:</span>
                <span className="text-white font-semibold">
                  {form.firstName} {form.lastName}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Address:</span>
                <span className="text-white">
                  {form.address}, {form.city}, {form.state}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Courier Service:</span>
                <span className="text-cyan-300">Insured Air Express</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Arrival:</span>
                <span className="text-emerald-400 font-bold">Tomorrow by 10:30 AM</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={onOrderComplete}
                className="px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-['Space_Grotesk'] text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition"
              >
                RETURN TO HARDWARE CATALOG
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
