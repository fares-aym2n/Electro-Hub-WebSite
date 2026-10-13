import { useEffect } from 'react';
import { ElectroHeader } from './components/electro/ElectroHeader';
import { ElectroFooter } from './components/electro/ElectroFooter';
import { HomeView } from './components/pages/HomeView';
import { ProductDetailsView } from './components/pages/ProductDetailsView';
import { SignUpView } from './components/pages/SignUpView';
import { SignInView } from './components/pages/SignInView';
import { CheckoutView } from './components/pages/CheckoutView';
import { WriteReviewView } from './components/pages/WriteReviewView';
import { AboutView } from './components/pages/AboutView';
import { ContactView } from './components/pages/ContactView';
import { ForgotPasswordView } from './components/pages/ForgotPasswordView';
import { ResetPasswordView } from './components/pages/ResetPasswordView';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { NavigationProvider, useNavigation, type PageId } from './context/NavigationContext';
import { productService } from './services/productService';
import type { ApiProduct } from './types/api';

function AppContent() {
  const { activePage, selectedProductId, navigate } = useNavigation();
  const { totalItems, addToCart, clearCart, items } = useCart();

  // If cart is empty on initial mount, initialize with flagship Sony WH-1000XM5 (id 29)
  useEffect(() => {
    if (items.length === 0) {
      productService
        .getProductById(29)
        .then((prod) => {
          addToCart(prod, 1);
        })
        .catch(() => {
          // Graceful fallback if network is briefly unavailable
        });
    }
  }, []); // Run once on mount

  const handleNavigate = (page: PageId) => {
    navigate(page);
  };

  const handleSelectProduct = (id: number) => {
    navigate('product-details', { productId: id });
  };

  const handleAddToCart = (product: ApiProduct, quantity: number = 1) => {
    addToCart(product, quantity);
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
            onAddToCart={(prod) => handleAddToCart(prod, 1)}
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
      </main>

      {/* 3. GLOBAL FOOTER (Synchronized Links) */}
      <ElectroFooter />
    </div>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </NavigationProvider>
  );
}
