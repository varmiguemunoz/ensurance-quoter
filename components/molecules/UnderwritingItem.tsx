import { type LucideIcon } from "lucide-react";
import {
  StatusBadge,
  type StatusVariant,
} from "@/components/atoms/StatusBadge";

interface UnderwritingItemProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  label: string;
  statusLabel: string;
  statusVariant: StatusVariant;
}

function UnderwritingItem({
  icon: Icon,
  iconBgColor,
  iconColor,
  label,
  statusLabel,
  statusVariant,
}: UnderwritingItemProps) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-sm p-1"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon className="size-4" style={{ color: iconColor }} />
        </div>
        <span className="text-xs font-semibold text-slate-900">{label}</span>
      </div>
      <StatusBadge label={statusLabel} variant={statusVariant} />
    </div>
  );
}

export { UnderwritingItem };
