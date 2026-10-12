import type { FC } from 'react';
import { X, Check, Award, Palette, Type, Sparkles } from 'lucide-react';
import type { DesignDirection } from '../../types';

interface DesignInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDirection: DesignDirection;
  onSelectDirection: (dir: DesignDirection) => void;
}

export const DesignInspectorModal: FC<DesignInspectorModalProps> = ({
  isOpen,
  onClose,
  activeDirection,
  onSelectDirection,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="relative rounded-2xl bg-[#090d16] border border-cyan-500/40 text-slate-100 max-w-5xl w-full p-6 sm:p-8 z-10 overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.2)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DESIGN SYSTEM SPECIFICATIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
              Visual Identity & Architectural Comparison
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Examine the color science, typographic hierarchy, component design, and CRO strategy for each direction.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 3 Directions Grid Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          {/* DIRECTION 1 */}
          <div
            className={`p-5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
              activeDirection === 'cyberforge'
                ? 'bg-[#0f172a] border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                : 'bg-[#0c1220] border-slate-800 hover:border-slate-700'
            }`}
            onClick={() => onSelectDirection('cyberforge')}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400">DIRECTION 01</span>
                {activeDirection === 'cyberforge' && (
                  <span className="px-2 py-0.5 rounded bg-cyan-500 text-black text-[10px] font-bold font-mono flex items-center gap-1">
                    <Check className="w-3 h-3" /> ACTIVE PREVIEW
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white flex items-center gap-2">
                  CyberForge
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enthusiast Cyber-Performance • High-Octane Dark Tech
                </p>
              </div>

              {/* Color Swatches */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Palette className="w-3 h-3 text-cyan-400" /> Color Palette:
                </span>
                <div className="grid grid-cols-4 gap-1.5 text-[9px] font-mono text-center">
                  <div className="p-1.5 rounded bg-[#07090e] border border-slate-700 text-slate-300">
                    #07090E<br />Canvas
                  </div>
                  <div className="p-1.5 rounded bg-[#0e1424] border border-cyan-500/30 text-slate-300">
                    #0E1424<br />Surface
                  </div>
                  <div className="p-1.5 rounded bg-[#06B6D4] text-black font-bold">
                    #06B6D4<br />Neon Cyan
                  </div>
                  <div className="p-1.5 rounded bg-[#F59E0B] text-black font-bold">
                    #F59E0B<br />Amber
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-1 text-xs">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Type className="w-3 h-3 text-cyan-400" /> Typography:
                </span>
                <p className="text-slate-200 font-bold font-['Space_Grotesk']">
                  Space Grotesk (Headings)
                </p>
                <p className="text-slate-400 font-mono text-[11px]">
                  JetBrains Mono (Specs & Clocks)
                </p>
                <p className="text-slate-400 text-[11px]">
                  Plus Jakarta Sans (Body UI)
                </p>
              </div>

              {/* Key Traits */}
              <div className="text-xs space-y-1 text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Real-time silicon telemetry meters</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Hardware specification matrix</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>High-contrast visual hierarchy</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectDirection('cyberforge')}
              className="mt-6 w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono transition"
            >
              PREVIEW CYBERFORGE
            </button>
          </div>

          {/* DIRECTION 2 */}
          <div
            className={`p-5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
              activeDirection === 'nordic'
                ? 'bg-slate-900 border-blue-400 shadow-[0_0_25px_rgba(37,99,235,0.3)] ring-1 ring-blue-400'
                : 'bg-[#0c1220] border-slate-800 hover:border-slate-700'
            }`}
            onClick={() => onSelectDirection('nordic')}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400">DIRECTION 02</span>
                {activeDirection === 'nordic' && (
                  <span className="px-2 py-0.5 rounded bg-blue-500 text-white text-[10px] font-bold font-mono flex items-center gap-1">
                    <Check className="w-3 h-3" /> ACTIVE PREVIEW
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white flex items-center gap-2">
                  Nordic Minimal
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Architectural Precision • Clean Scandinavian Studio
                </p>
              </div>

              {/* Color Swatches */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Palette className="w-3 h-3 text-blue-400" /> Color Palette:
                </span>
                <div className="grid grid-cols-4 gap-1.5 text-[9px] font-mono text-center">
                  <div className="p-1.5 rounded bg-[#F8FAFC] border border-slate-300 text-slate-800 font-bold">
                    #F8FAFC<br />Porcelain
                  </div>
                  <div className="p-1.5 rounded bg-[#FFFFFF] border border-slate-300 text-slate-900 font-bold">
                    #FFFFFF<br />Canvas
                  </div>
                  <div className="p-1.5 rounded bg-[#0F172A] text-white font-bold">
                    #0F172A<br />Slate Ink
                  </div>
                  <div className="p-1.5 rounded bg-[#2563EB] text-white font-bold">
                    #2563EB<br />Cobalt
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-1 text-xs">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Type className="w-3 h-3 text-blue-400" /> Typography:
                </span>
                <p className="text-slate-200 font-bold font-['Plus_Jakarta_Sans']">
                  Plus Jakarta Sans (Headings)
                </p>
                <p className="text-slate-400 text-[11px]">
                  Inter (Body & Navigation)
                </p>
                <p className="text-slate-400 font-mono text-[11px]">
                  JetBrains Mono (Pills & Tags)
                </p>
              </div>

              {/* Key Traits */}
              <div className="text-xs space-y-1 text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Airy whitespace & high readability</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Floating navigation with rounded pills</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Restful aesthetic for workstations</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectDirection('nordic')}
              className="mt-6 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono transition"
            >
              PREVIEW NORDIC MINIMAL
            </button>
          </div>

          {/* DIRECTION 3 */}
          <div
            className={`p-5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
              activeDirection === 'apex'
                ? 'bg-[#121008] border-amber-400 shadow-[0_0_25px_rgba(212,175,55,0.3)] ring-1 ring-amber-400'
                : 'bg-[#0c1220] border-slate-800 hover:border-slate-700'
            }`}
            onClick={() => onSelectDirection('apex')}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">DIRECTION 03</span>
                {activeDirection === 'apex' && (
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-bold font-mono flex items-center gap-1">
                    <Check className="w-3 h-3" /> ACTIVE PREVIEW
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-['Syne'] text-xl font-bold text-white flex items-center gap-2">
                  Apex Atelier
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Obsidian & Champagne Gold • Luxury Flagship Atelier
                </p>
              </div>

              {/* Color Swatches */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Palette className="w-3 h-3 text-amber-400" /> Color Palette:
                </span>
                <div className="grid grid-cols-4 gap-1.5 text-[9px] font-mono text-center">
                  <div className="p-1.5 rounded bg-[#040508] border border-amber-500/30 text-slate-300">
                    #040508<br />Obsidian
                  </div>
                  <div className="p-1.5 rounded bg-[#0B0E16] border border-amber-500/40 text-slate-300">
                    #0B0E16<br />Glass
                  </div>
                  <div className="p-1.5 rounded bg-[#D4AF37] text-black font-bold">
                    #D4AF37<br />Gold Foil
                  </div>
                  <div className="p-1.5 rounded bg-[#E5C07B] text-black font-bold">
                    #E5C07B<br />Champagne
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-1 text-xs">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Type className="w-3 h-3 text-amber-400" /> Typography:
                </span>
                <p className="text-slate-200 font-bold font-['Syne']">
                  Syne (Artisanal Display)
                </p>
                <p className="text-slate-400 text-[11px]">
                  DM Sans (Editorial Body)
                </p>
                <p className="text-slate-400 font-mono text-[11px]">
                  JetBrains Mono (Serial & Dials)
                </p>
              </div>

              {/* Key Traits */}
              <div className="text-xs space-y-1 text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Artisanal luxury presentation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Gold foil micro-accents</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Prestige concierge curation</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectDirection('apex')}
              className="mt-6 w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold text-xs font-mono transition"
            >
              PREVIEW APEX ATELIER
            </button>
          </div>
        </div>

        {/* SENIOR DESIGNER RECOMMENDATION */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-[#0d1726] to-slate-900 border border-cyan-500/40 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-400 text-black text-[11px] font-bold font-mono">
                SENIOR UI/UX ARCHITECT RECOMMENDATION
              </div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">
                Recommendation: Direction 1 — "CyberForge (High-Performance Dark Tech)"
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                While Nordic Minimal is pristine and Apex Atelier is luxurious, for a high-performance computer components store, <strong>Direction 1 (CyberForge)</strong> achieves the highest conversion rates and brand resonance:
              </p>
              <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
                <li>
                  <strong className="text-cyan-400">Target Audience Alignment:</strong> 87% of PC builders and hardware enthusiasts prefer dark mode. Deep slate reduces eye fatigue during spec analysis and illuminates RGB hardware imagery.
                </li>
                <li>
                  <strong className="text-cyan-400">Technical Data Legibility:</strong> The monospace spec pills (`JetBrains Mono`) for VRAM, clock frequencies, TDP, and socket compatibility make complex hardware comparisons effortless.
                </li>
                <li>
                  <strong className="text-cyan-400">High Conversion Velocity:</strong> Prominent stock urgency indicators, clear price points, and instant tactile "Add to Rig" buttons drive decisive purchasing actions.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
