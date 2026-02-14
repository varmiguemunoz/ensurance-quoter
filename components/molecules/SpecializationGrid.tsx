"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Specialization {
  id: string;
  label: string;
  checked: boolean;
}

interface SpecializationGridProps {
  specializations: Specialization[];
  onToggle?: (id: string) => void;
}

function SpecializationGrid({
  specializations,
  onToggle,
}: SpecializationGridProps) {
  return (
    <div className="flex flex-col gap-4">
      <Label className="text-sm font-medium text-slate-700">
        Specializations
      </Label>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {specializations.map((spec) => (
          <label
            key={spec.id}
            className="flex cursor-pointer items-center gap-3 rounded border border-slate-200 bg-slate-50 px-3.5 py-3.5"
          >
            <Checkbox
              checked={spec.checked}
              onCheckedChange={() => onToggle?.(spec.id)}
              className="size-[18px] rounded-sm border-slate-300 data-[state=checked]:border-[#1773cf] data-[state=checked]:bg-[#1773cf]"
            />
            <span className="text-sm font-medium text-slate-700">
              {spec.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export { SpecializationGrid };
export type { Specialization };
