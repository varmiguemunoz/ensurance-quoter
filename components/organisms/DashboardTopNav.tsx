"use client";

import { useState } from "react";
import { Search, Save } from "lucide-react";
import { ProductTab } from "@/components/atoms/ProductTab";

const PRODUCTS = ["FINAL EXPENSE", "TERM LIFE", "IUL", "ANNUITIES"];

function DashboardTopNav() {
  const [activeTab, setActiveTab] = useState("TERM LIFE");

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-2 shadow-sm">
      {/* Left: Product Tabs */}
      <nav className="flex h-10 items-center">
        {PRODUCTS.map((p) => (
          <ProductTab
            key={p}
            label={p}
            isActive={p === activeTab}
            onClick={() => setActiveTab(p)}
          />
        ))}
      </nav>

      {/* Right: Search + Timer + Save */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="CRM Lookup / Client Search..."
            className="w-full rounded border border-slate-200 bg-slate-50 pb-2.5 pl-10 pr-3.5 pt-2 text-xs"
          />
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 rounded border border-slate-200 bg-white px-3.5 py-[7px] shadow-sm">
          <div className="size-2 rounded-full bg-red-500 shadow-[0_1px_2px_rgba(239,68,68,0.5)]" />
          <span className="font-mono text-xs font-bold text-slate-900">
            00:12:45
          </span>
        </div>

        {/* Save Quote */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-sm bg-[#1773cf] px-4 py-1.5 shadow-[0_4px_6px_-1px_rgba(59,130,246,0.2)] transition-colors hover:bg-[#1565b8]"
        >
          <Save className="size-3.5 text-white" />
          <span className="text-xs font-bold text-white">SAVE QUOTE</span>
        </button>
      </div>
    </div>
  );
}

export { DashboardTopNav };
