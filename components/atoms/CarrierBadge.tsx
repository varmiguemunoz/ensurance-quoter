interface CarrierBadgeProps {
  abbreviation: string;
  color: string;
}

function CarrierBadge({ abbreviation, color }: CarrierBadgeProps) {
  return (
    <div
      className="flex size-8 shrink-0 items-center justify-center rounded-sm shadow-sm"
      style={{ backgroundColor: color }}
    >
      <span className="text-[10px] font-black text-white">{abbreviation}</span>
    </div>
  );
}

export { CarrierBadge };
