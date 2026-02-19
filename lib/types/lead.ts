import type { EnrichmentResult } from "./ai"
import type { LeadSource } from "./database"
import type { Gender, QuoteRequest, QuoteResponse, TobaccoStatus } from "./quote"

/* ------------------------------------------------------------------ */
/*  Lead — first-class entity that composes all per-prospect data      */
/* ------------------------------------------------------------------ */

export interface Lead {
  id: string
  agentId: string
  firstName: string | null
  lastName: string | null
  email: string | null
  phone: string | null
  state: string | null
  age: number | null
  gender: Gender | null
  tobaccoStatus: TobaccoStatus | null
  medicalConditions: string[]
  duiHistory: boolean
  yearsSinceLastDui: number | null
  coverageAmount: number | null
  termLength: number | null
  source: LeadSource
  rawCsvData: Record<string, unknown> | null

  enrichment: EnrichmentResult | null
  quoteHistory: LeadQuoteSnapshot[]

  createdAt: string
  updatedAt: string
}

/* ------------------------------------------------------------------ */
/*  Quote snapshot — one run of the quote engine for a lead            */
/* ------------------------------------------------------------------ */

export interface LeadQuoteSnapshot {
  id: string
  request: QuoteRequest
  response: QuoteResponse
  createdAt: string
}
