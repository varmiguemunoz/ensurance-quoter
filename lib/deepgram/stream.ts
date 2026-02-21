/* ------------------------------------------------------------------ */
/*  Client-side Transcription Manager                                  */
/*  Connects audio capture → server SSE+POST routes → call-store.      */
/*  Pure module — no React dependencies.                               */
/* ------------------------------------------------------------------ */

import { startCapture, type AudioCaptureHandle } from "@/lib/telnyx/audio-capture"
import { useCallStore } from "@/lib/store/call-store"
import type { TranscriptEntry } from "@/lib/types/call"

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const MAX_RETRIES = 3
const BASE_RETRY_MS = 1_000

/* ------------------------------------------------------------------ */
/*  Internal state                                                     */
/* ------------------------------------------------------------------ */

let eventSource: EventSource | null = null
let captureHandle: AudioCaptureHandle | null = null
let sessionId: string | null = null
let retryCount = 0
let retryTimeoutId: ReturnType<typeof setTimeout> | null = null
let stopped = false

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function int16ToBase64(pcm: Int16Array): string {
  const bytes = new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength)
  // Chunked to avoid call-stack limits on String.fromCharCode
  const CHUNK = 8192
  let binary = ""
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  return btoa(binary)
}

function postAudioChunk(audio: string): void {
  if (!sessionId || stopped) return

  // Fire-and-forget — no backpressure on audio pipeline.
  // Deepgram handles gaps gracefully if a chunk is lost.
  fetch("/api/transcribe/audio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, audio }),
  }).catch(() => {
    // Chunk lost — acceptable for transcription
  })
}

function handleTranscriptEvent(data: string): void {
  try {
    const entry = JSON.parse(data) as TranscriptEntry
    const store = useCallStore.getState()

    if (entry.isFinal) {
      store.replaceInterimEntry(entry)
    } else {
      store.addTranscriptEntry(entry)
    }
  } catch {
    // Malformed event — skip
  }
}

/* ------------------------------------------------------------------ */
/*  SSE connection                                                     */
/* ------------------------------------------------------------------ */

function connectSSE(
  localStream: MediaStream,
  remoteStream: MediaStream,
): void {
  if (stopped) return

  const es = new EventSource("/api/transcribe/stream")
  eventSource = es

  es.addEventListener("session_init", (event) => {
    try {
      const data = JSON.parse(event.data) as { sessionId: string }
      sessionId = data.sessionId

      // Start audio capture → POST chunks
      captureHandle = startCapture(localStream, remoteStream, (pcm) => {
        postAudioChunk(int16ToBase64(pcm))
      })

      // Reset retry counter on successful connection
      retryCount = 0
    } catch {
      cleanup()
    }
  })

  es.addEventListener("transcript", (event) => {
    handleTranscriptEvent(event.data)
  })

  es.addEventListener("utterance_end", () => {
    // Could be used for coaching hint timing — no action needed for now
  })

  // Named SSE event "error" from server (Deepgram-level error).
  // Distinct from EventSource connection errors which hit onerror below.
  // Connection errors have no .data property — caught by try/catch.
  es.addEventListener("error", (event) => {
    try {
      const data = JSON.parse((event as MessageEvent).data) as { message: string }
      useCallStore.getState().setError(`Transcription error: ${data.message}`)
    } catch {
      // Connection error, not a server-sent error event — handled by onerror
    }
  })

  es.addEventListener("close", () => {
    cleanup()
  })

  es.onerror = () => {
    // EventSource auto-reconnects, but we control retry logic
    es.close()

    if (stopped) return

    if (retryCount < MAX_RETRIES) {
      retryCount++
      const delay = BASE_RETRY_MS * Math.pow(2, retryCount - 1)

      // Stop current capture — will restart on reconnect
      captureHandle?.stop()
      captureHandle = null
      sessionId = null

      retryTimeoutId = setTimeout(() => {
        retryTimeoutId = null
        if (!stopped) {
          connectSSE(localStream, remoteStream)
        }
      }, delay)
    } else {
      useCallStore
        .getState()
        .setError("Live transcription disconnected — retries exhausted")
      cleanup()
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export function startTranscription(
  localStream: MediaStream | null,
  remoteStream: MediaStream | null,
): void {
  // Clean up any prior session (including pending retry timeouts)
  stopTranscription()

  if (!localStream || !remoteStream) return

  stopped = false
  retryCount = 0
  connectSSE(localStream, remoteStream)
}

export function stopTranscription(): void {
  stopped = true
  cleanup()
}

function cleanup(): void {
  captureHandle?.stop()
  captureHandle = null

  if (retryTimeoutId) {
    clearTimeout(retryTimeoutId)
    retryTimeoutId = null
  }

  if (eventSource) {
    eventSource.close()
    eventSource = null
  }

  sessionId = null
  retryCount = 0
}
