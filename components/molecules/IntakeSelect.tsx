import { ChevronDown } from "lucide-react";

interface IntakeSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
}

function IntakeSelect({ label, value, options, onChange }: IntakeSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase text-slate-500">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full appearance-none rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 pr-8 text-sm font-medium text-slate-900"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}

export { IntakeSelect };
