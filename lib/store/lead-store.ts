import { create } from "zustand"
import type { Lead, LeadQuoteSnapshot } from "@/lib/types/lead"
import type { EnrichmentResult } from "@/lib/types/ai"

/* ------------------------------------------------------------------ */
/*  LeadStore — domain state for leads                                 */
/* ------------------------------------------------------------------ */

interface LeadState {
  leads: Lead[]
  activeLead: Lead | null
  isLoading: boolean
  dirtyFields: Set<string>
}

interface LeadActions {
  // Lead CRUD
  setLeads: (leads: Lead[]) => void
  addLead: (lead: Lead) => void
  addLeads: (leads: Lead[]) => void
  setActiveLead: (lead: Lead | null) => void
  updateActiveLead: (fields: Partial<Lead>) => void
  removeLead: (id: string) => void

  // Enrichment
  setActiveLeadEnrichment: (enrichment: EnrichmentResult) => void

  // Quotes
  addActiveLeadQuote: (snapshot: LeadQuoteSnapshot) => void

  // Dirty field tracking (for enrichment auto-fill protection)
  markFieldDirty: (field: string) => void
  clearDirtyFields: () => void
  isFieldDirty: (field: string) => boolean

  // Loading
  setIsLoading: (loading: boolean) => void
}

export type LeadStore = LeadState & LeadActions

function updateLeadInList(leads: Lead[], updated: Lead): Lead[] {
  return leads.map((l) => (l.id === updated.id ? updated : l))
}

export const useLeadStore = create<LeadStore>()((set, get) => ({
  // State
  leads: [],
  activeLead: null,
  isLoading: false,
  dirtyFields: new Set<string>(),

  // Lead CRUD
  setLeads: (leads) => set({ leads }),

  addLead: (lead) => set((state) => ({ leads: [...state.leads, lead] })),

  addLeads: (leads) =>
    set((state) => ({ leads: [...state.leads, ...leads] })),

  setActiveLead: (lead) => set({ activeLead: lead, dirtyFields: new Set() }),

  updateActiveLead: (fields) =>
    set((state) => {
      if (!state.activeLead) return state
      const updated = { ...state.activeLead, ...fields }
      return {
        activeLead: updated,
        leads: updateLeadInList(state.leads, updated),
      }
    }),

  removeLead: (id) =>
    set((state) => ({
      leads: state.leads.filter((l) => l.id !== id),
      activeLead: state.activeLead?.id === id ? null : state.activeLead,
    })),

  // Enrichment
  setActiveLeadEnrichment: (enrichment) =>
    set((state) => {
      if (!state.activeLead) return state
      const updated = { ...state.activeLead, enrichment }
      return {
        activeLead: updated,
        leads: updateLeadInList(state.leads, updated),
      }
    }),

  // Quotes
  addActiveLeadQuote: (snapshot) =>
    set((state) => {
      if (!state.activeLead) return state
      const updated = {
        ...state.activeLead,
        quoteHistory: [...state.activeLead.quoteHistory, snapshot],
      }
      return {
        activeLead: updated,
        leads: updateLeadInList(state.leads, updated),
      }
    }),

  // Dirty field tracking
  markFieldDirty: (field) =>
    set((state) => {
      const next = new Set(state.dirtyFields)
      next.add(field)
      return { dirtyFields: next }
    }),

  clearDirtyFields: () => set({ dirtyFields: new Set() }),

  isFieldDirty: (field) => get().dirtyFields.has(field),

  // Loading
  setIsLoading: (isLoading) => set({ isLoading }),
}))
