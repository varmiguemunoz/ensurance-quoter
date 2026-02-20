import type { CoachingHint, CoachingHintType } from "@/lib/types/call"
import type { QuoteRequest } from "@/lib/types/quote"

/* ------------------------------------------------------------------ */
/*  Call Coach                                                          */
/*  Prompt builder, response parser, and deduplication for real-time    */
/*  coaching hints during calls.                                        */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPT = `You are a life insurance sales coach. You analyze the client's latest statements during a live call and provide ONE specific, actionable insight about carrier suitability.

Rules:
- Be concise: 1-2 sentences maximum.
- Reference specific carrier names and their rules.
- Focus on what the agent should SAY or DO next.
- Only surface insights that are directly relevant to what the client just said.
- If nothing actionable, return { "skip": true }.

Return JSON in one of these formats:

Actionable insight:
{
  "type": "tip" | "warning" | "info",
  "text": "One or two sentences with specific carrier reference.",
  "confidence": 0.0-1.0,
  "relatedCarriers": ["CarrierName"]
}

Nothing actionable:
{ "skip": true }`

interface CoachingPromptInput {
  transcriptChunk: string
  leadProfile: QuoteRequest
  existingHintTexts: string[]
  carrierContext: string
}

export function buildCoachingMessages(
  input: CoachingPromptInput,
): Array<{ role: "system" | "user"; content: string }> {
  const { transcriptChunk, leadProfile, existingHintTexts, carrierContext } = input

  const profileSummary = [
    `Client: ${leadProfile.name}, age ${leadProfile.age}, ${leadProfile.gender}`,
    `State: ${leadProfile.state}`,
    `Coverage: $${leadProfile.coverageAmount.toLocaleString("en-US")}, ${leadProfile.termLength}yr term`,
    `Tobacco: ${leadProfile.tobaccoStatus}`,
    leadProfile.duiHistory ? `DUI: Yes (${leadProfile.yearsSinceLastDui ?? "unknown"} years ago)` : null,
    leadProfile.medicalConditions?.length
      ? `Medical: ${leadProfile.medicalConditions.join(", ")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n")

  const existingContext =
    existingHintTexts.length > 0
      ? `\n\nAlready provided hints (do NOT repeat similar advice):\n${existingHintTexts.map((t) => `- ${t}`).join("\n")}`
      : ""

  return [
    { role: "system" as const, content: SYSTEM_PROMPT },
    {
      role: "user" as const,
      content: `${carrierContext}

---
Client Profile:
${profileSummary}
${existingContext}

---
Latest client speech:
"${transcriptChunk}"

Analyze and respond with JSON.`,
    },
  ]
}

interface RawCoachingResponse {
  skip?: boolean
  type?: string
  text?: string
  confidence?: number
  relatedCarriers?: string[]
}

const VALID_TYPES = new Set<CoachingHintType>(["tip", "warning", "info"])

export function parseCoachingResponse(content: string): CoachingHint | null {
  try {
    const parsed: RawCoachingResponse = JSON.parse(content)

    if (parsed.skip) return null
    if (!parsed.type || !parsed.text) return null
    if (!VALID_TYPES.has(parsed.type as CoachingHintType)) return null

    return {
      id: `coach-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: parsed.type as CoachingHintType,
      text: parsed.text,
      timestamp: Date.now(),
      confidence: typeof parsed.confidence === "number"
        ? Math.max(0, Math.min(1, parsed.confidence))
        : 0.5,
      relatedCarriers: Array.isArray(parsed.relatedCarriers)
        ? parsed.relatedCarriers.filter((c): c is string => typeof c === "string")
        : [],
    }
  } catch {
    return null
  }
}

/**
 * Check if a new hint is too similar to existing hints.
 * Returns true if >70% word overlap with any existing hint.
 */
export function isDuplicateHint(
  existingTexts: string[],
  newText: string,
): boolean {
  const newWords = new Set(
    newText.toLowerCase().split(/\s+/).filter((w) => w.length > 2),
  )

  if (newWords.size === 0) return false

  for (const existing of existingTexts) {
    const existingWords = new Set(
      existing.toLowerCase().split(/\s+/).filter((w) => w.length > 2),
    )

    let overlap = 0
    for (const word of newWords) {
      if (existingWords.has(word)) overlap++
    }

    const overlapRatio = overlap / newWords.size
    if (overlapRatio > 0.7) return true
  }

  return false
}
