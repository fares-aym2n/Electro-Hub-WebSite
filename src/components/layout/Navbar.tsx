import type { FC } from 'react';
import { useState } from 'react';
import {
  Cpu,
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  Wrench,
  Flame,
  Grid,
  Command,
} from 'lucide-react';
import type { ActivePageView } from '../../types';

interface NavbarProps {
  activeView: ActivePageView;
  onNavigate: (view: ActivePageView, category?: string) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenCommandPalette: () => void;
}

export const Navbar: FC<NavbarProps> = ({
  activeView,
  onNavigate,
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenCommandPalette,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#07090e]/95 backdrop-blur-xl border-b border-cyan-500/20 text-slate-100 font-['Plus_Jakarta_Sans']">
      {/* 1. TOP TELEMETRY STATUS HUD */}
      <div className="bg-[#0b101d] border-b border-cyan-500/15 text-[11px] py-1.5 px-4 font-['JetBrains_Mono']">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3 text-cyan-400">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              CORE DISPATCH ONLINE
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-300">
              GUARANTEED SILICON LOTTERY BINNING • 3-YEAR RMA
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span
              onClick={() => onNavigate('builder')}
              className="hover:text-cyan-400 cursor-pointer transition flex items-center gap-1"
            >
              <Wrench className="w-3 h-3 text-cyan-400" />
              [RIG BUILDER v3.4]
            </span>
            <span className="text-slate-600">/</span>
            <span className="hidden md:inline text-slate-300 hover:text-cyan-400 cursor-pointer transition">
              INSURED AIR COURIER DISPATCH
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="relative p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition">
            <Cpu className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse" />
          </div>
          <div>
            <div className="font-['Space_Grotesk'] text-2xl font-extrabold tracking-tight text-white flex items-center">
              CYBER<span className="text-cyan-400">//FORGE</span>
            </div>
            <p className="text-[10px] font-['JetBrains_Mono'] tracking-widest text-slate-400 uppercase">
              Silicon Hardware Engineering
            </p>
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#0e1424] px-3 py-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-['Space_Grotesk'] font-bold tracking-wide transition ${
              activeView === 'home'
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            HOME
          </button>

          <button
            onClick={() => onNavigate('catalog')}
            className={`px-3 py-1.5 rounded-lg text-xs font-['Space_Grotesk'] font-bold tracking-wide flex items-center gap-1.5 transition ${
              activeView === 'catalog'
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            CATALOG
          </button>

          <button
            onClick={() => onNavigate('builder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-['Space_Grotesk'] font-bold tracking-wide flex items-center gap-1.5 transition ${
              activeView === 'builder'
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'text-cyan-300 hover:text-white hover:bg-cyan-950/40'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            RIG BUILDER
          </button>

          <button
            onClick={() => onNavigate('catalog', 'Graphics Cards')}
            className="px-3 py-1.5 rounded-lg text-xs font-['Space_Grotesk'] font-bold tracking-wide flex items-center gap-1 text-amber-400 hover:bg-amber-500/10 transition"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            DROPS
          </button>
        </nav>

        {/* Command Search Trigger (Ctrl + K) */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenCommandPalette}
            className="w-full bg-[#111726] hover:bg-[#161f33] border border-cyan-500/30 hover:border-cyan-400/60 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 flex items-center justify-between transition group shadow-inner"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
              <span>Search components, specs, sockets...</span>
            </span>
            <span className="flex items-center gap-1 bg-[#1a233a] border border-slate-700/60 rounded px-1.5 py-0.5 text-[10px] font-mono text-cyan-300">
              <Command className="w-3 h-3" />
              <span>K</span>
            </span>
          </button>
        </div>

        {/* Utility Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile search icon */}
          <button
            onClick={onOpenCommandPalette}
            className="p-2.5 rounded-lg bg-[#111726] border border-slate-800 text-slate-300 md:hidden"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2.5 rounded-lg bg-[#111726] hover:bg-[#182136] border border-slate-800 hover:border-cyan-500/40 text-slate-300 transition"
            title="Saved Hardware"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Bag Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] transition transform active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="font-['Space_Grotesk'] hidden sm:inline">RIG MANIFEST</span>
            <span className="bg-slate-950 text-cyan-300 text-xs px-2 py-0.5 rounded font-mono font-bold">
              {cartCount}
            </span>
            {cartTotal > 0 && (
              <span className="hidden xl:inline text-xs font-mono text-slate-950 font-black pl-1 border-l border-slate-900/30">
                ${cartTotal.toFixed(0)}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-lg bg-[#111726] border border-slate-800 text-slate-300 lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE EXPANDED MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0f1d] border-b border-slate-800 px-4 py-4 space-y-2">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-['Space_Grotesk'] font-bold text-slate-200 hover:bg-[#12192c]"
          >
            HOME DASHBOARD
          </button>
          <button
            onClick={() => {
              onNavigate('catalog');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-['Space_Grotesk'] font-bold text-slate-200 hover:bg-[#12192c] flex items-center justify-between"
          >
            <span>HARDWARE CATALOG</span>
            <Grid className="w-4 h-4 text-cyan-400" />
          </button>
          <button
            onClick={() => {
              onNavigate('builder');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-['Space_Grotesk'] font-bold text-cyan-300 hover:bg-[#12192c] flex items-center justify-between"
          >
            <span>PC RIG BUILDER</span>
            <Wrench className="w-4 h-4 text-cyan-400" />
          </button>
          <button
            onClick={() => {
              onNavigate('catalog', 'Graphics Cards');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-['Space_Grotesk'] font-bold text-amber-400 hover:bg-[#12192c] flex items-center justify-between"
          >
            <span>FLAGSHIP SILICON DROPS</span>
            <Flame className="w-4 h-4 fill-amber-400" />
          </button>
        </div>
      )}
    </header>
  );
};
