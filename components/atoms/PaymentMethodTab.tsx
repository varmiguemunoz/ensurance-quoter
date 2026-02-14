import { cn } from "@/lib/utils";
import { CreditCard, Landmark } from "lucide-react";

type PaymentMethod = "card" | "ach";

interface PaymentMethodTabProps {
  method: PaymentMethod;
  isActive?: boolean;
  onClick?: () => void;
}

const tabConfig: Record<
  PaymentMethod,
  { icon: typeof CreditCard; label: string }
> = {
  card: { icon: CreditCard, label: "Card" },
  ach: { icon: Landmark, label: "Bank ACH" },
};

function PaymentMethodTab({
  method,
  isActive = false,
  onClick,
}: PaymentMethodTabProps) {
  const { icon: Icon, label } = tabConfig[method];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 py-2.5 flex-1 rounded-md text-sm font-medium transition-all",
        isActive
          ? "bg-white text-[#1773cf] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
          : "text-slate-700 hover:text-slate-900",
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}

export { PaymentMethodTab };
export type { PaymentMethod };
