"use client"

import { useEffect } from "react"
import { QuoteWorkspace } from "@/components/quote/quote-workspace"
import { useLeadStore } from "@/lib/store/lead-store"

const PRODUCT_TABS = [
  { label: "FINAL EXPENSE", active: false },
  { label: "TERM LIFE", active: true },
  { label: "IUL", active: false },
  { label: "ANNUITIES", active: false },
] as const

export function QuotePageClient() {
  // /quote is anonymous — clear any lead context on mount
  useEffect(() => {
    useLeadStore.getState().setActiveLead(null)
    useLeadStore.getState().clearQuoteSession()
  }, [])

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#f6f7f8]">
      {/* Product Tabs */}
      <div className="flex items-center border-b border-[#e2e8f0] bg-white px-6">
        {PRODUCT_TABS.map((tab) => (
          <div
            key={tab.label}
            className={`flex h-9 items-center border-b-2 px-4 ${
              tab.active
                ? "border-[#1773cf] bg-[rgba(23,115,207,0.05)]"
                : "border-transparent"
            }`}
          >
            <span
              className={`text-[11px] font-bold ${
                tab.active ? "text-[#1773cf]" : "text-[#64748b]"
              }`}
            >
              {tab.label}
            </span>
          </div>
        ))}
      </div>

      <QuoteWorkspace />
    </div>
  )
}
