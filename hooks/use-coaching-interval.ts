"use client"

import { useEffect, useRef } from "react"
import { useCallStore } from "@/lib/store/call-store"
import { useLeadStore } from "@/lib/store/lead-store"
import type { CoachingHint } from "@/lib/types/call"

/* ------------------------------------------------------------------ */
/*  useCoachingInterval                                                 */
/*  30s interval that sends client speech to /api/coaching and adds     */
/*  returned hints to the call store. Fire-and-forget.                 */
/* ------------------------------------------------------------------ */

const INTERVAL_MS = 30_000
const COOLDOWN_MS = 15_000
const MAX_HINTS_PER_CALL = 10
const MAX_WORDS = 500

const CALL_ACTIVE_STATES = new Set(["active", "held"])

function extractClientSpeech(
  transcript: ReadonlyArray<{ speaker: string; text: string; isFinal: boolean }>,
  maxWords: number,
): string {
  const clientFinals = transcript.filter(
    (e) => e.speaker === "client" && e.isFinal,
  )

  // Collect words from most recent entries in reverse, then reverse once
  const collected: string[] = []
  for (let i = clientFinals.length - 1; i >= 0 && collected.length < maxWords; i--) {
    const entryWords = clientFinals[i].text.split(/\s+/).filter(Boolean)
    collected.push(...entryWords)
  }

  return collected.reverse().slice(0, maxWords).join(" ")
}

export function useCoachingInterval(): void {
  const lastHintTimeRef = useRef(0)
  const hintCountRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isFetchingRef = useRef(false)

  useEffect(() => {
    hintCountRef.current = 0
    lastHintTimeRef.current = 0

    function tick() {
      const { callState, transcript, coachingHints, addCoachingHint } =
        useCallStore.getState()
      const { intakeData } = useLeadStore.getState()

      // Guard: only run during active calls
      if (!CALL_ACTIVE_STATES.has(callState)) return

      // Guard: need lead profile for context
      if (!intakeData) return

      // Guard: max hints per call
      if (hintCountRef.current >= MAX_HINTS_PER_CALL) return

      // Guard: cooldown since last hint
      if (Date.now() - lastHintTimeRef.current < COOLDOWN_MS) return

      // Guard: need transcript content
      const chunk = extractClientSpeech(transcript, MAX_WORDS)
      if (!chunk.trim()) return

      // Guard: prevent concurrent fetches
      if (isFetchingRef.current) return
      isFetchingRef.current = true

      const existingHintTexts = coachingHints.map((h) => h.text)

      // Fire-and-forget — errors logged but don't break the call
      fetch("/api/coaching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcriptChunk: chunk,
          leadProfile: intakeData,
          existingHintTexts,
        }),
      })
        .then((res) => {
          if (!res.ok) return null
          return res.json() as Promise<{ hint: CoachingHint | null }>
        })
        .then((data) => {
          if (data?.hint) {
            addCoachingHint(data.hint)
            hintCountRef.current += 1
            lastHintTimeRef.current = Date.now()
          }
        })
        .catch(() => {
          // Silently fail — coaching is non-critical
        })
        .finally(() => {
          isFetchingRef.current = false
        })
    }

    // Check call state to decide whether to start/stop the interval
    function checkAndStart() {
      const { callState } = useCallStore.getState()

      if (CALL_ACTIVE_STATES.has(callState)) {
        if (!intervalRef.current) {
          intervalRef.current = setInterval(tick, INTERVAL_MS)
        }
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        // Reset counters when call is no longer active (between calls)
        hintCountRef.current = 0
        lastHintTimeRef.current = 0
      }
    }

    // Subscribe to state changes — start/stop interval on callState transitions
    let prevCallState = useCallStore.getState().callState
    const unsubscribe = useCallStore.subscribe((state) => {
      if (state.callState !== prevCallState) {
        prevCallState = state.callState
        checkAndStart()
      }
    })

    // Initial check
    checkAndStart()

    return () => {
      unsubscribe()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])
}
