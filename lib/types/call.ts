import type { CallDirection, CallProvider } from "./database"

/* ------------------------------------------------------------------ */
/*  Call State                                                         */
/* ------------------------------------------------------------------ */

export type CallState =
  | "idle"
  | "connecting"
  | "ringing"
  | "active"
  | "held"
  | "ending"
  | "error"

/* ------------------------------------------------------------------ */
/*  Telnyx Configuration                                               */
/* ------------------------------------------------------------------ */

export interface TelnyxConfig {
  token: string
  callerNumber: string
}

/* ------------------------------------------------------------------ */
/*  Transcript Entry — populated by P2-03                              */
/* ------------------------------------------------------------------ */

export type TranscriptSpeaker = "agent" | "client"

export interface TranscriptWord {
  word: string
  start: number
  end: number
  confidence: number
}

export interface TranscriptEntry {
  id: string
  speaker: TranscriptSpeaker
  text: string
  timestamp: number
  isFinal: boolean
  words: TranscriptWord[]
}

/* ------------------------------------------------------------------ */
/*  Coaching Hint — populated by P2-05                                 */
/* ------------------------------------------------------------------ */

export type CoachingHintType = "tip" | "warning" | "info"

export interface CoachingHint {
  id: string
  type: CoachingHintType
  text: string
  timestamp: number
  confidence: number
  relatedCarriers: string[]
}

/* ------------------------------------------------------------------ */
/*  Call Log Entry — client-side domain type (maps to call_logs row)    */
/* ------------------------------------------------------------------ */

export interface CallLogEntry {
  id: string
  leadId: string
  direction: CallDirection
  provider: CallProvider
  providerCallId: string | null
  durationSeconds: number | null
  recordingUrl: string | null
  transcriptText: string | null
  aiSummary: string | null
  coachingHints: CoachingHint[] | null
  startedAt: string | null
  endedAt: string | null
}
