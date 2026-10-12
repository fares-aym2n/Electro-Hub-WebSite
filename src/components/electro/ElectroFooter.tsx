import type { FC } from "react";
import { useNavigation } from "../../context/NavigationContext";

export const ElectroFooter: FC = () => {
  const { navigate } = useNavigation();

  return (
    <footer className="bg-[#EFE0D3] border-t border-[#E5D7CA] text-[#111111] select-none py-5 sm:py-6">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        {/* Brand Logo */}
        <div
          onClick={() => navigate("home")}
          className="text-[20px] font-bold tracking-tight text-[#111111] cursor-pointer hover:opacity-80 transition shrink-0"
        >
          Electro Hub
        </div>

        {/* Info Links: About Us, Shipping, Returns, Contact Us */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-[12px] sm:text-[13px] font-semibold tracking-[0.06em] uppercase">
          <button
            onClick={() => navigate("about")}
            className="text-[#111111] hover:text-[#C49B82] transition"
          >
            ABOUT US
          </button>
          <button
            onClick={() => navigate("checkout")}
            className="text-[#111111] hover:text-[#C49B82] transition"
          >
            SHIPPING
          </button>
          <button
            onClick={() => navigate("contact")}
            className="text-[#111111] hover:text-[#C49B82] transition"
          >
            RETURNS
          </button>
          <button
            onClick={() => navigate("contact")}
            className="text-[#111111] hover:text-[#C49B82] transition"
          >
            CONTACT US
          </button>
        </div>
      </div>
    </footer>
  );
};
