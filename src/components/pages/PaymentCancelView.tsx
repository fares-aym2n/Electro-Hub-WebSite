import type { FC } from 'react';
import {
  XCircle,
  RotateCcw,
  ShoppingBag,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  CreditCard,
  PhoneCall,
} from 'lucide-react';
import type { PageId } from '../../context/NavigationContext';
import { BackButton } from '../common/BackButton';

interface PaymentCancelViewProps {
  onNavigate: (page: PageId) => void;
}

export const PaymentCancelView: FC<PaymentCancelViewProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#FBF6F0] min-h-[calc(100vh-140px)] py-8 lg:py-14 text-[#111111]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-8 space-y-6 sm:space-y-8">
        {/* Back Navigation */}
        <div>
          <BackButton label="Back to Checkout" onClick={() => onNavigate('checkout')} />
        </div>

        {/* Main Cancellation Container Card */}
        <div className="rounded-3xl bg-[#EEE9E5] border border-[#E5D7CA] p-6 sm:p-10 lg:p-12 text-center space-y-6 sm:space-y-8 shadow-xs">
          
          {/* Cancellation Icon */}
          <div className="flex justify-center">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-rose-50 border-2 border-rose-300 flex items-center justify-center text-rose-500 shadow-sm animate-in zoom-in-75 duration-300"
              aria-label="Payment Cancelled"
            >
              <XCircle className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.2]" />
            </div>
          </div>

          {/* Heading and Primary Cancellation Message */}
          <div className="space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F2] border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <span>Checkout Aborted</span>
            </div>

            <h1 className="text-[26px] sm:text-[34px] lg:text-[40px] font-bold text-[#111111] tracking-tight leading-tight">
              Payment Cancelled
            </h1>

            <p className="text-sm sm:text-base text-[#444444] max-w-lg mx-auto leading-relaxed">
              Your payment was cancelled. No payment has been completed.
            </p>
          </div>

          {/* Information & Safety Notice Block */}
          <div className="rounded-2xl bg-[#FAF6F2] border border-[#DFD4C8] p-5 sm:p-6 text-left space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#777777] uppercase tracking-wider pb-2 border-b border-[#DFD4C8]/80">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Charges Deducted</span>
            </div>

            <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
              No funds have been charged to your card or bank account. All products in your cart remain
              saved, so you can re-attempt your checkout whenever you are ready or select an alternate
              payment option such as Cash on Delivery.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#555555]">
              <div className="flex items-start gap-2">
                <CreditCard className="w-4 h-4 text-[#C49B82] shrink-0 mt-0.5" />
                <span>Supports Visa, MasterCard, and local installment solutions.</span>
              </div>
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-[#C49B82] shrink-0 mt-0.5" />
                <span>Our support team is available if you encountered card processing issues.</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Try Again & Continue Shopping */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {/* Try Again Button (Returns to checkout) */}
            <button
              type="button"
              onClick={() => onNavigate('checkout')}
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase flex items-center justify-center gap-2 transition active:scale-98 shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            {/* Continue Shopping Button (Redirects to products) */}
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="w-full sm:w-auto h-12 px-6 rounded-xl bg-[#FAF6F2] hover:bg-[#EAE0D5] border border-[#DFD4C8] text-[#111111] font-semibold text-[13px] tracking-[0.06em] uppercase flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#777777]" />
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4 text-[#777777]" />
            </button>
          </div>

          {/* Need Assistance Footer Link */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="text-xs font-semibold text-[#888888] hover:text-[#C49B82] transition inline-flex items-center gap-1.5 cursor-pointer underline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Encountered a problem? Contact customer support</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
