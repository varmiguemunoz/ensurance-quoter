"use client"

import { useEffect } from "react"
import { Save, Search } from "lucide-react"
import { QuoteWorkspace } from "@/components/quote/quote-workspace"
import { useLeadStore } from "@/lib/store/lead-store"

const NAV_TABS = [
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
    <div className="flex h-screen flex-col bg-[#f6f7f8]">
      {/* Top Navigation */}
      <header className="flex items-center justify-between border-b border-[#e2e8f0] bg-white px-6 py-2 shadow-sm">
        <nav className="flex h-10 items-center">
          {NAV_TABS.map((tab) => (
            <div
              key={tab.label}
              className={`flex h-full items-center border-b-2 px-4 ${
                tab.active
                  ? "border-[#1773cf] bg-[rgba(23,115,207,0.05)]"
                  : "border-transparent"
              }`}
            >
              <span
                className={`text-[12px] font-bold ${
                  tab.active ? "text-[#1773cf]" : "text-[#64748b]"
                }`}
              >
                {tab.label}
              </span>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* CRM Search */}
          <div className="flex items-center gap-2 rounded-sm border border-[#e2e8f0] bg-[#f9fafb] px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="CRM Lookup / Client Search..."
              className="w-48 border-none bg-transparent text-[12px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none"
            />
          </div>

          {/* Recording Timer */}
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-[12px] font-bold text-[#0f172a]">
              00:12:45
            </span>
          </div>

          {/* Save Quote */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-sm bg-[#1773cf] px-4 py-1.5 text-white shadow-[0px_4px_6px_-1px_rgba(59,130,246,0.2)]"
          >
            <Save className="h-3.5 w-3.5" />
            <span className="text-[12px] font-bold">SAVE QUOTE</span>
          </button>
        </div>
      </header>

      <QuoteWorkspace />
    </div>
  )
}
