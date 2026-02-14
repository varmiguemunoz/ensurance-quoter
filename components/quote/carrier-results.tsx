"use client"

import { useState, useMemo } from "react"
import { RefreshCw, Filter, ChevronRight, Star } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import type { CarrierQuote } from "@/lib/types"

type SortField = "matchScore" | "monthlyPremium" | "annualPremium" | "amBest"

interface CarrierResultsProps {
  quotes: CarrierQuote[]
  isLoading?: boolean
  onRefresh?: () => void
  onViewDetails?: (quote: CarrierQuote) => void
  selectedCarrierIds: Set<string>
  onToggleSelection: (carrierId: string) => void
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function RatingBadge({ rating, label }: { rating: string; label: string }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-[#bfdbfe] bg-[#dbeafe] px-2 py-0.5 text-[10px] font-medium text-[#1773cf]">
      {rating} {label}
    </span>
  )
}

function FeaturePill({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#e2e8f0] bg-[#f9fafb] px-2.5 py-0.5 text-[10px] text-[#475569]">
      {text}
    </span>
  )
}

const GRID_COLS = "grid-cols-[minmax(180px,1.2fr)_minmax(120px,1fr)_90px_100px_90px_90px_110px_40px]"

function ColumnHeaders() {
  return (
    <div className={`grid ${GRID_COLS} border-b border-[#e2e8f0] bg-[#f9fafb]`}>
      <div className="px-4 py-2.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#64748b]">
          Carrier
        </span>
      </div>
      <div className="px-4 py-2.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#64748b]">
          Product Name
        </span>
      </div>
      <div className="px-4 py-2.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#64748b]">
          Rating
        </span>
      </div>
      <div className="px-4 py-2.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#64748b]">
          Monthly
        </span>
      </div>
      <div className="px-4 py-2.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#64748b]">
          Annual
        </span>
      </div>
      <div className="px-4 py-2.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#64748b]">
          Commission
        </span>
      </div>
      <div className="px-4 py-2.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#64748b]">
          Actions
        </span>
      </div>
      <div className="py-2.5" />
    </div>
  )
}

function CarrierRow({
  quote,
  isSelected,
  onToggleSelection,
  onViewDetails,
  compact = false,
}: {
  quote: CarrierQuote
  isSelected: boolean
  onToggleSelection: (carrierId: string) => void
  onViewDetails?: (quote: CarrierQuote) => void
  compact?: boolean
}) {
  const hasFeatureLine =
    quote.features.length > 0 || quote.carrier.tobacco.keyNote

  return (
    <div
      onClick={() => onViewDetails?.(quote)}
      className={`cursor-pointer border-b border-[#e2e8f0] bg-white last:border-b-0 hover:bg-[#f9fafb] ${
        quote.isBestValue
          ? "border-l-4 border-l-[#16a34a]"
          : ""
      }`}
    >
      {/* Line 1 — Data columns */}
      <div className={`grid ${GRID_COLS} items-center ${compact ? "py-3" : "py-4"}`}>
        {/* Carrier */}
        <div className="flex items-center gap-2.5 px-4">
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelection(quote.carrier.id)}
            />
          </div>
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-[10px] font-bold text-white"
            style={{ backgroundColor: quote.carrier.color }}
          >
            {quote.carrier.abbr}
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[13px] font-semibold text-[#0f172a] truncate">
              {quote.carrier.name}
            </span>
            {quote.isBestValue && (
              <span className="inline-flex shrink-0 items-center gap-0.5 rounded-sm border border-[#bbf7d0] bg-[#dcfce7] px-1.5 py-px text-[8px] font-black uppercase text-[#16a34a]">
                <Star className="h-2.5 w-2.5" />
                Best
              </span>
            )}
          </div>
        </div>

        {/* Product Name */}
        <div className="px-4">
          <span className="text-[12px] text-[#475569]">
            {quote.product.name}
          </span>
        </div>

        {/* Rating */}
        <div className="px-4">
          <RatingBadge
            rating={quote.carrier.amBest}
            label={quote.carrier.amBestLabel}
          />
        </div>

        {/* Monthly */}
        <div className="px-4">
          <span
            className={`text-[14px] font-bold tabular-nums ${
              quote.isBestValue ? "text-[#16a34a]" : "text-[#0f172a]"
            }`}
          >
            {formatCurrency(quote.monthlyPremium)}
          </span>
        </div>

        {/* Annual */}
        <div className="px-4">
          <span className="text-[11px] font-medium text-[#64748b] tabular-nums">
            {formatCurrency(quote.annualPremium)}
          </span>
        </div>

        {/* Commission (placeholder) */}
        <div className="px-4">
          <span className="text-[12px] italic text-[#94a3b8]">&mdash;</span>
        </div>

        {/* Actions — APPLY NOW */}
        <div className="px-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails?.(quote)
            }}
            className={`inline-flex items-center rounded-sm px-3 py-1.5 text-[10px] font-bold uppercase transition-colors ${
              quote.isBestValue
                ? "bg-[#1773cf] text-white shadow-[0px_2px_4px_0px_rgba(23,115,207,0.2)] hover:bg-[#1566b8]"
                : "border border-[#e2e8f0] bg-white text-[#0f172a] hover:bg-[#f9fafb]"
            }`}
          >
            Apply Now
          </button>
        </div>

        {/* Expand arrow */}
        <div className="pr-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails?.(quote)
            }}
            className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#e2e8f0] text-[#94a3b8] transition-colors hover:border-[#1773cf] hover:text-[#1773cf]"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Line 2 — Key differentiator + feature pills */}
      {hasFeatureLine && (
        <div className="flex flex-wrap items-center gap-2 overflow-hidden border-t border-[#e2e8f0] px-4 pb-4 pt-2.5 pl-[70px]">
          {quote.carrier.tobacco.keyNote && (
            <span className="inline-flex max-w-full items-center rounded-sm border border-[#fde68a] bg-[#fef9c3] px-2 py-0.5 text-[10px] font-medium text-[#92400e]">
              {quote.carrier.tobacco.keyNote}
            </span>
          )}
          {quote.features.slice(0, 4).map((feature) => (
            <FeaturePill key={feature} text={feature} />
          ))}
        </div>
      )}
    </div>
  )
}

export function CarrierResults({
  quotes,
  isLoading = false,
  onRefresh,
  onViewDetails,
  selectedCarrierIds,
  onToggleSelection,
}: CarrierResultsProps) {
  const [sortField, setSortField] = useState<SortField>("matchScore")

  const eligibleQuotes = useMemo(() => {
    const filtered = quotes.filter((q) => q.isEligible)
    return [...filtered].sort((a, b) => {
      switch (sortField) {
        case "matchScore":
          return b.matchScore - a.matchScore
        case "monthlyPremium":
          return a.monthlyPremium - b.monthlyPremium
        case "annualPremium":
          return a.annualPremium - b.annualPremium
        case "amBest":
          return b.carrier.amBest.localeCompare(a.carrier.amBest)
        default:
          return 0
      }
    })
  }, [quotes, sortField])

  const bestMatches = eligibleQuotes.slice(0, 3)
  const allCarriers = eligibleQuotes.slice(3)

  return (
    <div>
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[12px] font-bold uppercase tracking-[1.2px] text-[#0f172a]">
          Market Comparison
        </h3>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-1 text-[#1773cf] hover:text-[#1566b8]"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="text-[10px] font-bold uppercase">Refresh Rates</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-sm border border-[#e2e8f0] bg-white px-2.5 py-1.5 text-[#64748b] hover:bg-[#f9fafb]"
          >
            <Filter className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase">Filter</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {eligibleQuotes.length === 0 && (
        <div className="rounded-sm border border-[#e2e8f0] bg-white px-6 py-12 text-center text-[13px] text-[#94a3b8]">
          {isLoading ? "Loading quotes..." : "No eligible carriers found."}
        </div>
      )}

      {/* Best Matches */}
      {bestMatches.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#475569]">
              Best Matches
            </h4>
            <span className="text-[11px] text-[#94a3b8]">
              Top carriers for this profile
            </span>
          </div>
          <div className="overflow-hidden rounded-sm border border-[#e2e8f0]">
            <ColumnHeaders />
            {bestMatches.map((quote) => (
              <CarrierRow
                key={quote.carrier.id}
                quote={quote}
                isSelected={selectedCarrierIds.has(quote.carrier.id)}
                onToggleSelection={onToggleSelection}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Carriers */}
      {allCarriers.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#475569]">
              All Carriers
            </h4>
            <span className="text-[11px] text-[#94a3b8]">
              {allCarriers.length} additional{" "}
              {allCarriers.length === 1 ? "carrier" : "carriers"}
            </span>
          </div>
          <div className="overflow-hidden rounded-sm border border-[#e2e8f0]">
            <ColumnHeaders />
            {allCarriers.map((quote) => (
              <CarrierRow
                key={quote.carrier.id}
                quote={quote}
                isSelected={selectedCarrierIds.has(quote.carrier.id)}
                onToggleSelection={onToggleSelection}
                onViewDetails={onViewDetails}
                compact
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
