import { RefreshCw, ListFilter } from "lucide-react";
import {
  CarrierTableRow,
  type CarrierData,
} from "@/components/molecules/CarrierTableRow";

const carriers: CarrierData[] = [
  {
    abbreviation: "PRU",
    color: "#eff6ff",
    name: "Prudential",
    product: "Term Essential 20",
    rating: "A+ Superior",
    monthly: "$42.15",
    annual: "$485.40",
  },
  {
    abbreviation: "PAC",
    color: "#1773cf",
    name: "Pacific Life",
    product: "PL Promise Term",
    rating: "A+ Superior",
    monthly: "$39.80",
    annual: "$452.00",
    isBestValue: true,
  },
  {
    abbreviation: "SF",
    color: "#dc2626",
    name: "State Farm",
    product: "Select Term 20",
    rating: "A++ Superior",
    monthly: "$45.50",
    annual: "$512.20",
  },
  {
    abbreviation: "PRO",
    color: "#4f46e5",
    name: "Protective",
    product: "Classic Choice Term",
    rating: "A+ Superior",
    monthly: "$41.05",
    annual: "$470.15",
  },
];

const TABLE_HEADERS = [
  { label: "Carrier", align: "left" as const },
  { label: "Product Name", align: "left" as const },
  { label: "Rating", align: "left" as const },
  { label: "Monthly", align: "left" as const },
  { label: "Annual", align: "left" as const },
  { label: "Actions", align: "right" as const },
];

function MarketComparisonTable() {
  return (
    <div className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
        <span className="text-xs font-bold uppercase tracking-[1.2px] text-slate-900">
          Market Comparison
        </span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-1 text-[10px] font-bold text-[#1773cf]"
          >
            <RefreshCw className="size-4" />
            REFRESH RATES
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-sm border border-slate-200 bg-white px-2.5 py-1.5"
          >
            <ListFilter className="size-3.5 text-slate-500" />
            <span className="text-[10px] font-bold text-slate-500">FILTER</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            {TABLE_HEADERS.map((h) => (
              <th
                key={h.label}
                className={`px-6 py-4 text-[10px] font-bold uppercase tracking-[0.5px] text-slate-500 ${
                  h.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {carriers.map((carrier) => (
            <CarrierTableRow
              key={carrier.abbreviation}
              carrier={carrier}
              isHighlighted={carrier.isBestValue}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { MarketComparisonTable };
