import { Receipt, CreditCard, BadgeCheck } from "lucide-react";

function ConfirmationDetailsCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-[0_2px_15px_rgba(0,0,0,0.04)] overflow-hidden w-full">
      {/* Header row */}
      <div className="flex items-center justify-between px-6 py-6 bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Receipt className="size-6 text-[#1773cf]" />
          <h2 className="text-lg font-semibold text-slate-900">
            Confirmation Details
          </h2>
        </div>
        <span className="bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-blue-500" />
          Processing
        </span>
      </div>

      {/* Details grid */}
      <div className="px-8 py-8">
        <div className="flex items-start justify-center gap-6">
          {/* Confirmation Number */}
          <div className="flex-1 space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Confirmation Number
            </p>
            <p className="text-lg font-bold text-slate-900 font-mono">
              #AG-2026-00842
            </p>
          </div>

          {/* Payment Amount */}
          <div className="flex-1 space-y-1 border-l border-slate-100 pl-6">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Payment Amount
            </p>
            <p className="text-lg font-bold text-slate-900">$92.15</p>
          </div>

          {/* Payment Method */}
          <div className="flex-1 space-y-1 border-l border-slate-100 pl-6">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Payment Method
            </p>
            <div className="flex items-center gap-2">
              <CreditCard className="size-[18px] text-slate-400" />
              <span className="text-base font-medium text-slate-900">
                •••• 4242
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success note */}
      <div className="bg-green-50 border-t border-green-100 px-6 py-4 flex items-start gap-3">
        <BadgeCheck className="size-4 text-green-600 mt-0.5 shrink-0" />
        <p className="text-xs font-medium text-green-800">
          A receipt has been sent to the client&apos;s email address on file.
          The application is now in the carrier&apos;s queue.
        </p>
      </div>
    </div>
  );
}

export { ConfirmationDetailsCard };
