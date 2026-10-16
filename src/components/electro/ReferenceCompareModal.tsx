import type { FC } from 'react';
import { X, Eye } from 'lucide-react';
import type { PageId } from './ElectroHeader';

interface ReferenceCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: PageId;
}

export const ReferenceCompareModal: FC<ReferenceCompareModalProps> = ({
  isOpen,
  onClose,
  activePage,
}) => {
  if (!isOpen) return null;

  const refImageMap: Record<PageId, string> = {
    'home': '/references/product-details.jpg',
    'products': '/references/product-details.jpg',
    'product-details': '/references/product-details.jpg',
    'signup': '/references/sign-up.jpg',
    'signin': '/references/sign-in.jpg',
    'checkout': '/references/checkout.jpg',
    'wishlist': '/references/product-details.jpg',
    'orders': '/references/checkout.jpg',
    'review': '/references/write-review.jpg',
    'about': '/references/product-details.jpg',
    'contact': '/references/product-details.jpg',
    'forgot-password': '/references/sign-in.jpg',
    'reset-password': '/references/sign-in.jpg',
    'payment-success': '/references/checkout.jpg',
    'payment-cancel': '/references/checkout.jpg',
  };

  const refTitleMap: Record<PageId, string> = {
    'home': 'Home Page Design System (Shared reference: Product Details)',
    'products': 'Product Listing & Catalog Design System',
    'product-details': 'Approved Reference: Product Details (Sony WH-1000XM4)',
    'signup': 'Approved Reference: Sign Up (create your account)',
    'signin': 'Approved Reference: Sign In (Welcome back)',
    'checkout': 'Approved Reference: Checkout (Shipping, Pedestal, Order Summary)',
    'wishlist': 'Favorites & Wishlist Design System',
    'orders': 'Customer Order History & Tracking',
    'review': 'Approved Reference: Write a Review (Share your experience)',
    'about': 'About Us Design System',
    'contact': 'Contact Us Design System',
    'forgot-password': 'Forgot Password Page',
    'reset-password': 'Reset Password Page',
    'payment-success': 'Payment Success Confirmation Page',
    'payment-cancel': 'Payment Cancellation Page',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
      />

      <div className="relative rounded-2xl bg-[#EFE0D3] border border-[#E5D7CA] text-[#111111] max-w-5xl w-full p-6 z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#DFD4C8] mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#C49B82]" />
            <h3 className="font-bold text-base text-[#111111]">
              {refTitleMap[activePage]}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#E5D7CA] text-[#111111]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-[#DFD4C8] bg-white">
          <img
            src={refImageMap[activePage]}
            alt="Reference design"
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="mt-4 text-xs text-[#555555] text-center">
          Compare this exact reference image with the live interactive page behind it.
        </div>
      </div>
    </div>
  );
};
