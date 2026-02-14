interface ProductTabProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function ProductTab({ label, isActive = false, onClick }: ProductTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-full items-center border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
        isActive
          ? "border-[#1773cf] bg-[#1773cf]/5 text-[#1773cf]"
          : "border-transparent text-slate-500 hover:text-slate-700"
      }`}
    >
      {label}
    </button>
  );
}

export { ProductTab };
