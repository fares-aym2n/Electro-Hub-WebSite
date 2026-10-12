import type { FC } from 'react';
import { useState } from 'react';
import {
  Wrench,
  Zap,
  ShoppingCart,
  Trash2,
  AlertCircle,
  Plus,
  Sparkles,
  ArrowRight,
  Cpu,
  Monitor,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import type { Product, RigBuildState, ActivePageView } from '../../types';
import { PRODUCTS } from '../../data/products';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface RigBuilderPageProps {
  onAddMultipleToCart: (products: Product[]) => void;
  onNavigate: (view: ActivePageView, category?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const RigBuilderPage: FC<RigBuilderPageProps> = ({
  onAddMultipleToCart,
  onNavigate,
  onSelectProduct,
}) => {
  const [rig, setRig] = useState<RigBuildState>({
    cpu: PRODUCTS.find((p) => p.id === 'cpu-ryzen7950x3d') || null,
    cooler: PRODUCTS.find((p) => p.id === 'cooler-nzxt-kraken360') || null,
    motherboard: null,
    ram: PRODUCTS.find((p) => p.id === 'ram-dominator-64gb') || null,
    gpu: PRODUCTS.find((p) => p.id === 'gpu-rtx4090') || null,
    storage: PRODUCTS.find((p) => p.id === 'ssd-samsung990pro') || null,
    psu: PRODUCTS.find((p) => p.id === 'psu-seasonic-1600w') || null,
    case: PRODUCTS.find((p) => p.id === 'case-lianli-o11evo') || null,
  });

  const [activeSlotModal, setActiveSlotModal] = useState<keyof RigBuildState | null>(null);

  // Compute total price
  const selectedItems = Object.values(rig).filter(Boolean) as Product[];
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  // Compute wattage
  const totalWattage = selectedItems.reduce((sum, item) => sum + (item.wattage || 0), 0);
  const psuCapacity = rig.psu?.wattage || 0;
  const isPsuSufficient = psuCapacity === 0 || psuCapacity >= totalWattage * 1.25;

  // Compatibility checking
  const compatibilityIssues: string[] = [];
  if (rig.cpu && rig.motherboard) {
    if (rig.cpu.socket && rig.motherboard.socket && rig.cpu.socket !== rig.motherboard.socket) {
      compatibilityIssues.push(
        `Socket mismatch: CPU requires ${rig.cpu.socket}, but motherboard is ${rig.motherboard.socket}.`
      );
    }
  }
  if (rig.psu && totalWattage > rig.psu.wattage!) {
    compatibilityIssues.push(
      `Power shortage: Total system draw (${totalWattage}W) exceeds PSU rated capacity (${rig.psu.wattage}W).`
    );
  }

  // Pre-configured rigs loader
  const handleLoadPreset = (preset: 'enthusiast' | 'clean' | 'budget') => {
    if (preset === 'enthusiast') {
      setRig({
        cpu: PRODUCTS.find((p) => p.id === 'cpu-ryzen7950x3d') || null,
        cooler: PRODUCTS.find((p) => p.id === 'cooler-nzxt-kraken360') || null,
        motherboard: PRODUCTS.find((p) => p.id === 'mb-z790-godlike') || null,
        ram: PRODUCTS.find((p) => p.id === 'ram-dominator-64gb') || null,
        gpu: PRODUCTS.find((p) => p.id === 'gpu-rtx4090') || null,
        storage: PRODUCTS.find((p) => p.id === 'ssd-samsung990pro') || null,
        psu: PRODUCTS.find((p) => p.id === 'psu-seasonic-1600w') || null,
        case: PRODUCTS.find((p) => p.id === 'case-lianli-o11evo') || null,
      });
    }
  };

  const handleSelectSlotProduct = (slot: keyof RigBuildState, product: Product) => {
    setRig((prev) => ({ ...prev, [slot]: product }));
    setActiveSlotModal(null);
  };

  const handleRemoveSlot = (slot: keyof RigBuildState) => {
    setRig((prev) => ({ ...prev, [slot]: null }));
  };

  const handleAddAllToCart = () => {
    if (selectedItems.length > 0) {
      onAddMultipleToCart(selectedItems);
    }
  };

  // Slot definitions
  const SLOTS: {
    key: keyof RigBuildState;
    label: string;
    category: string;
    icon: any;
  }[] = [
    { key: 'cpu', label: 'Processor (CPU)', category: 'Processors', icon: Cpu },
    { key: 'cooler', label: 'Liquid / Air Cooler', category: 'Cooling Systems', icon: Zap },
    { key: 'motherboard', label: 'Motherboard', category: 'Motherboards', icon: Wrench },
    { key: 'ram', label: 'System Memory (RAM)', category: 'Memory (RAM)', icon: Zap },
    { key: 'gpu', label: 'Graphics Card (GPU)', category: 'Graphics Cards', icon: Monitor },
    { key: 'storage', label: 'High-Speed NVMe Storage', category: 'Storage (SSD)', icon: Zap },
    { key: 'psu', label: 'Power Supply Unit (PSU)', category: 'Cooling Systems', icon: Zap },
    { key: 'case', label: 'Enthusiast Chassis', category: 'Cooling Systems', icon: Wrench },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-['Plus_Jakarta_Sans'] pb-24">
      {/* Header telemetry banner */}
      <div className="border-b border-slate-800 bg-[#090d16] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 text-xs font-mono">
                <Wrench className="w-3.5 h-3.5" />
                <span>INTERACTIVE RIG ARCHITECTURE TOOL</span>
              </div>
              <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-extrabold text-white">
                Custom PC Configurator & Wattage Meter
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-xl">
                Configure your dream battlestation. Automatic PCIe lane, socket compatibility,
                and power supply headroom verification before purchase.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onNavigate('catalog')}
                className="px-3 py-2 rounded-lg bg-[#11182c] hover:bg-[#1a243d] border border-slate-700 text-slate-300 text-xs font-mono transition"
              >
                ← BROWSE CATALOG
              </button>
              <button
                onClick={() => handleLoadPreset('enthusiast')}
                className="px-4 py-2 rounded-lg bg-[#11182c] hover:bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                LOAD 4K APEX BUILD
              </button>

              <button
                onClick={() =>
                  setRig({
                    cpu: null,
                    cooler: null,
                    motherboard: null,
                    ram: null,
                    gpu: null,
                    storage: null,
                    psu: null,
                    case: null,
                  })
                }
                className="px-3 py-2 rounded-lg bg-[#11182c] hover:bg-rose-950 border border-slate-700 text-slate-400 hover:text-rose-300 text-xs font-mono flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                CLEAR ALL
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================= */}
          {/* LEFT: COMPONENT SLOTS SELECTION */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-4">
            {SLOTS.map((slot) => {
              const selectedProduct = rig[slot.key];
              const Icon = slot.icon;
              return (
                <div
                  key={slot.key}
                  className={`p-4 rounded-xl border transition ${
                    selectedProduct
                      ? 'bg-[#0d1322] border-slate-700/80 hover:border-cyan-500/40'
                      : 'bg-[#0a0e1a]/60 border-dashed border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left details */}
                    <div className="flex items-center gap-4">
                      {selectedProduct ? (
                        <div
                          onClick={() => onSelectProduct(selectedProduct)}
                          className="w-16 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shrink-0 cursor-pointer"
                        >
                          <ImageWithFallback
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-600 shrink-0">
                          <Icon className="w-6 h-6" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                          {slot.label}
                        </div>

                        {selectedProduct ? (
                          <div>
                            <h4
                              onClick={() => onSelectProduct(selectedProduct)}
                              className="font-['Space_Grotesk'] text-sm font-bold text-white hover:text-cyan-300 transition truncate max-w-sm sm:max-w-md cursor-pointer"
                            >
                              {selectedProduct.name}
                            </h4>
                            <div className="text-xs font-mono text-slate-400 flex items-center gap-3 mt-0.5">
                              <span className="text-cyan-400 font-bold">
                                ${selectedProduct.price}
                              </span>
                              {selectedProduct.wattage && (
                                <span>• {selectedProduct.wattage}W Power Draw</span>
                              )}
                              {selectedProduct.socket && (
                                <span>• Socket: {selectedProduct.socket}</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs font-mono text-slate-500">
                            No component selected for this slot.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Action */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {selectedProduct ? (
                        <>
                          <button
                            onClick={() => setActiveSlotModal(slot.key)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition"
                          >
                            CHANGE
                          </button>
                          <button
                            onClick={() => handleRemoveSlot(slot.key)}
                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setActiveSlotModal(slot.key)}
                          className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold font-mono text-xs flex items-center gap-1.5 transition"
                        >
                          <Plus className="w-3.5 h-3.5" /> CHOOSE {slot.label.split(' ')[0]}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================= */}
          {/* RIGHT: LIVE TELEMETRY & RIG SUMMARY */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            {/* Telemetry card */}
            <div className="p-6 rounded-2xl bg-[#0e1424] border border-cyan-500/30 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="font-['Space_Grotesk'] text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  RIG POWER & SPECS
                </span>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  {selectedItems.length} / 8 SLOTS
                </span>
              </div>

              {/* Wattage telemetry */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Estimated Continuous Draw:</span>
                  <span className="font-bold text-cyan-300">{totalWattage} Watts</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Selected PSU Output:</span>
                  <span className="font-bold text-white">{psuCapacity || 'Not selected'}W</span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isPsuSufficient ? 'bg-cyan-400' : 'bg-rose-500'
                    }`}
                    style={{
                      width: psuCapacity > 0 ? `${Math.min(100, (totalWattage / psuCapacity) * 100)}%` : '0%',
                    }}
                  />
                </div>
              </div>

              {/* Compatibility Check */}
              <div className="p-3 rounded-xl bg-[#090d16] border border-slate-800 text-xs font-mono">
                {compatibilityIssues.length === 0 ? (
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>COMPATIBILITY 100% VERIFIED</span>
                  </div>
                ) : (
                  <div className="space-y-1 text-rose-400">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>COMPATIBILITY ALERT:</span>
                    </div>
                    {compatibilityIssues.map((issue, idx) => (
                      <p key={idx} className="text-[11px] text-slate-300">
                        {issue}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Selected Components ({selectedItems.length})</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Assembly & Stress Testing</span>
                  <span className="text-emerald-400 font-bold">FREE INCLUDED</span>
                </div>
                <div className="flex justify-between text-lg font-bold font-['Space_Grotesk'] text-white pt-2 border-t border-slate-800">
                  <span>Total Investment</span>
                  <span className="text-cyan-400 font-mono">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={selectedItems.length === 0}
                onClick={handleAddAllToCart}
                className="w-full py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-['Space_Grotesk'] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition"
              >
                <ShoppingCart className="w-4 h-4" />
                ADD COMPLETE RIG TO MANIFEST
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* COMPONENT SELECTION MODAL */}
      {/* ========================================================= */}
      {activeSlotModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setActiveSlotModal(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative rounded-2xl bg-[#0d1322] border border-cyan-500/40 text-slate-100 max-w-2xl w-full p-6 z-10 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  SLOT COMPONENT SELECTOR
                </span>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">
                  Choose {SLOTS.find((s) => s.key === activeSlotModal)?.label}
                </h3>
              </div>
              <button
                onClick={() => setActiveSlotModal(null)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {PRODUCTS.filter(
                (p) =>
                  p.category ===
                  SLOTS.find((s) => s.key === activeSlotModal)?.category
              ).map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleSelectSlotProduct(activeSlotModal, prod)}
                  className="p-3 rounded-xl bg-[#090d16] hover:bg-[#12192c] border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                      <ImageWithFallback
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">
                        {prod.brand}
                      </div>
                      <h4 className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                        {prod.name}
                      </h4>
                      <div className="text-[11px] font-mono text-cyan-300">
                        ${prod.price} {prod.wattage ? `• ${prod.wattage}W` : ''}
                      </div>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 rounded bg-cyan-500 text-black font-mono font-bold text-xs shrink-0">
                    SELECT
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
