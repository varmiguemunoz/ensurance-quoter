import { TriangleAlert, Circle } from "lucide-react";

function ErrorDetailsCard() {
  const failureReasons = [
    "Insufficient funds in the account",
    "Incorrect billing address or zip code",
    "Card expired or not activated",
    "Bank fraud protection triggered",
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-[0_2px_15px_rgba(0,0,0,0.04)] overflow-hidden w-full">
      {/* Header row */}
      <div className="flex items-center justify-between px-6 py-6 bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <TriangleAlert className="size-6 text-red-500" />
          <h2 className="text-lg font-semibold text-slate-900">
            Error Details
          </h2>
        </div>
        <span className="bg-red-50 border border-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full">
          Failed
        </span>
      </div>

      {/* Details grid */}
      <div className="px-8 py-8">
        <div className="flex items-start justify-center gap-6">
          {/* Error Code */}
          <div className="flex-1 space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Error Code
            </p>
            <div className="bg-slate-100 rounded-sm px-2 py-1 inline-block">
              <p className="text-base font-bold text-slate-900 font-mono">
                CARD_DECLINED_001
              </p>
            </div>
          </div>

          {/* Attempted Amount */}
          <div className="flex-1 space-y-1 border-l border-slate-100 pl-6">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Attempted Amount
            </p>
            <p className="text-lg font-bold text-slate-900">$92.15</p>
          </div>

          {/* Reason */}
          <div className="flex-1 space-y-1 border-l border-slate-100 pl-6">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Reason
            </p>
            <p className="text-sm font-medium text-slate-900 leading-snug">
              Your card was declined by your bank
            </p>
          </div>
        </div>
      </div>

      {/* Common reasons footer */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-6 space-y-3">
        <h4 className="text-sm font-semibold text-slate-900">
          Common Reasons for Failure:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {failureReasons.map((reason) => (
            <div key={reason} className="flex items-center gap-2">
              <Circle className="size-2 text-slate-400 fill-slate-400 shrink-0" />
              <span className="text-sm text-slate-600">{reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { ErrorDetailsCard };
