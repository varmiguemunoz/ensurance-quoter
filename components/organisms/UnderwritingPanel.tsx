import { Stethoscope, Zap, Database } from "lucide-react";
import { UnderwritingItem } from "@/components/molecules/UnderwritingItem";

function UnderwritingPanel() {
  return (
    <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4">
        <span className="text-xs font-bold uppercase tracking-[1.2px] text-slate-500">
          Underwriting Req.
        </span>
        <div className="flex flex-col gap-3">
          <UnderwritingItem
            icon={Stethoscope}
            iconBgColor="#dbeafe"
            iconColor="#1773cf"
            label="Paramedical Exam"
            statusLabel="REQUIRED"
            statusVariant="neutral"
          />
          <UnderwritingItem
            icon={Zap}
            iconBgColor="#dcfce7"
            iconColor="#16a34a"
            label="Accelerated Approval"
            statusLabel="ELIGIBLE"
            statusVariant="success"
          />
          <UnderwritingItem
            icon={Database}
            iconBgColor="#e5e7eb"
            iconColor="#4b5563"
            label="MIB & Rx Check"
            statusLabel="AUTOMATED"
            statusVariant="neutral"
          />
        </div>
      </div>
    </div>
  );
}

export { UnderwritingPanel };
