interface DurationButtonProps {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
}

function DurationButton({
  label,
  isSelected = false,
  onClick,
}: DurationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-sm px-5 py-3 text-xs font-bold transition-all ${
        isSelected
          ? "bg-[#1773cf] text-white shadow-[0_0_0_2px_white,0_0_0_4px_#1773cf,0_4px_6px_-1px_rgba(23,115,207,0.3)]"
          : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

export { DurationButton };
