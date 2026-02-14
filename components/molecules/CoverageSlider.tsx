"use client";

interface CoverageSliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })}M`;
  }
  return `$${value.toLocaleString("en-US")}`;
}

function CoverageSlider({
  value,
  min = 100_000,
  max = 5_000_000,
  onChange,
}: CoverageSliderProps) {
  const displayValue = `$${value.toLocaleString("en-US")}`;

  return (
    <div className="flex flex-col gap-8">
      {/* Header: Label + Value */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase leading-4 tracking-[1.2px] text-slate-500">
          Coverage
          <br />
          Amount
        </span>
        <span className="rounded-sm border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xl font-bold text-[#1773cf]">
          {displayValue}
        </span>
      </div>

      {/* Slider track */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={50_000}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200
            [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px]
            [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#1773cf]
            [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
        />
      </div>

      {/* Range labels */}
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10px] font-bold text-slate-500">
          $100k
        </span>
        <span className="font-mono text-[10px] font-bold text-slate-500">
          $2.5M
        </span>
        <span className="font-mono text-[10px] font-bold text-slate-500">
          $5M
        </span>
      </div>
    </div>
  );
}

export { CoverageSlider };
