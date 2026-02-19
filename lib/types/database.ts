/* ------------------------------------------------------------------ */
/*  Supabase Database Types                                            */
/*  Generated from migration: create_lead_management_schema            */
/* ------------------------------------------------------------------ */

export type LeadSource = "csv" | "ringba" | "manual" | "api"

export type CallDirection = "inbound" | "outbound"

export type CallProvider = "telnyx" | "ringba"

/* ------------------------------------------------------------------ */
/*  Row types (what you get back from a SELECT)                        */
/* ------------------------------------------------------------------ */

export interface LeadRow {
  id: string
  agent_id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  state: string | null
  age: number | null
  gender: "Male" | "Female" | null
  tobacco_status: "non-smoker" | "smoker" | null
  medical_conditions: string[]
  dui_history: boolean
  years_since_last_dui: number | null
  coverage_amount: number | null
  term_length: number | null
  source: LeadSource
  raw_csv_data: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface EnrichmentRow {
  id: string
  lead_id: string
  pdl_data: Record<string, unknown>
  enriched_at: string
}

export interface QuoteRow {
  id: string
  lead_id: string
  request_data: Record<string, unknown>
  response_data: Record<string, unknown>
  created_at: string
}

export interface CallLogRow {
  id: string
  lead_id: string
  direction: CallDirection
  provider: CallProvider
  provider_call_id: string | null
  duration_seconds: number | null
  recording_url: string | null
  transcript_text: string | null
  started_at: string | null
  ended_at: string | null
}

/* ------------------------------------------------------------------ */
/*  Insert types (what you pass to an INSERT)                          */
/* ------------------------------------------------------------------ */

export interface LeadInsert {
  id?: string
  agent_id: string
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  phone?: string | null
  state?: string | null
  age?: number | null
  gender?: "Male" | "Female" | null
  tobacco_status?: "non-smoker" | "smoker" | null
  medical_conditions?: string[]
  dui_history?: boolean
  years_since_last_dui?: number | null
  coverage_amount?: number | null
  term_length?: number | null
  source?: LeadSource
  raw_csv_data?: Record<string, unknown> | null
}

export interface EnrichmentInsert {
  id?: string
  lead_id: string
  pdl_data: Record<string, unknown>
}

export interface QuoteInsert {
  id?: string
  lead_id: string
  request_data: Record<string, unknown>
  response_data: Record<string, unknown>
}

export interface CallLogInsert {
  id?: string
  lead_id: string
  direction: CallDirection
  provider: CallProvider
  provider_call_id?: string | null
  duration_seconds?: number | null
  recording_url?: string | null
  transcript_text?: string | null
  started_at?: string | null
  ended_at?: string | null
}

/* ------------------------------------------------------------------ */
/*  Update types (what you pass to an UPDATE — all fields optional)    */
/* ------------------------------------------------------------------ */

export type LeadUpdate = Partial<Omit<LeadInsert, "id">>

export type EnrichmentUpdate = Partial<Omit<EnrichmentInsert, "id">>

export type QuoteUpdate = Partial<Omit<QuoteInsert, "id">>

export type CallLogUpdate = Partial<Omit<CallLogInsert, "id">>

/* ------------------------------------------------------------------ */
/*  Database schema type (for createClient<Database>)                  */
/* ------------------------------------------------------------------ */

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: LeadRow
        Insert: LeadInsert
        Update: LeadUpdate
      }
      enrichments: {
        Row: EnrichmentRow
        Insert: EnrichmentInsert
        Update: EnrichmentUpdate
      }
      quotes: {
        Row: QuoteRow
        Insert: QuoteInsert
        Update: QuoteUpdate
      }
      call_logs: {
        Row: CallLogRow
        Insert: CallLogInsert
        Update: CallLogUpdate
      }
    }
  }
}
