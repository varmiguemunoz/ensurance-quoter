import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type StepStatus = "completed" | "active" | "pending";

interface StepIndicatorProps {
  step: number;
  status?: StepStatus;
  className?: string;
}

function StepIndicator({
  step,
  status = "pending",
  className,
}: StepIndicatorProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl size-8 text-sm font-bold shrink-0",
        status === "completed" && "bg-[#1773cf] text-white",
        status === "active" &&
          "bg-[#1773cf] text-white shadow-[0_0_0_4px_rgba(23,115,207,0.2)]",
        status === "pending" && "bg-slate-200 text-slate-500",
        className,
      )}
    >
      {status === "completed" ? (
        <Check className="size-3.5" strokeWidth={3} />
      ) : (
        step
      )}
    </div>
  );
}

export { StepIndicator };
export type { StepStatus };
