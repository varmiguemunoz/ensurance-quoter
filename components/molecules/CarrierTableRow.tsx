import { CarrierBadge } from "@/components/atoms/CarrierBadge";
import { StatusBadge } from "@/components/atoms/StatusBadge";

interface CarrierData {
  abbreviation: string;
  color: string;
  name: string;
  product: string;
  rating: string;
  monthly: string;
  annual: string;
  isBestValue?: boolean;
}

interface CarrierTableRowProps {
  carrier: CarrierData;
  isHighlighted?: boolean;
  onApply?: () => void;
}

function CarrierTableRow({
  carrier,
  isHighlighted = false,
  onApply,
}: CarrierTableRowProps) {
  return (
    <tr
      className={`border-t border-slate-200 ${
        isHighlighted ? "bg-blue-50/40" : ""
      }`}
    >
      {/* Carrier */}
      <td className="py-5 pl-6">
        <div className="flex items-center gap-3">
          <CarrierBadge
            abbreviation={carrier.abbreviation}
            color={carrier.color}
          />
          <span className="text-sm font-bold text-slate-900">
            {carrier.name}
          </span>
        </div>
      </td>

      {/* Product Name */}
      <td className="px-6 py-5">
        <span className="text-xs font-medium text-slate-500">
          {carrier.product}
        </span>
      </td>

      {/* Rating */}
      <td className="px-6 py-5">
        <StatusBadge label={carrier.rating} variant="info" />
      </td>

      {/* Monthly */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <span
            className={`text-lg font-bold tracking-tight ${
              carrier.isBestValue ? "text-green-600" : "text-slate-900"
            }`}
          >
            {carrier.monthly}
          </span>
          {carrier.isBestValue && (
            <StatusBadge
              label="BEST VALUE"
              variant="success"
              className="text-[8px]"
            />
          )}
        </div>
      </td>

      {/* Annual */}
      <td className="px-6 py-5">
        <span className="text-xs font-medium text-slate-500">
          {carrier.annual}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-5 text-right">
        <button
          type="button"
          onClick={onApply}
          className={`rounded-sm px-3.5 py-2 text-[10px] font-bold uppercase shadow-sm transition-colors ${
            isHighlighted
              ? "bg-[#1773cf] text-white shadow-[0_4px_6px_-1px_rgba(59,130,246,0.2)]"
              : "border border-[#1773cf] bg-white text-[#1773cf] hover:bg-blue-50"
          }`}
        >
          Apply Now
        </button>
      </td>
    </tr>
  );
}

export { CarrierTableRow };
export type { CarrierData };
