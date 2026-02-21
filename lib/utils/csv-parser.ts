import Papa from "papaparse"

/* ------------------------------------------------------------------ */
/*  Lead field definitions for column mapping                          */
/* ------------------------------------------------------------------ */

export type LeadField =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "state"
  | "age"
  | "gender"
  | "tobaccoStatus"
  | "skip"

export interface LeadFieldOption {
  value: LeadField
  label: string
}

export const LEAD_FIELDS: LeadFieldOption[] = [
  { value: "skip", label: "Skip (don't import)" },
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "state", label: "State" },
  { value: "age", label: "Age" },
  { value: "gender", label: "Gender" },
  { value: "tobaccoStatus", label: "Tobacco Status" },
]

/* ------------------------------------------------------------------ */
/*  Auto-detect column mapping from header names                       */
/* ------------------------------------------------------------------ */

const COLUMN_ALIASES: Record<string, LeadField> = {
  first_name: "firstName",
  firstname: "firstName",
  "first name": "firstName",
  fname: "firstName",
  last_name: "lastName",
  lastname: "lastName",
  "last name": "lastName",
  lname: "lastName",
  email: "email",
  email_address: "email",
  "email address": "email",
  phone: "phone",
  phone_number: "phone",
  "phone number": "phone",
  mobile: "phone",
  cell: "phone",
  state: "state",
  st: "state",
  region: "state",
  age: "age",
  gender: "gender",
  sex: "gender",
  tobacco: "tobaccoStatus",
  tobacco_status: "tobaccoStatus",
  smoker: "tobaccoStatus",
}

export function autoDetectMapping(headers: string[]): Record<string, LeadField> {
  const mapping: Record<string, LeadField> = {}

  const usedFields = new Set<LeadField>()

  for (const header of headers) {
    const normalized = header.toLowerCase().trim()
    const match = COLUMN_ALIASES[normalized]
    if (match && !usedFields.has(match)) {
      mapping[header] = match
      usedFields.add(match)
    } else {
      mapping[header] = "skip"
    }
  }

  return mapping
}

/* ------------------------------------------------------------------ */
/*  Parse CSV file                                                     */
/* ------------------------------------------------------------------ */

export interface ParsedCSV {
  headers: string[]
  rows: Record<string, string>[]
  totalRows: number
  errors: string[]
}

export function parseCSV(file: File): Promise<ParsedCSV> {
  return new Promise((resolve) => {
    const errors: string[] = []

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
      complete: (results) => {
        for (const err of results.errors) {
          errors.push(`Row ${err.row}: ${err.message}`)
        }

        const rows = results.data as Record<string, string>[]
        const headers = results.meta.fields ?? []

        resolve({
          headers,
          rows,
          totalRows: rows.length,
          errors,
        })
      },
    })
  })
}

/* ------------------------------------------------------------------ */
/*  Apply mapping to produce lead data                                 */
/* ------------------------------------------------------------------ */

export interface MappedLead {
  firstName: string | null
  lastName: string | null
  email: string | null
  phone: string | null
  state: string | null
  age: number | null
  gender: "Male" | "Female" | null
  tobaccoStatus: "non-smoker" | "smoker" | null
  rawCsvData: Record<string, string>
}

export interface ImportResult {
  leads: MappedLead[]
  skipped: { row: number; reason: string }[]
  duplicateEmails: string[]
}

function normalizeGender(value: string): "Male" | "Female" | null {
  const lower = value.toLowerCase().trim()
  if (lower === "m" || lower === "male") return "Male"
  if (lower === "f" || lower === "female") return "Female"
  return null
}

function normalizeTobacco(value: string): "non-smoker" | "smoker" | null {
  const lower = value.toLowerCase().trim()
  if (lower === "yes" || lower === "true" || lower === "smoker" || lower === "y" || lower === "1") return "smoker"
  if (lower === "no" || lower === "false" || lower === "non-smoker" || lower === "n" || lower === "0") return "non-smoker"
  return null
}

function parseAge(value: string): number | null {
  const num = parseInt(value, 10)
  if (isNaN(num) || num < 0 || num > 150) return null
  return num
}

export function applyMapping(
  rows: Record<string, string>[],
  mapping: Record<string, LeadField>
): ImportResult {
  const leads: MappedLead[] = []
  const skipped: { row: number; reason: string }[] = []
  const seenEmails = new Set<string>()
  const duplicateEmails: string[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const lead: MappedLead = {
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      state: null,
      age: null,
      gender: null,
      tobaccoStatus: null,
      rawCsvData: row,
    }

    let hasAnyData = false

    for (const [csvCol, leadField] of Object.entries(mapping)) {
      if (leadField === "skip") continue
      const value = row[csvCol]?.trim()
      if (!value) continue

      hasAnyData = true

      switch (leadField) {
        case "firstName":
          lead.firstName = value
          break
        case "lastName":
          lead.lastName = value
          break
        case "email":
          lead.email = value.toLowerCase()
          break
        case "phone":
          lead.phone = value
          break
        case "state":
          lead.state = value.length === 2 ? value.toUpperCase() : value
          break
        case "age":
          lead.age = parseAge(value)
          break
        case "gender":
          lead.gender = normalizeGender(value)
          break
        case "tobaccoStatus":
          lead.tobaccoStatus = normalizeTobacco(value)
          break
      }
    }

    if (!hasAnyData) {
      skipped.push({ row: i + 1, reason: "Empty row" })
      continue
    }

    if (lead.email) {
      const emailLower = lead.email.toLowerCase()
      if (seenEmails.has(emailLower)) {
        duplicateEmails.push(emailLower)
      }
      seenEmails.add(emailLower)
    }

    leads.push(lead)
  }

  return { leads, skipped, duplicateEmails }
}
