import type { FC } from 'react';
import {
  Palette,
  Zap,
  Layers,
  Crown,
  Monitor,
  Tablet,
  Smartphone,
  Info,
} from 'lucide-react';
import type { DesignDirection } from '../../types';

interface DesignSwitcherBarProps {
  currentDirection: DesignDirection;
  onSelectDirection: (dir: DesignDirection) => void;
  onOpenInspector: () => void;
  viewportWidth: 'full' | 'tablet' | 'mobile';
  onChangeViewport: (vp: 'full' | 'tablet' | 'mobile') => void;
}

export const DesignSwitcherBar: FC<DesignSwitcherBarProps> = ({
  currentDirection,
  onSelectDirection,
  onOpenInspector,
  viewportWidth,
  onChangeViewport,
}) => {
  return (
    <div className="sticky top-0 z-50 bg-[#070a12]/95 backdrop-blur-md border-b border-cyan-500/30 text-white shadow-xl px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Design Direction Tabs */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider hidden sm:inline flex items-center gap-1 mr-1">
            <Palette className="w-3.5 h-3.5" />
            MOCKUPS:
          </span>

          {/* Direction 1 */}
          <button
            onClick={() => onSelectDirection('cyberforge')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              currentDirection === 'cyberforge'
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                : 'bg-[#101728] hover:bg-[#16213a] text-slate-300 border border-slate-700/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden md:inline">1.</span> CYBERFORGE
            <span className="hidden lg:inline text-[10px] opacity-75 font-normal">
              (Dark Tech)
            </span>
          </button>

          {/* Direction 2 */}
          <button
            onClick={() => onSelectDirection('nordic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              currentDirection === 'nordic'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                : 'bg-[#101728] hover:bg-[#16213a] text-slate-300 border border-slate-700/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">2.</span> NORDIC MINIMAL
            <span className="hidden lg:inline text-[10px] opacity-75 font-normal">
              (Clean Light)
            </span>
          </button>

          {/* Direction 3 */}
          <button
            onClick={() => onSelectDirection('apex')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              currentDirection === 'apex'
                ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-[0_0_15px_rgba(212,175,55,0.5)]'
                : 'bg-[#101728] hover:bg-[#16213a] text-slate-300 border border-slate-700/60'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span className="hidden md:inline">3.</span> APEX ATELIER
            <span className="hidden lg:inline text-[10px] opacity-75 font-normal">
              (Luxe Gold)
            </span>
          </button>
        </div>

        {/* Right: Viewport test & Inspector */}
        <div className="flex items-center gap-2">
          {/* Viewport Resizer buttons */}
          <div className="hidden lg:flex items-center bg-[#101728] rounded-lg p-0.5 border border-slate-700/60 text-xs">
            <button
              onClick={() => onChangeViewport('full')}
              title="Full Desktop"
              className={`p-1.5 rounded ${
                viewportWidth === 'full'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeViewport('tablet')}
              title="Tablet Width (768px)"
              className={`p-1.5 rounded ${
                viewportWidth === 'tablet'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeViewport('mobile')}
              title="Mobile Width (390px)"
              className={`p-1.5 rounded ${
                viewportWidth === 'mobile'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Design Inspector Modal button */}
          <button
            onClick={onOpenInspector}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>DESIGN SYSTEM SPECS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
