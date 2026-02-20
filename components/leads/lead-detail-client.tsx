"use client"

import { useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { QuoteWorkspace } from "@/components/quote/quote-workspace"
import { useLeadStore } from "@/lib/store/lead-store"

interface LeadDetailClientProps {
  leadId: string
}

export function LeadDetailClient({ leadId }: LeadDetailClientProps) {
  const router = useRouter()
  const leads = useLeadStore((s) => s.leads)
  const activeLeadId = useLeadStore((s) => s.activeLead?.id ?? null)
  const switchToLead = useLeadStore((s) => s.switchToLead)

  const lead = useMemo(
    () => leads.find((l) => l.id === leadId) ?? null,
    [leads, leadId],
  )

  // Atomically set activeLead + restore quote data when the lead changes
  useEffect(() => {
    if (!lead) return
    if (activeLeadId === lead.id) return
    switchToLead(lead)
  }, [lead, activeLeadId, switchToLead])

  const leadName = lead
    ? [lead.firstName, lead.lastName].filter(Boolean).join(" ") || "Unnamed Lead"
    : "Lead Not Found"

  if (!lead) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#f6f7f8]">
        <p className="text-[16px] font-medium text-[#475569]">
          Lead not found in current session.
        </p>
        <p className="text-[13px] text-[#94a3b8]">
          Navigate from the lead list to load a lead.
        </p>
        <button
          type="button"
          onClick={() => router.push("/leads")}
          className="mt-2 flex items-center gap-2 rounded-sm bg-[#1773cf] px-4 py-2 text-[12px] font-bold text-white hover:bg-[#1565b8]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Leads
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-[#f6f7f8]">
      {/* Header — Lead Context */}
      <header className="flex items-center justify-between border-b border-[#e2e8f0] bg-white px-6 py-2 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/leads")}
            className="flex items-center gap-1.5 rounded-sm px-2 py-1 text-[12px] font-medium text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#0f172a]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Leads
          </button>

          <div className="h-5 w-px bg-[#e2e8f0]" />

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#1773cf] text-[10px] font-bold text-white">
              {(lead.firstName?.[0] ?? "").toUpperCase()}
              {(lead.lastName?.[0] ?? "").toUpperCase()}
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#0f172a]">{leadName}</p>
              <p className="text-[10px] text-[#94a3b8]">
                {[lead.email, lead.state].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>

          {lead.enrichment && (
            <span className="rounded-sm bg-[#dcfce7] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#16a34a]">
              Enriched
            </span>
          )}
          {lead.quoteHistory.length > 0 && (
            <span className="rounded-sm bg-[#dbeafe] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#1773cf]">
              {lead.quoteHistory.length} Quote{lead.quoteHistory.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
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
