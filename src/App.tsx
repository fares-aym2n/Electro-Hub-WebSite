import { useEffect } from 'react';
import { ElectroHeader } from './components/electro/ElectroHeader';
import { ElectroFooter } from './components/electro/ElectroFooter';
import { HomeView } from './components/pages/HomeView';
import { ProductListingView } from './components/pages/ProductListingView';
import { ProductDetailsView } from './components/pages/ProductDetailsView';
import { SignUpView } from './components/pages/SignUpView';
import { SignInView } from './components/pages/SignInView';
import { CheckoutView } from './components/pages/CheckoutView';
import { WishlistView } from './components/pages/WishlistView';
import { WriteReviewView } from './components/pages/WriteReviewView';
import { AboutView } from './components/pages/AboutView';
import { ContactView } from './components/pages/ContactView';
import { ForgotPasswordView } from './components/pages/ForgotPasswordView';
import { ResetPasswordView } from './components/pages/ResetPasswordView';
import { PaymentSuccessView } from './components/pages/PaymentSuccessView';
import { PaymentCancelView } from './components/pages/PaymentCancelView';
import { OrdersView } from './components/pages/OrdersView';
import { AuthModal } from './components/auth/AuthModal';
import { CartToast } from './components/common/CartToast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart, type AddToCartOptions } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { NavigationProvider, useNavigation, type PageId } from './context/NavigationContext';
import type { ApiProduct } from './types/api';

function AppContent() {
  const { activePage, selectedProductId, navigate } = useNavigation();
  const { totalItems, addToCart, clearCart } = useCart();
  const { openAuthModal } = useAuth();

  // If user accesses /signin or /signup URL directly, show home with the auth modal open
  useEffect(() => {
    if (activePage === 'signin') {
      openAuthModal('signin');
      navigate('home', { replace: true });
    } else if (activePage === 'signup') {
      openAuthModal('signup');
      navigate('home', { replace: true });
    }
  }, [activePage, openAuthModal, navigate]);

  const handleNavigate = (page: PageId) => {
    if (page === 'signin') {
      openAuthModal('signin');
      return;
    }
    if (page === 'signup') {
      openAuthModal('signup');
      return;
    }
    navigate(page);
  };

  const handleSelectProduct = (id: number) => {
    navigate('product-details', { productId: id });
  };

  const handleAddToCart = (
    product: ApiProduct,
    quantity: number = 1,
    options?: AddToCartOptions
  ) => {
    return addToCart(product, quantity, options);
  };

  return (
    <div className="min-h-screen bg-[#FBF6F0] text-[#111111] flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-[#CCA893] selection:text-[#111111]">
      {/* 1. GLOBAL HEADER WITH LIVE AUTH, CART & RESPONSIVE ROUTING */}
      <ElectroHeader cartCount={totalItems} />

      {/* 2. ACTIVE PAGE VIEW (Synchronized with HTML5 Browser History) */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {activePage === 'products' && (
          <ProductListingView
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(prod, options) => handleAddToCart(prod, 1, options)}
          />
        )}

        {activePage === 'product-details' && (
          <ProductDetailsView
            productId={selectedProductId}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        )}

        {activePage === 'signup' && (
          <SignUpView onNavigate={handleNavigate} />
        )}

        {activePage === 'signin' && (
          <SignInView initialMode="signin" onNavigate={handleNavigate} />
        )}

        {activePage === 'checkout' && (
          <CheckoutView
            onNavigate={handleNavigate}
            onClearCart={clearCart}
          />
        )}

        {activePage === 'wishlist' && (
          <WishlistView
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(prod, options) => handleAddToCart(prod, 1, options)}
          />
        )}

        {activePage === 'orders' && (
          <OrdersView
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activePage === 'review' && (
          <WriteReviewView
            productId={selectedProductId}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'about' && (
          <AboutView />
        )}

        {activePage === 'contact' && (
          <ContactView />
        )}

        {activePage === 'forgot-password' && (
          <ForgotPasswordView onNavigate={handleNavigate} />
        )}

        {activePage === 'reset-password' && (
          <ResetPasswordView onNavigate={handleNavigate} />
        )}

        {activePage === 'payment-success' && (
          <PaymentSuccessView onNavigate={handleNavigate} />
        )}

        {activePage === 'payment-cancel' && (
          <PaymentCancelView onNavigate={handleNavigate} />
        )}
      </main>

      {/* 3. GLOBAL FOOTER (Synchronized Links) */}
      <ElectroFooter />

      {/* 4. GLOBAL REUSABLE AUTHENTICATION MODAL (Noon-inspired popup) */}
      <AuthModal />

      {/* 5. FLOATING CART NOTIFICATION TOAST */}
      <CartToast />
    </div>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </NavigationProvider>
  );
}
