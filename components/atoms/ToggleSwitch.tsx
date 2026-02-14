"use client";

interface ToggleSwitchProps {
  options: [string, string];
  activeIndex: number;
  onToggle?: (index: number) => void;
}

function ToggleSwitch({ options, activeIndex, onToggle }: ToggleSwitchProps) {
  return (
    <div className="flex w-full gap-1 rounded-sm border border-slate-200 bg-gray-100 p-[5px]">
      {options.map((option, i) => (
        <button
          key={option}
          type="button"
          onClick={() => onToggle?.(i)}
          className={`flex-1 rounded-sm py-[7px] text-center text-[10px] font-bold uppercase transition-all ${
            i === activeIndex
              ? "border border-gray-200 bg-white text-[#1773cf] shadow-sm"
              : "text-slate-500"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export { ToggleSwitch };
