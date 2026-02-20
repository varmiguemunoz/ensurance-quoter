import { CARRIERS } from "@/lib/data/carriers"
import type { Carrier } from "@/lib/types"

/* ------------------------------------------------------------------ */
/*  Coaching Context                                                    */
/*  Condensed carrier intelligence (~600 tokens) for real-time          */
/*  coaching during calls. Filtered by lead's state.                   */
/* ------------------------------------------------------------------ */

function formatTobaccoRules(carrier: Carrier): string {
  const rules: string[] = []
  const t = carrier.tobacco

  if (t.vaping.includes("NON-SMOKER") || t.vaping.includes("NON-TOBACCO")) {
    rules.push(`Vaping: ${t.vaping}`)
  }
  if (t.cigars.includes("NON-TOBACCO")) {
    rules.push(`Cigars: ${t.cigars}`)
  }
  if (t.smokeless.includes("NON-TOBACCO")) {
    rules.push(`Smokeless: ${t.smokeless}`)
  }
  if (t.nrt.includes("NON-TOBACCO")) {
    rules.push(`NRT/ZYN: ${t.nrt}`)
  }
  if (t.marijuana.includes("Preferred") || t.marijuana.includes("NON")) {
    rules.push(`Marijuana: ${t.marijuana}`)
  }

  if (rules.length === 0) return ""
  return `Tobacco: ${rules.join("; ")}`
}

function formatDuiRule(carrier: Carrier): string {
  if (!carrier.dui) return ""
  return `DUI: ${carrier.dui.rule} → ${carrier.dui.result}`
}

function formatMedicalHighlights(carrier: Carrier): string {
  const entries = Object.entries(carrier.medicalHighlights)
  if (entries.length === 0) return ""
  return entries.map(([k, v]) => `${k}: ${v}`).join("; ")
}

function summarizeCarrier(carrier: Carrier): string {
  const parts = [`${carrier.name} (${carrier.amBest})`]

  const tobacco = formatTobaccoRules(carrier)
  if (tobacco) parts.push(tobacco)

  const dui = formatDuiRule(carrier)
  if (dui) parts.push(dui)

  const medical = formatMedicalHighlights(carrier)
  if (medical) parts.push(medical)

  if (carrier.tobacco.keyNote) {
    parts.push(`Note: ${carrier.tobacco.keyNote}`)
  }

  return parts.join(" | ")
}

/**
 * Build condensed carrier intelligence string for coaching prompts.
 * Filters carriers by lead's state and returns only differentiators.
 */
export function buildCoachingContext(state: string, age: number): string {
  const available = CARRIERS.filter(
    (c) => !c.statesNotAvailable.includes(state),
  )

  const lines = available.map(summarizeCarrier)

  return [
    `Available carriers in ${state} for age ${age}:`,
    ...lines,
  ].join("\n")
}
