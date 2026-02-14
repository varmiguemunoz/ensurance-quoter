function PaymentNavBar() {
  return (
    <nav className="bg-white border-b border-slate-200 flex items-center justify-between px-6 py-4">
      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-2">
        <div className="bg-[#1773cf] flex items-center justify-center rounded-sm size-8">
          <span className="text-white font-bold text-base">Q</span>
        </div>
        <span className="font-semibold text-slate-900 text-lg tracking-tight">
          My Insurance Quoter
        </span>
      </div>

      {/* Right: Agent ID */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500">Agent ID:</span>
        <span className="font-semibold text-slate-900">#8942-B</span>
      </div>
    </nav>
  );
}

export { PaymentNavBar };
