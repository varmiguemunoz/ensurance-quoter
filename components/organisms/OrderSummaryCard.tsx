import { ShieldCheck } from "lucide-react";

function OrderSummaryCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden w-full lg:w-[415px] shrink-0">
      {/* Plan Info */}
      <div className="p-6 space-y-6">
        {/* Header: Plan badge + name + carrier + tags */}
        <div className="flex gap-4 items-start border-b border-slate-100 pb-6">
          <div className="bg-blue-100 rounded-sm size-[52px] flex items-center justify-center shrink-0">
            <span className="text-blue-700 font-bold text-xl">P</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Term Essential 20
            </h3>
            <p className="text-sm text-slate-500">Prudential Financial</p>
            <div className="flex gap-2 mt-2">
              <span className="bg-slate-100 text-slate-800 text-xs font-medium px-2 py-0.5 rounded-sm">
                20 Years
              </span>
              <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-sm">
                $1,000,000
              </span>
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Monthly Premium</span>
            <span className="text-sm text-slate-600">$42.15</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">
              One-time Application Fee
            </span>
            <span className="text-sm text-slate-600">$50.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-600">
              Medical Exam Fee (Waived)
            </span>
            <span className="text-xs text-green-600">-$150.00</span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-slate-100 pt-5 space-y-1">
          <div className="flex items-end justify-between">
            <span className="text-sm font-medium text-slate-700">
              Total Due Today
            </span>
            <span className="text-2xl font-bold text-slate-900">$92.15</span>
          </div>
          <p className="text-xs text-slate-400 text-right">
            Includes all applicable taxes &amp; fees
          </p>
        </div>
      </div>

      {/* Security note */}
      <div className="bg-slate-50 border-t border-slate-100 px-4 py-4">
        <div className="flex gap-3 items-start">
          <ShieldCheck className="size-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed">
            You are protected by our secure payment guarantee. Your premium will
            not increase during the application process.
          </p>
        </div>
      </div>
    </div>
  );
}

export { OrderSummaryCard };
