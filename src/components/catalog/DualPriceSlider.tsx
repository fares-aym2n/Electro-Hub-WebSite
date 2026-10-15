import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

interface DualPriceSliderProps {
  minLimit?: number;
  maxLimit?: number;
  step?: number;
  selectedMin: number;
  selectedMax: number;
  onChange: (minVal: number, maxVal: number) => void;
  onReset?: () => void;
}

export const DualPriceSlider: FC<DualPriceSliderProps> = ({
  minLimit = 0,
  maxLimit = 150000,
  step = 500,
  selectedMin,
  selectedMax,
  onChange,
  onReset,
}) => {
  const [localMin, setLocalMin] = useState<number>(selectedMin);
  const [localMax, setLocalMax] = useState<number>(selectedMax);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Synchronize internal state with incoming props
  useEffect(() => {
    setLocalMin(selectedMin);
  }, [selectedMin]);

  useEffect(() => {
    setLocalMax(selectedMax);
  }, [selectedMax]);

  // Debounce change notification to parent to avoid spamming network requests during drag
  const triggerDebouncedChange = (newMin: number, newMax: number) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      onChange(newMin, newMax);
    }, 250);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), localMax - step);
    const clamped = Math.max(minLimit, value);
    setLocalMin(clamped);
    triggerDebouncedChange(clamped, localMax);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), localMin + step);
    const clamped = Math.min(maxLimit, value);
    setLocalMax(clamped);
    triggerDebouncedChange(localMin, clamped);
  };

  const handleMinInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setLocalMin(minLimit);
      triggerDebouncedChange(minLimit, localMax);
      return;
    }
    const clamped = Math.min(Math.max(minLimit, val), localMax - step);
    setLocalMin(clamped);
    triggerDebouncedChange(clamped, localMax);
  };

  const handleMaxInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setLocalMax(maxLimit);
      triggerDebouncedChange(localMin, maxLimit);
      return;
    }
    const clamped = Math.max(Math.min(maxLimit, val), localMin + step);
    setLocalMax(clamped);
    triggerDebouncedChange(localMin, clamped);
  };

  const minPercent = Math.max(0, Math.min(100, ((localMin - minLimit) / (maxLimit - minLimit)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((localMax - minLimit) / (maxLimit - minLimit)) * 100));

  const hasFilter = localMin > minLimit || localMax < maxLimit;

  return (
    <div className="space-y-4">
      {/* Title & Clear Action */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#111111] uppercase tracking-wider">
          Price Range
        </span>
        {hasFilter && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] font-semibold text-[#C49B82] hover:text-[#111111] flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Selected Range Display */}
      <div className="text-xs font-mono font-bold text-[#C49B82] bg-[#FAF6F2] py-1.5 px-3 rounded-lg border border-[#DFD4C8] text-center">
        {formatPrice(localMin)} — {formatPrice(localMax)}
      </div>

      {/* Dual Handle Slider Track */}
      <div className="relative pt-2 pb-2">
        {/* Gray Background Track */}
        <div className="relative h-2 rounded-full bg-[#DFD4C8] w-full">
          {/* Active Accent Range Bar */}
          <div
            className="absolute h-full rounded-full bg-[#C49B82]"
            style={{
              left: `${minPercent}%`,
              width: `${Math.max(0, maxPercent - minPercent)}%`,
            }}
          />
        </div>

        {/* Range Inputs (Overlaid with transparent backgrounds and clickable thumbs) */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step={step}
          value={localMin}
          onChange={handleMinChange}
          aria-label="Minimum Price"
          className="pointer-events-none absolute top-1 left-0 w-full h-4 appearance-none bg-transparent focus:outline-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#111111] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#C49B82] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-xs [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#111111] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#C49B82] [&::-moz-range-thumb]:cursor-pointer"
        />

        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step={step}
          value={localMax}
          onChange={handleMaxChange}
          aria-label="Maximum Price"
          className="pointer-events-none absolute top-1 left-0 w-full h-4 appearance-none bg-transparent focus:outline-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#111111] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#C49B82] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-xs [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#111111] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#C49B82] [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>

      {/* Accessible Min / Max Numeric Inputs */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <label className="text-[10px] text-[#777777] font-semibold uppercase tracking-wider block mb-1">
            Min (EGP)
          </label>
          <input
            type="number"
            min={minLimit}
            max={localMax - step}
            step={step}
            value={localMin}
            onChange={(e) => setLocalMin(Number(e.target.value))}
            onBlur={handleMinInputBlur}
            className="w-full h-9 px-2.5 rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] text-xs text-[#111111] font-mono focus:outline-none focus:border-[#C49B82] transition"
          />
        </div>
        <div>
          <label className="text-[10px] text-[#777777] font-semibold uppercase tracking-wider block mb-1">
            Max (EGP)
          </label>
          <input
            type="number"
            min={localMin + step}
            max={maxLimit}
            step={step}
            value={localMax}
            onChange={(e) => setLocalMax(Number(e.target.value))}
            onBlur={handleMaxInputBlur}
            className="w-full h-9 px-2.5 rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] text-xs text-[#111111] font-mono focus:outline-none focus:border-[#C49B82] transition"
          />
        </div>
      </div>
    </div>
  );
};
