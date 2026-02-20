import { create } from "zustand"
import type { Lead, LeadQuoteSnapshot } from "@/lib/types/lead"
import type { EnrichmentResult, EnrichmentAutoFillData } from "@/lib/types/ai"
import type { QuoteRequest, QuoteResponse } from "@/lib/types/quote"

/* ------------------------------------------------------------------ */
/*  LeadStore — domain state for leads + active quote session          */
/* ------------------------------------------------------------------ */

interface LeadState {
  leads: Lead[]
  activeLead: Lead | null
  isLoading: boolean
  dirtyFields: Set<string>
}

interface QuoteSessionState {
  intakeData: QuoteRequest | null
  quoteResponse: QuoteResponse | null
  selectedCarrierIds: Set<string>
  coverageAmount: number
  termLength: number
  isQuoteLoading: boolean
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

interface QuoteSessionActions {
  setIntakeData: (data: QuoteRequest | null) => void
  setQuoteResponse: (response: QuoteResponse | null) => void
  toggleCarrierSelection: (carrierId: string) => void
  clearCarrierSelection: () => void
  setCoverageAmount: (amount: number) => void
  setTermLength: (length: number) => void
  setIsQuoteLoading: (loading: boolean) => void
  fetchQuotes: (request: QuoteRequest) => Promise<void>
  clearQuoteSession: () => void
  applyAutoFill: (data: EnrichmentAutoFillData) => void
}

export type LeadStore = LeadState & QuoteSessionState & LeadActions & QuoteSessionActions

function createQuoteSessionDefaults(): QuoteSessionState {
  return {
    intakeData: null,
    quoteResponse: null,
    selectedCarrierIds: new Set<string>(),
    coverageAmount: 1000000,
    termLength: 20,
    isQuoteLoading: false,
  }
}

function updateLeadInList(leads: Lead[], updated: Lead): Lead[] {
  return leads.map((l) => (l.id === updated.id ? updated : l))
}

export const useLeadStore = create<LeadStore>()((set, get) => ({
  // Lead state
  leads: [],
  activeLead: null,
  isLoading: false,
  dirtyFields: new Set<string>(),

  // Quote session state
  ...createQuoteSessionDefaults(),

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

  // Quote session actions
  setIntakeData: (intakeData) => set({ intakeData }),

  setQuoteResponse: (quoteResponse) => set({ quoteResponse }),

  toggleCarrierSelection: (carrierId) =>
    set((state) => {
      const next = new Set(state.selectedCarrierIds)
      if (next.has(carrierId)) {
        next.delete(carrierId)
      } else if (next.size < 3) {
        next.add(carrierId)
      }
      return { selectedCarrierIds: next }
    }),

  clearCarrierSelection: () => set({ selectedCarrierIds: new Set<string>() }),

  setCoverageAmount: (coverageAmount) => set({ coverageAmount }),

  setTermLength: (termLength) => set({ termLength }),

  setIsQuoteLoading: (isQuoteLoading) => set({ isQuoteLoading }),

  fetchQuotes: async (request) => {
    set({
      isQuoteLoading: true,
      intakeData: request,
      coverageAmount: request.coverageAmount,
      termLength: request.termLength,
    })
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })
      if (!response.ok) throw new Error(`Quote request failed: ${response.status}`)
      const data: QuoteResponse = await response.json()
      set({ quoteResponse: data, selectedCarrierIds: new Set<string>() })
    } catch {
      // Handled by empty state in UI
    } finally {
      set({ isQuoteLoading: false })
    }
  },

  clearQuoteSession: () => set(createQuoteSessionDefaults()),

  applyAutoFill: (data) =>
    set((state) => {
      if (!state.intakeData) return state
      return {
        intakeData: {
          ...state.intakeData,
          ...(data.age != null ? { age: data.age } : {}),
          ...(data.gender ? { gender: data.gender } : {}),
          ...(data.state ? { state: data.state } : {}),
        },
      }
    }),
}))
