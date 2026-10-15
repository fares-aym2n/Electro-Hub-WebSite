import type { FC } from "react";
import {
  ShieldCheck,
  Clock,
  MapPin,
  Mail,
  Phone,
  Lock,
  Layers,
  Sparkles,
} from "lucide-react";
import { useNavigation } from "../../context/NavigationContext";

const CURRENT_YEAR = new Date().getFullYear();

export const ElectroFooter: FC = () => {
  const { navigate } = useNavigation();

  const handleCategoriesClick = () => {
    navigate("home", { scrollTo: "categories-section" });
  };

  const handleOffersClick = () => {
    navigate("home", { scrollTo: "offers-section" });
  };

  return (
    <footer className="bg-[#EFE0D3] border-t border-[#E5D7CA] text-[#111111] select-none pt-12 pb-8 mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-12 border-b border-[#DFD4C8]">
          
          {/* Column 1: Brand Info & Mission (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div
              onClick={() => navigate("home")}
              className="text-[22px] font-bold tracking-tight text-[#111111] cursor-pointer hover:opacity-80 transition inline-block"
            >
              Electro Hub
            </div>
            <p className="text-[13px] text-[#555555] leading-relaxed">
              Egypt's premier destination for high-performance audio, smart electronics, computing devices, and modern home tech. Built for seamless experiences.
            </p>
            <div className="space-y-2 pt-1 text-[12px] text-[#666666]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C49B82] shrink-0" />
                <span>Cairo & Giza, Arab Republic of Egypt</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C49B82] shrink-0" />
                <span>Daily: 9:00 AM – 10:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C49B82] shrink-0" />
                <a
                  href="mailto:support@electrohub.eg"
                  className="hover:text-[#111111] hover:underline"
                >
                  support@electrohub.eg
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C49B82] shrink-0" />
                <span>+20 (02) 2345-6789</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[13px] font-bold text-[#111111] uppercase tracking-[0.08em]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-[13px] text-[#555555]">
              <li>
                <button
                  onClick={() => navigate("home")}
                  className="hover:text-[#C49B82] transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("products")}
                  className="hover:text-[#C49B82] transition font-semibold text-[#111111]"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={handleCategoriesClick}
                  className="hover:text-[#C49B82] transition flex items-center gap-1"
                >
                  <span>Categories</span>
                  <Layers className="w-3 h-3 text-[#C49B82]" />
                </button>
              </li>
              <li>
                <button
                  onClick={handleOffersClick}
                  className="hover:text-[#C49B82] transition flex items-center gap-1"
                >
                  <span>Special Offers</span>
                  <Sparkles className="w-3 h-3 text-[#C49B82]" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("wishlist")}
                  className="hover:text-[#C49B82] transition"
                >
                  My Wishlist
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("checkout")}
                  className="hover:text-[#C49B82] transition"
                >
                  Shopping Cart
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[13px] font-bold text-[#111111] uppercase tracking-[0.08em]">
              Company
            </h4>
            <ul className="space-y-2 text-[13px] text-[#555555]">
              <li>
                <button
                  onClick={() => navigate("about")}
                  className="hover:text-[#C49B82] transition"
                >
                  About Electro Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("contact")}
                  className="hover:text-[#C49B82] transition"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <span className="cursor-default hover:text-[#111111]">
                  Official Warranties
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-[#111111]">
                  Terms & Conditions
                </span>
              </li>
              <li>
                <span className="cursor-default hover:text-[#111111]">
                  Privacy Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Assistance (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[13px] font-bold text-[#111111] uppercase tracking-[0.08em]">
              Assistance
            </h4>
            <ul className="space-y-2 text-[13px] text-[#555555]">
              <li>
                <button
                  onClick={() => navigate("contact")}
                  className="hover:text-[#C49B82] transition"
                >
                  Help & FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("checkout")}
                  className="hover:text-[#C49B82] transition"
                >
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("contact")}
                  className="hover:text-[#C49B82] transition"
                >
                  Returns & Refunds
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("contact")}
                  className="hover:text-[#C49B82] transition"
                >
                  Track Order
                </button>
              </li>
              <li>
                <span className="cursor-default hover:text-[#111111]">
                  Payment Security
                </span>
              </li>
            </ul>
          </div>

          {/* Column 5: Payment & Security Badges (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[13px] font-bold text-[#111111] uppercase tracking-[0.08em] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C49B82]" />
              Payment & Security
            </h4>
            <p className="text-[12px] text-[#666666] leading-relaxed">
              We provide 100% encrypted, verified checkout options designed for shoppers across Egypt.
            </p>

            {/* Payment Method Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="h-9 px-2.5 rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#111111] shadow-2xs">
                <span>Cash on Delivery</span>
              </div>
              <div className="h-9 px-2.5 rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#111111] shadow-2xs">
                <span>Visa / MC</span>
              </div>
              <div className="h-9 px-2.5 rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#111111] shadow-2xs">
                <span>Meeza Card</span>
              </div>
              <div className="h-9 px-2.5 rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#C49B82] shadow-2xs">
                <span>valU Installments</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 text-[11px] text-[#777777]">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>256-bit SSL encrypted secure checkout</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#777777]">
          <div>
            &copy; {CURRENT_YEAR} Electro Hub Egypt. All rights reserved.
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate("about")}
              className="hover:text-[#111111] transition"
            >
              About
            </button>
            <span>•</span>
            <button
              onClick={() => navigate("contact")}
              className="hover:text-[#111111] transition"
            >
              Contact
            </button>
            <span>•</span>
            <button
              onClick={() => navigate("products")}
              className="hover:text-[#111111] transition"
            >
              Catalog
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
