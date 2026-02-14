import { cn } from "@/lib/utils";

type StatusVariant = "info" | "success" | "neutral" | "successOutline";

const variantStyles: Record<StatusVariant, string> = {
  info: "bg-blue-50 border-blue-200 text-blue-700",
  success: "bg-green-100 border-green-300 text-green-700",
  neutral: "bg-gray-200 border-gray-200 text-slate-500",
  successOutline: "bg-green-100 border-green-300 text-green-700",
};

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  className?: string;
}

function StatusBadge({
  label,
  variant = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-sm border px-1.5 py-0.5 text-[10px] font-bold uppercase",
        variantStyles[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}

export { StatusBadge };
export type { StatusVariant };
