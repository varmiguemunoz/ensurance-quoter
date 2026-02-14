function QuoteEngineHeader() {
  return (
    <div className="flex items-end justify-between">
      {/* Left: Title + Meta */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Term Life Quote Engine
        </h1>
        <div className="flex items-center gap-2">
          <span className="rounded-sm bg-[#1773cf]/10 px-1.5 py-0.5 text-xs font-bold text-[#1773cf]">
            LIVE SESSION
          </span>
          <span className="text-xs text-gray-300">|</span>
          <span className="text-xs font-medium text-slate-500">
            Client:{" "}
            <span className="font-semibold text-slate-900">John Doe</span>
          </span>
          <span className="text-xs text-gray-300">|</span>
          <span className="text-xs font-medium text-slate-500">45yo M</span>
          <span className="text-xs text-gray-300">|</span>
          <span className="text-xs font-medium text-slate-500">
            Preferred Plus Non-Tobacco
          </span>
        </div>
      </div>

      {/* Right: API Status */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase text-slate-500">
          API Status:
        </span>
        <div className="flex items-center gap-1.5 rounded-sm border border-green-200 bg-green-50 px-2.5 py-1.5 shadow-sm">
          <div className="size-1.5 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.6)]" />
          <span className="text-[10px] font-bold uppercase text-green-700">
            12 Carriers Linked
          </span>
        </div>
      </div>
    </div>
  );
}

export { QuoteEngineHeader };
