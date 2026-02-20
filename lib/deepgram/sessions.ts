import {
  createClient,
  LiveTranscriptionEvents,
  type ListenLiveClient,
  type LiveTranscriptionEvent,
} from "@deepgram/sdk"
import type { TranscriptEntry, TranscriptWord } from "@/lib/types/call"

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const MAX_SESSIONS = 10
const IDLE_TIMEOUT_MS = 30_000

/* ------------------------------------------------------------------ */
/*  Session type                                                       */
/* ------------------------------------------------------------------ */

interface Session {
  readonly dgConnection: ListenLiveClient
  readonly controller: ReadableStreamDefaultController<Uint8Array>
  readonly idleTimer: ReturnType<typeof setTimeout>
  readonly createdAt: number
}

/* Survive HMR in dev — globalThis keeps the map alive across module reloads */
const globalForSessions = globalThis as unknown as {
  __deepgramSessions?: Map<string, Session>
}
const sessions =
  globalForSessions.__deepgramSessions ??= new Map<string, Session>()

/* ------------------------------------------------------------------ */
/*  SSE encoding                                                       */
/* ------------------------------------------------------------------ */

const encoder = new TextEncoder()

export function sseEvent(event: string, data: unknown): Uint8Array {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function generateId(): string {
  return crypto.randomUUID()
}

function resetIdleTimer(sessionId: string): void {
  const session = sessions.get(sessionId)
  if (!session) return

  clearTimeout(session.idleTimer)
  const newTimer = setTimeout(() => {
    closeSession(sessionId)
  }, IDLE_TIMEOUT_MS)

  // Replace session with updated timer (immutable swap)
  sessions.set(sessionId, { ...session, idleTimer: newTimer })
}

function mapSpeaker(speaker?: number): "agent" | "client" {
  // Speaker 0 = agent (local mic), Speaker 1 = client (remote)
  return speaker === 1 ? "client" : "agent"
}

function mapTranscriptEvent(
  event: LiveTranscriptionEvent,
): TranscriptEntry | null {
  const alt = event.channel?.alternatives?.[0]
  if (!alt || alt.transcript.length === 0) return null

  const words: TranscriptWord[] = (alt.words ?? []).map((w) => ({
    word: w.punctuated_word ?? w.word,
    start: w.start,
    end: w.end,
    confidence: w.confidence,
  }))

  // Determine dominant speaker from words
  const speakerCounts = new Map<number, number>()
  for (const w of alt.words ?? []) {
    if (w.speaker !== undefined) {
      speakerCounts.set(w.speaker, (speakerCounts.get(w.speaker) ?? 0) + 1)
    }
  }
  let dominantSpeaker: number | undefined
  let maxCount = 0
  for (const [speaker, count] of speakerCounts) {
    if (count > maxCount) {
      dominantSpeaker = speaker
      maxCount = count
    }
  }

  return {
    id: generateId(),
    speaker: mapSpeaker(dominantSpeaker),
    text: alt.transcript,
    timestamp: event.start,
    isFinal: event.is_final ?? false,
    words,
  }
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export function getSessionCount(): number {
  return sessions.size
}

export function hasSession(sessionId: string): boolean {
  return sessions.has(sessionId)
}

export function createSession(
  controller: ReadableStreamDefaultController<Uint8Array>,
): string {
  if (sessions.size >= MAX_SESSIONS) {
    throw new Error("Max concurrent transcription sessions reached")
  }

  const apiKey = process.env.DEEPGRAM_API_KEY
  if (!apiKey) {
    throw new Error("DEEPGRAM_API_KEY not configured")
  }

  const sessionId = generateId()

  const client = createClient(apiKey)
  const dgConnection = client.listen.live({
    model: "nova-3",
    language: "en",
    diarize: true,
    punctuate: true,
    interim_results: true,
    utterance_end_ms: 1000,
    encoding: "linear16",
    sample_rate: 16000,
    channels: 1,
  })

  const idleTimer = setTimeout(() => {
    closeSession(sessionId)
  }, IDLE_TIMEOUT_MS)

  const session: Session = {
    dgConnection,
    controller,
    idleTimer,
    createdAt: Date.now(),
  }

  sessions.set(sessionId, session)

  // Wire Deepgram events → SSE
  dgConnection.on(LiveTranscriptionEvents.Open, () => {
    try {
      controller.enqueue(sseEvent("session_ready", { sessionId }))
    } catch {
      // Controller may be closed if client disconnected
    }
  })

  dgConnection.on(
    LiveTranscriptionEvents.Transcript,
    (event: LiveTranscriptionEvent) => {
      const entry = mapTranscriptEvent(event)
      if (!entry) return

      resetIdleTimer(sessionId)
      try {
        controller.enqueue(sseEvent("transcript", entry))
      } catch {
        // Controller may be closed
        closeSession(sessionId)
      }
    },
  )

  dgConnection.on(LiveTranscriptionEvents.UtteranceEnd, () => {
    try {
      controller.enqueue(sseEvent("utterance_end", { timestamp: Date.now() }))
    } catch {
      closeSession(sessionId)
    }
  })

  dgConnection.on(LiveTranscriptionEvents.Error, (error: unknown) => {
    try {
      controller.enqueue(
        sseEvent("error", {
          message:
            error instanceof Error
              ? error.message
              : "Deepgram transcription error",
        }),
      )
    } catch {
      // Controller may be closed
    }
    closeSession(sessionId)
  })

  dgConnection.on(LiveTranscriptionEvents.Close, () => {
    closeSession(sessionId)
  })

  return sessionId
}

export function sendAudio(sessionId: string, audio: Uint8Array): void {
  const session = sessions.get(sessionId)
  if (!session) {
    throw new Error("Session not found")
  }

  if (!session.dgConnection.isConnected()) {
    throw new Error("Deepgram connection is not open")
  }

  resetIdleTimer(sessionId)
  // Slice to exact range — Buffer pooling can make .buffer larger than the data
  session.dgConnection.send(
    audio.buffer.slice(audio.byteOffset, audio.byteOffset + audio.byteLength),
  )
}

export function closeSession(sessionId: string): void {
  const session = sessions.get(sessionId)
  if (!session) return

  clearTimeout(session.idleTimer)
  sessions.delete(sessionId)

  // Close Deepgram WS
  try {
    if (session.dgConnection.isConnected()) {
      session.dgConnection.requestClose()
    }
  } catch {
    // Best effort
  }

  // Close SSE stream
  try {
    session.controller.enqueue(sseEvent("close", { sessionId }))
    session.controller.close()
  } catch {
    // Controller may already be closed
  }
}
