import type { FC } from "react";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  Headphones,
  Sparkles,
  Layers,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import type { PageId } from "../electro/ElectroHeader";
import type { ApiProduct } from "../../types/api";
import { productService } from "../../services/productService";
import { useNavigation } from "../../context/NavigationContext";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatters";
import { CategoryCarousel } from "../home/CategoryCarousel";
import { OffersSection } from "../home/OffersSection";

interface HomeViewProps {
  onNavigate: (page: PageId) => void;
  onSelectProduct: (productId: number) => void;
  onAddToCart: (product: ApiProduct) => void;
}

export const HomeView: FC<HomeViewProps> = ({
  onNavigate,
  onSelectProduct,
  onAddToCart,
}) => {
  const { navigate } = useNavigation();
  const { isAddingProduct } = useCart();
  const [featuredProduct, setFeaturedProduct] = useState<ApiProduct | null>(null);
  const [loadingHero, setLoadingHero] = useState<boolean>(true);

  // Fetch flagship spotlight product (Sony WH-1000XM5 id: 29)
  useEffect(() => {
    let isCancelled = false;
    setLoadingHero(true);

    productService
      .getProductById(29)
      .then((prod) => {
        if (!isCancelled) {
          setFeaturedProduct(prod);
        }
      })
      .catch((err) => {
        console.warn("Could not load spotlight product 29, trying fallback:", err);
        // Try fallback to any product if id 29 is not reachable
        productService
          .getProducts({ page: 1 })
          .then((res) => {
            if (!isCancelled && res.products && res.products.length > 0) {
              setFeaturedProduct(res.products[0]);
            }
          })
          .catch(() => {});
      })
      .finally(() => {
        if (!isCancelled) {
          setLoadingHero(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleProductClick = (id: number) => {
    onSelectProduct(id);
    onNavigate("product-details");
  };

  const handleCategorySelect = (categorySlug: string) => {
    navigate("products", { category: categorySlug });
  };

  return (
    <div className="bg-[#FBF6F0] min-h-[calc(100vh-140px)] py-6 sm:py-8 lg:py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14 space-y-12 sm:space-y-14 lg:space-y-20">
        
        {/* ========================================================= */}
        {/* 1. HERO SPOTLIGHT BANNER                                  */}
        {/* ========================================================= */}
        {loadingHero ? (
          <div className="rounded-3xl bg-[#EEE9E5] p-6 sm:p-12 lg:p-16 border border-[#E5D7CA] animate-pulse h-[360px] sm:h-[420px] flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="h-4 bg-[#DFD4C8] rounded w-32 mx-auto" />
              <div className="h-8 bg-[#DFD4C8] rounded w-72 mx-auto" />
              <div className="h-4 bg-[#DFD4C8] rounded w-96 mx-auto" />
            </div>
          </div>
        ) : featuredProduct ? (
          <div className="relative rounded-3xl bg-gradient-to-br from-[#EEE9E5] via-[#EDE7E2] to-[#E5D7CA]/40 p-5 sm:p-12 lg:p-16 border border-[#E5D7CA] overflow-hidden shadow-xs">
            {/* Subtle decorative background aura */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#CCA893]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#C49B82]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Content Column */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF6F2] border border-[#DFD4C8] text-[12px] font-bold tracking-[0.08em] text-[#C49B82] uppercase shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  Flagship Spotlight
                </div>

                <h1 className="text-[26px] sm:text-[38px] lg:text-[46px] font-bold text-[#111111] leading-[1.14] tracking-tight">
                  {featuredProduct.name}
                </h1>

                <p className="text-[14px] sm:text-[16px] text-[#444444] leading-relaxed max-w-xl line-clamp-3">
                  {featuredProduct.description ||
                    "Experience industry-leading sound clarity, sophisticated ergonomics, and masterclass engineering built for true audio lovers."}
                </p>

                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-[24px] sm:text-[34px] font-bold text-[#C49B82] tracking-tight">
                    {formatPrice(featuredProduct.price)}
                  </span>
                  <span className="text-xs font-semibold uppercase text-[#777777] tracking-wider">
                    Official Warranty Included
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-3">
                  <button
                    onClick={() => handleProductClick(featuredProduct.id)}
                    className="h-12 px-6 sm:px-8 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase flex items-center justify-center gap-2 transition active:scale-98 shadow-xs cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onAddToCart(featuredProduct)}
                    disabled={isAddingProduct(featuredProduct.id)}
                    className="h-12 px-6 sm:px-8 rounded-xl bg-[#FAF6F2] hover:bg-[#EAE0D5] border border-[#C49B82] text-[#111111] font-bold text-[13px] tracking-[0.08em] uppercase transition active:scale-98 cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    {isAddingProduct(featuredProduct.id) ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#C49B82]" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <span>Add to Cart</span>
                    )}
                  </button>

                  <button
                    onClick={() => navigate("products")}
                    className="h-12 px-5 sm:px-6 rounded-xl bg-transparent hover:bg-[#FAF6F2]/80 text-[#555555] hover:text-[#111111] font-semibold text-[13px] tracking-[0.06em] uppercase transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Browse Catalog</span>
                  </button>
                </div>
              </div>

              {/* Right Hero Image Column */}
              <div className="lg:col-span-5 flex justify-center">
                <div
                  onClick={() => handleProductClick(featuredProduct.id)}
                  className="w-full max-w-md h-72 sm:h-96 rounded-2xl flex items-center justify-center p-4 cursor-pointer group relative"
                >
                  <img
                    src={featuredProduct.image || "/assets/sony-main.jpg"}
                    alt={featuredProduct.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/sony-main.jpg";
                    }}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* ========================================================= */}
        {/* 2. EXPLORE BY CATEGORY (AUTO-SCROLLING HORIZONTAL CAROUSEL)*/}
        {/* ========================================================= */}
        <section id="categories-section" className="scroll-mt-24">
          <CategoryCarousel onSelectCategory={handleCategorySelect} />
        </section>

        {/* ========================================================= */}
        {/* 3. BEST OFFERS SECTION (API DISCOUNT CAROUSEL)            */}
        {/* ========================================================= */}
        <section id="offers-section" className="scroll-mt-24">
          <OffersSection
            onSelectProduct={handleProductClick}
            onAddToCart={(prod) => onAddToCart(prod as ApiProduct)}
            onNavigateToOffers={() => navigate("products", { discount: true })}
          />
        </section>

        {/* ========================================================= */}
        {/* 4. CALL TO ACTION: BROWSE FULL PRODUCT CATALOG            */}
        {/* ========================================================= */}
        <section className="rounded-3xl bg-[#EEE9E5] border border-[#E5D7CA] p-8 sm:p-12 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF6F2] border border-[#DFD4C8] text-[11px] font-bold tracking-[0.08em] text-[#C49B82] uppercase">
              <Layers className="w-3.5 h-3.5" />
              Complete Electronics Range
            </div>
            <h2 className="text-[26px] sm:text-[32px] font-bold text-[#111111] tracking-tight">
              Looking for Something Specific?
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#555555] leading-relaxed">
              Explore our full collection with advanced filtering by category, dual-handle price range slider, customer ratings, and in-stock availability.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate("products")}
              className="h-12 px-8 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase flex items-center gap-2 transition active:scale-98 shadow-xs"
            >
              Explore Full Catalog
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("categories-section");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="h-12 px-6 rounded-xl bg-transparent hover:bg-[#FAF6F2] border border-[#DFD4C8] text-[#111111] font-semibold text-[13px] tracking-[0.06em] uppercase transition"
            >
              View Categories
            </button>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. VALUE PROPOSITIONS / TRUST STRIP (REPOSITIONED BEFORE FOOTER) */}
        {/* ========================================================= */}
        <section
          aria-label="Store Guarantees and Value Propositions"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2"
        >
          <div className="p-4 sm:p-6 rounded-2xl bg-[#EEE9E5] border border-[#E5D7CA] flex items-start gap-3.5 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FAF6F2] text-[#C49B82] flex items-center justify-center shrink-0 border border-[#E5D7CA]">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-[13px] sm:text-[14px] font-bold text-[#111111] uppercase tracking-wide">
                100% Genuine Tech
              </h4>
              <p className="text-[12px] text-[#666666] mt-1 leading-relaxed">
                Authentic branded electronics directly backed by official warranties.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-[#EEE9E5] border border-[#E5D7CA] flex items-start gap-3.5 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FAF6F2] text-[#C49B82] flex items-center justify-center shrink-0 border border-[#E5D7CA]">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-[13px] sm:text-[14px] font-bold text-[#111111] uppercase tracking-wide">
                Fast Nationwide Delivery
              </h4>
              <p className="text-[12px] text-[#666666] mt-1 leading-relaxed">
                Prompt dispatch across Cairo, Alexandria, and all Egyptian governorates.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-[#EEE9E5] border border-[#E5D7CA] flex items-start gap-3.5 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FAF6F2] text-[#C49B82] flex items-center justify-center shrink-0 border border-[#E5D7CA]">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-[13px] sm:text-[14px] font-bold text-[#111111] uppercase tracking-wide">
                Flexible Payment
              </h4>
              <p className="text-[12px] text-[#666666] mt-1 leading-relaxed">
                Cash on delivery, debit/credit cards, and easy ValU installment plans.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-[#EEE9E5] border border-[#E5D7CA] flex items-start gap-3.5 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FAF6F2] text-[#C49B82] flex items-center justify-center shrink-0 border border-[#E5D7CA]">
              <Headphones className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-[13px] sm:text-[14px] font-bold text-[#111111] uppercase tracking-wide">
                Dedicated Support
              </h4>
              <p className="text-[12px] text-[#666666] mt-1 leading-relaxed">
                Daily assistance from 9:00 AM to 10:00 PM via live chat and phone.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
