import type { FC } from 'react';
import { useState } from 'react';
import {
  Menu,
  X,
  LogOut,
  User as UserIcon,
  Settings,
  KeyRound,
  Lock,
  ShoppingCart,
  Heart,
  Package,
} from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNavigation } from '../../context/NavigationContext';
import { useFavorites } from "../../context/FavoritesContext";
export type { PageId } from '../../context/NavigationContext';
import { EditProfileModal } from '../profile/EditProfileModal';
import { ChangePasswordModal } from '../profile/ChangePasswordModal';

interface ElectroHeaderProps {
  cartCount?: number;
}

export const ElectroHeader: FC<ElectroHeaderProps> = ({ cartCount: propCartCount }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const { user, logout, openAuthModal } = useAuth();
  const { totalItems } = useCart();
  const { favoritesCount } = useFavorites();
  const { activePage, navigate, scrollToSection } = useNavigation();

  const cartCount = propCartCount !== undefined ? propCartCount : totalItems;

  const handleLogout = () => {
    logout();
    setAccountMenuOpen(false);
    navigate('home');
  };

  const handleProductsClick = () => {
    navigate("products");
  };

  const handleCategoriesClick = () => {
    if (activePage === 'home') {
      scrollToSection('categories-section');
    } else {
      navigate('home', { scrollTo: 'categories-section' });
    }
  };

  return (
    <>
      <header className="bg-[#EFE0D3] border-b border-[#E5D7CA] text-[#111111] select-none sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-14 h-[64px] sm:h-[68px] flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div
            onClick={() => navigate("home")}
            className="text-[19px] sm:text-[22px] font-bold tracking-tight text-[#111111] cursor-pointer hover:opacity-80 transition shrink-0"
          >
            Electro Hub
          </div>

          {/* Center Navigation Links: HOME, PRODUCTS, CATEGORIES, ABOUT US, CONTACT US */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[13px] font-semibold tracking-[0.06em] uppercase">
            <button
              onClick={() => navigate("home")}
              className={`transition hover:text-[#C49B82] ${
                activePage === "home" ? "text-[#C49B82]" : "text-[#111111]"
              }`}
            >
              HOME
            </button>

            {/* Direct navigation to Dedicated Product Listing Page */}
            <button
              onClick={handleProductsClick}
              className={`transition hover:text-[#C49B82] ${
                activePage === "products" ? "text-[#C49B82]" : "text-[#111111]"
              }`}
            >
              PRODUCTS
            </button>

            <button
              onClick={handleCategoriesClick}
              className="text-[#111111] hover:text-[#C49B82] transition"
            >
              CATEGORIES
            </button>

            <button
              onClick={() => navigate("about")}
              className={`transition hover:text-[#C49B82] ${
                activePage === "about" ? "text-[#C49B82]" : "text-[#111111]"
              }`}
            >
              ABOUT US
            </button>

            <button
              onClick={() => navigate("contact")}
              className={`transition hover:text-[#C49B82] ${
                activePage === "contact" ? "text-[#C49B82]" : "text-[#111111]"
              }`}
            >
              CONTACT US
            </button>
          </nav>

          {/* Desktop Right Utility Navigation (md and up) */}
          <div className="hidden md:flex items-center gap-5 lg:gap-7 text-[13px] font-semibold tracking-[0.06em] uppercase">
            <button
              onClick={() => {
                if (activePage === "home") {
                  scrollToSection("search-filter-bar");
                } else {
                  navigate("home", { scrollTo: "search-filter-bar" });
                }
              }}
              className="text-[#111111] hover:text-[#C49B82] transition"
            >
              SEARCH
            </button>

            {/* When NOT Authenticated: Show Sign In & Sign Up */}
            {!user ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => openAuthModal("signin")}
                  className="transition hover:text-[#C49B82] text-[#111111] cursor-pointer"
                >
                  SIGN IN
                </button>
              </div>
            ) : (
              /* When Authenticated: Profile Icon Button */
              <div className="relative">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-2 py-1 px-2.5 rounded-full hover:bg-[#FAF6F2]/80 transition text-[#111111] border border-[#DFD4C8]"
                  title="My Account"
                >
                  <div className="w-7 h-7 rounded-full bg-[#FAF6F2] border border-[#C49B82]/60 overflow-hidden flex items-center justify-center shrink-0">
                    {user.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4 text-[#C49B82]" />
                    )}
                  </div>
                  <span className="text-xs font-bold truncate max-w-[100px]">
                    {user.username}
                  </span>
                </button>

                {/* Account Menu Dropdown / Panel */}
                {accountMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setAccountMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-[#FAF6F2] border border-[#DFD4C8] rounded-2xl shadow-xl py-3 z-50 normal-case animate-in fade-in duration-150">
                      {/* User Info Header */}
                      <div className="px-5 py-3 border-b border-[#DFD4C8]/70">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-[#EEE9E5] border border-[#C49B82]/60 overflow-hidden flex items-center justify-center shrink-0">
                            {user.profile_image ? (
                              <img
                                src={user.profile_image}
                                alt={user.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <UserIcon className="w-6 h-6 text-[#C49B82]" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-sm text-[#111111] truncate">
                              {user.username}
                            </div>
                            <div className="text-xs text-[#666666] truncate flex items-center gap-1">
                              <Lock className="w-3 h-3 text-[#C49B82] shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </div>
                            {user.role === "admin" && (
                              <span className="inline-block mt-1 text-[10px] font-bold bg-[#CCA893] text-[#111111] px-1.5 py-0.5 rounded uppercase">
                                Verified Admin
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="py-2 px-2 space-y-1 text-xs">
                        <button
                          onClick={() => {
                            setAccountMenuOpen(false);
                            navigate('orders');
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-[#111111] hover:bg-[#EEE9E5] flex items-center gap-2.5 font-medium transition cursor-pointer"
                        >
                          <Package className="w-4 h-4 text-[#C49B82]" />
                          My Orders
                        </button>
                        <button
                          onClick={() => {
                            setAccountMenuOpen(false);
                            setIsEditProfileOpen(true);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-[#111111] hover:bg-[#EEE9E5] flex items-center gap-2.5 font-medium transition"
                        >
                          <Settings className="w-4 h-4 text-[#C49B82]" />
                          Edit Profile
                        </button>
                        <button
                          onClick={() => {
                            setAccountMenuOpen(false);
                            setIsChangePasswordOpen(true);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-[#111111] hover:bg-[#EEE9E5] flex items-center gap-2.5 font-medium transition"
                        >
                          <KeyRound className="w-4 h-4 text-[#C49B82]" />
                          Change Password
                        </button>
                      </div>

                      <div className="border-t border-[#DFD4C8]/70 pt-1 px-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-medium transition text-xs"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Wishlist / Favorites Heart Button */}
            <button
              onClick={() => navigate("wishlist")}
              className={`relative p-2 rounded-full hover:bg-[#E5D7CA] transition flex items-center justify-center text-[#111111] hover:text-[#C49B82] ${
                activePage === "wishlist" ? "text-[#C49B82]" : ""
              }`}
              aria-label="Wishlist"
              title="Wishlist / Favorites"
            >
              <Heart
                className={`w-5 h-5 transition-transform active:scale-90 ${
                  activePage === "wishlist" || favoritesCount > 0
                    ? "fill-[#C49B82] text-[#C49B82]"
                    : ""
                }`}
              />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C49B82] text-[#111111] text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button with Icon */}
            <button
              onClick={() => navigate("checkout")}
              className={`relative p-2 rounded-full hover:bg-[#E5D7CA] transition flex items-center justify-center text-[#111111] hover:text-[#C49B82] ${
                activePage === "checkout" ? "text-[#C49B82]" : ""
              }`}
              aria-label="Shopping Cart"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 transition-transform active:scale-90" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#CCA893] text-[#111111] text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Action Bar (< md): Wishlist, Cart & Hamburger */}
          <div className="flex md:hidden items-center gap-1 sm:gap-2">
            {/* Wishlist Button on Mobile */}
            <button
              onClick={() => navigate("wishlist")}
              className={`relative p-2 rounded-full hover:bg-[#E5D7CA] transition flex items-center justify-center text-[#111111] hover:text-[#C49B82] cursor-pointer ${
                activePage === "wishlist" ? "text-[#C49B82]" : ""
              }`}
              aria-label="Wishlist"
              title="Wishlist / Favorites"
            >
              <Heart
                className={`w-5 h-5 transition-transform active:scale-90 ${
                  activePage === "wishlist" || favoritesCount > 0
                    ? "fill-[#C49B82] text-[#C49B82]"
                    : ""
                }`}
              />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C49B82] text-[#111111] text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button on Mobile */}
            <button
              onClick={() => navigate("checkout")}
              className={`relative p-2 rounded-full hover:bg-[#E5D7CA] transition flex items-center justify-center text-[#111111] hover:text-[#C49B82] cursor-pointer ${
                activePage === "checkout" ? "text-[#C49B82]" : ""
              }`}
              aria-label="Shopping Cart"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 transition-transform active:scale-90" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#CCA893] text-[#111111] text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[#111111] hover:text-[#C49B82] cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-[#EFE0D3] border-t border-[#E5D7CA] px-4 sm:px-6 py-5 sm:py-6 space-y-3 sm:space-y-4 text-xs font-semibold tracking-wider uppercase">
            <button
              onClick={() => {
                navigate("home");
                setMobileOpen(false);
              }}
              className="block w-full text-left py-2.5 sm:py-2 hover:text-[#C49B82]"
            >
              HOME
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                handleProductsClick();
              }}
              className={`block w-full text-left py-2 hover:text-[#C49B82] ${
                activePage === "products" ? "text-[#C49B82]" : ""
              }`}
            >
              PRODUCTS
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                handleCategoriesClick();
              }}
              className="block w-full text-left py-2 hover:text-[#C49B82]"
            >
              CATEGORIES
            </button>
            <button
              onClick={() => {
                navigate("about");
                setMobileOpen(false);
              }}
              className="block w-full text-left py-2 hover:text-[#C49B82]"
            >
              ABOUT US
            </button>
            <button
              onClick={() => {
                navigate("contact");
                setMobileOpen(false);
              }}
              className="block w-full text-left py-2 hover:text-[#C49B82]"
            >
              CONTACT US
            </button>

            {user ? (
              <div className="pt-3 border-t border-[#DFD4C8] space-y-2">
                <div className="text-xs text-[#666666] lowercase">
                  Signed in as{" "}
                  <strong className="text-[#111111]">{user.username}</strong> (
                  {user.email})
                </div>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('orders');
                  }}
                  className="block w-full text-left py-1 text-[#111111] hover:text-[#C49B82] font-semibold"
                >
                  My Orders
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setIsEditProfileOpen(true);
                  }}
                  className="block w-full text-left py-1 text-[#111111] hover:text-[#C49B82]"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setIsChangePasswordOpen(true);
                  }}
                  className="block w-full text-left py-1 text-[#111111] hover:text-[#C49B82]"
                >
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-1 text-red-600 font-bold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-[#DFD4C8] flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    openAuthModal("signin");
                    setMobileOpen(false);
                  }}
                  className="py-2 text-[#111111] hover:text-[#C49B82] cursor-pointer"
                >
                  SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    openAuthModal("signup");
                    setMobileOpen(false);
                  }}
                  className="py-2 text-[#C49B82] font-bold cursor-pointer"
                >
                  SIGN UP
                </button>
              </div>
            )}

            {/* Wishlist Link in Mobile Drawer */}
            <button
              onClick={() => {
                navigate("wishlist");
                setMobileOpen(false);
              }}
              className={`flex items-center justify-between w-full py-2 hover:text-[#C49B82] border-t border-[#DFD4C8] pt-3 ${
                activePage === "wishlist" ? "text-[#C49B82]" : ""
              }`}
              aria-label="Wishlist"
            >
              <div className="flex items-center gap-2">
                <Heart
                  className={`w-4 h-4 ${
                    favoritesCount > 0 ? "fill-[#C49B82] text-[#C49B82]" : ""
                  }`}
                />
                <span>WISHLIST</span>
              </div>
              {favoritesCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#C49B82] text-[#111111] text-[10px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Shopping Cart in Mobile Drawer */}
            <button
              onClick={() => {
                navigate("checkout");
                setMobileOpen(false);
              }}
              className={`flex items-center justify-between w-full py-2 hover:text-[#C49B82] ${
                activePage === "checkout" ? "text-[#C49B82]" : ""
              }`}
              aria-label="Shopping Cart"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span>SHOPPING CART</span>
              </div>
              {cartCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#CCA893] text-[#111111] text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        )}
      </header>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
};
