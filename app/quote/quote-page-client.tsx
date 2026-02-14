"use client"

import { useState, useCallback, useMemo } from "react"
import { Save, Search } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { IntakeForm } from "@/components/quote/intake-form"
import { CarrierResults } from "@/components/quote/carrier-results"
import { CarrierDetailModal } from "@/components/quote/carrier-detail-modal"
import {
  CompareFloatingButton,
  ComparisonSheet,
} from "@/components/quote/carrier-comparison"
import { AiAssistantPanel } from "@/components/quote/ai-assistant-panel"
import type { QuoteRequest, QuoteResponse, CarrierQuote } from "@/lib/types"

const COVERAGE_STEPS = [
  100000, 150000, 200000, 250000, 300000, 400000, 500000, 750000,
  1000000, 1500000, 2000000, 2500000, 3000000, 4000000, 5000000,
  6000000, 7500000, 10000000,
] as const

function formatCoverageDisplay(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function coverageToSlider(amount: number): number {
  const index = COVERAGE_STEPS.findIndex((step) => step >= amount)
  return index === -1 ? COVERAGE_STEPS.length - 1 : index
}

function sliderToCoverage(index: number): number {
  return COVERAGE_STEPS[Math.round(index)] ?? COVERAGE_STEPS[0]
}

const NAV_TABS = [
  { label: "FINAL EXPENSE", active: false },
  { label: "TERM LIFE", active: true },
  { label: "IUL", active: false },
  { label: "ANNUITIES", active: false },
] as const

export function QuotePageClient() {
  const [quoteResponse, setQuoteResponse] = useState<QuoteResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCarrierIds, setSelectedCarrierIds] = useState<Set<string>>(
    new Set(),
  )
  const [detailQuote, setDetailQuote] = useState<CarrierQuote | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)
  const [coverageAmount, setCoverageAmount] = useState(1000000)
  const [termLength, setTermLength] = useState<number>(20)
  const [lastRequest, setLastRequest] = useState<QuoteRequest | null>(null)
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)

  const fetchQuotes = useCallback(async (request: QuoteRequest) => {
    setIsLoading(true)
    setLastRequest(request)
    setCoverageAmount(request.coverageAmount)
    setTermLength(request.termLength)
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })
      if (!response.ok) throw new Error(`Quote request failed: ${response.status}`)
      const data: QuoteResponse = await response.json()
      setQuoteResponse(data)
      setSelectedCarrierIds(new Set())
    } catch {
      // Handled by empty state
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleToggleSelection = useCallback((carrierId: string) => {
    setSelectedCarrierIds((prev) => {
      const next = new Set(prev)
      if (next.has(carrierId)) {
        next.delete(carrierId)
      } else if (next.size < 3) {
        next.add(carrierId)
      }
      return next
    })
  }, [])

  const handleClearQuotes = useCallback(() => {
    setQuoteResponse(null)
    setSelectedCarrierIds(new Set())
    setCoverageAmount(1000000)
    setTermLength(20)
    setLastRequest(null)
  }, [])

  const handleViewDetails = useCallback((quote: CarrierQuote) => {
    setDetailQuote(quote)
    setIsDetailOpen(true)
  }, [])

  const selectedQuotes = useMemo(() => {
    if (!quoteResponse) return []
    return quoteResponse.quotes.filter((q) =>
      selectedCarrierIds.has(q.carrier.id),
    )
  }, [quoteResponse, selectedCarrierIds])

  const eligibleCount = quoteResponse
    ? quoteResponse.quotes.filter((q) => q.isEligible).length
    : 0

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

      {/* Body — Three-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-[480px] min-w-[480px] shrink-0 border-r border-[#e2e8f0] bg-white shadow-sm">
          <IntakeForm onSubmit={fetchQuotes} onClear={handleClearQuotes} isLoading={isLoading} />
        </aside>

        {/* Center Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Title Section */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-[24px] font-bold text-[#0f172a]">
                Term Life Quote Engine
              </h1>
              <div className="mt-1 flex items-center gap-3 text-[13px]">
                <span className="inline-flex items-center rounded-sm bg-[#1773cf] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  Live Session
                </span>
                {quoteResponse && (
                  <span className="text-[#475569]">
                    {quoteResponse.clientSummary}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <span className="text-[#64748b]">API STATUS:</span>
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#bbf7d0] bg-[#dcfce7] px-2 py-0.5 text-[10px] font-bold text-[#16a34a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                {quoteResponse
                  ? `${eligibleCount} ELIGIBLE`
                  : "READY"}
              </span>
            </div>
          </div>

          {/* Coverage + Term Row */}
          <div className="mb-6 rounded-sm border border-[#e2e8f0] bg-white p-6">
            <div className="flex gap-12">
              {/* Coverage Amount */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#64748b]">
                    Coverage Amount
                  </span>
                  <span className="text-[20px] font-bold text-[#1773cf] tabular-nums">
                    {formatCoverageDisplay(coverageAmount)}
                  </span>
                </div>
                <div className="mt-4">
                  <Slider
                    min={0}
                    max={COVERAGE_STEPS.length - 1}
                    step={1}
                    value={[coverageToSlider(coverageAmount)]}
                    onValueChange={([val]) => {
                      if (val !== undefined) {
                        const newAmount = sliderToCoverage(val)
                        setCoverageAmount(newAmount)
                      }
                    }}
                    className="[&_[data-slot=slider-range]]:bg-[#1773cf] [&_[data-slot=slider-thumb]]:border-[#1773cf] [&_[data-slot=slider-thumb]]:bg-[#1773cf]"
                  />
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-[#94a3b8]">
                  <span>$100k</span>
                  <span>$5M</span>
                  <span>$10M</span>
                </div>
              </div>

              {/* Term Duration */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#64748b]">
                  Term Duration
                </span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {([10, 15, 20, 25, 30, 35, 40] as const).map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setTermLength(term)}
                      className={`rounded-sm px-3 py-2 text-[13px] font-bold transition-colors ${
                        termLength === term
                          ? "bg-[#1773cf] text-white shadow-[0px_2px_4px_0px_rgba(23,115,207,0.3)]"
                          : "border border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f9fafb]"
                      }`}
                    >
                      {term}Y
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Market Comparison */}
          {quoteResponse ? (
            <CarrierResults
              quotes={quoteResponse.quotes}
              isLoading={isLoading}
              onRefresh={() => {
                if (lastRequest) fetchQuotes(lastRequest)
              }}
              onViewDetails={handleViewDetails}
              selectedCarrierIds={selectedCarrierIds}
              onToggleSelection={handleToggleSelection}
            />
          ) : (
            <div className="flex h-48 items-center justify-center rounded-sm border border-[#e2e8f0] bg-white">
              <p className="text-[13px] text-[#94a3b8]">
                Loading quote data...
              </p>
            </div>
          )}
        </main>

        {/* Right Panel — AI Assistant */}
        <AiAssistantPanel
          isCollapsed={!isAssistantOpen}
          onToggle={() => setIsAssistantOpen((prev) => !prev)}
        />
      </div>

      {/* Bottom Status Bar */}
      <footer className="flex items-center justify-between border-t border-[#e2e8f0] bg-white px-6 py-2 shadow-[0px_-1px_3px_0px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-4 text-[11px] text-[#64748b]">
          <span>
            <kbd className="rounded border border-[#e2e8f0] bg-[#f1f5f9] px-1.5 py-0.5 font-mono text-[10px]">
              ESC
            </kbd>{" "}
            Clear All
          </span>
          <span>
            <kbd className="rounded border border-[#e2e8f0] bg-[#f1f5f9] px-1.5 py-0.5 font-mono text-[10px]">
              ALT+S
            </kbd>{" "}
            Sync CRM
          </span>
          <span>
            <kbd className="rounded border border-[#e2e8f0] bg-[#f1f5f9] px-1.5 py-0.5 font-mono text-[10px]">
              ALT+Q
            </kbd>{" "}
            New Quote
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#16a34a]">
          <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
          Carrier Cloud Connected
        </div>
      </footer>

      {/* Modals */}
      <CarrierDetailModal
        quote={detailQuote}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        clientConditions={lastRequest?.medicalConditions}
      />

      <CompareFloatingButton
        count={selectedCarrierIds.size}
        onClick={() => setIsComparisonOpen(true)}
      />

      <ComparisonSheet
        selectedQuotes={selectedQuotes}
        open={isComparisonOpen}
        onOpenChange={setIsComparisonOpen}
      />
    </div>
  )
}
