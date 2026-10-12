import type { FC } from 'react';
import { useState, useEffect } from 'react';
import {
  Search,
  Wrench,
  Grid,
  ShoppingCart,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';

import type { Product, ActivePageView } from '../../types';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import { ImageWithFallback } from './ImageWithFallback';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: ActivePageView, category?: string) => void;
  onOpenCart: () => void;
}

export const CommandPalette: FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onNavigate,
  onOpenCart,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedProducts = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.specs.some((s) => s.value.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];

  const matchedCategories = query.trim()
    ? CATEGORIES.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    : CATEGORIES.slice(1, 6);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-20 p-4 font-['Plus_Jakarta_Sans']">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="relative rounded-2xl bg-[#0b101c] border border-cyan-500/40 text-slate-100 max-w-2xl w-full overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.3)] z-10">
        {/* Search input header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-[#0e1424]">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type hardware name, category, socket, or shortcut..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {/* Quick Actions */}
          {!query && (
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-2">
                FAST TELEMETRY SHORTCUTS
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => {
                    onNavigate('builder');
                    onClose();
                  }}
                  className="p-2.5 rounded-lg bg-[#070a12] hover:bg-[#12192c] border border-slate-800 hover:border-cyan-500/40 text-left flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2 text-cyan-300">
                    <Wrench className="w-4 h-4 text-cyan-400" />
                    Open Rig Builder
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </button>

                <button
                  onClick={() => {
                    onNavigate('catalog', 'Graphics Cards');
                    onClose();
                  }}
                  className="p-2.5 rounded-lg bg-[#070a12] hover:bg-[#12192c] border border-slate-800 hover:border-cyan-500/40 text-left flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2 text-amber-300">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Flagship GPU Radar
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </button>

                <button
                  onClick={() => {
                    onNavigate('catalog');
                    onClose();
                  }}
                  className="p-2.5 rounded-lg bg-[#070a12] hover:bg-[#12192c] border border-slate-800 hover:border-cyan-500/40 text-left flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2 text-slate-200">
                    <Grid className="w-4 h-4 text-cyan-400" />
                    Browse All Catalog
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </button>

                <button
                  onClick={() => {
                    onOpenCart();
                    onClose();
                  }}
                  className="p-2.5 rounded-lg bg-[#070a12] hover:bg-[#12192c] border border-slate-800 hover:border-cyan-500/40 text-left flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2 text-slate-200">
                    <ShoppingCart className="w-4 h-4 text-cyan-400" />
                    View Manifest Cart
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </button>
              </div>
            </div>
          )}

          {/* Matched Products */}
          {matchedProducts.length > 0 && (
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-2">
                MATCHED HARDWARE SILICON ({matchedProducts.length})
              </span>
              <div className="space-y-1.5">
                {matchedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      onClose();
                    }}
                    className="p-2 rounded-lg bg-[#070a12] hover:bg-[#12192c] border border-slate-800 hover:border-cyan-500/50 cursor-pointer flex items-center justify-between gap-3 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded overflow-hidden bg-slate-900 shrink-0">
                        <ImageWithFallback
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate max-w-sm">
                          {p.name}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          {p.brand} • {p.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold text-cyan-400 shrink-0">
                      ${p.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Categories */}
          {matchedCategories.length > 0 && (
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-2">
                CATEGORIES
              </span>
              <div className="flex flex-wrap gap-2">
                {matchedCategories.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onNavigate('catalog', c);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#070a12] hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-cyan-300 transition flex items-center gap-1.5"
                  >
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span>{c}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#07090e] border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
          <div className="flex gap-3">
            <span>Navigation: [↑↓] Navigate</span>
            <span>Selection: [ENTER] View</span>
          </div>
          <span>ElectroHub Fast Telemetry Command</span>
        </div>
      </div>
    </div>
  );
};
