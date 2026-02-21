"use client"

import { useEffect, useRef } from "react"
import { useCallStore } from "@/lib/store/call-store"
import {
  hangupCall,
  holdCall,
  unholdCall,
  toggleCallMute,
} from "@/lib/telnyx/active-call"
import { PhoneOff, Mic, MicOff, Pause, Play } from "lucide-react"
import { DTMFKeypad } from "./dtmf-keypad"

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

/**
 * Persistent call controls bar shown during active calls.
 * Renders between the lead detail header and QuoteWorkspace.
 */
export function ActiveCallBar() {
  const callState = useCallStore((s) => s.callState)
  const isMuted = useCallStore((s) => s.isMuted)
  const isOnHold = useCallStore((s) => s.isOnHold)
  const callDuration = useCallStore((s) => s.callDuration)
  const tickDuration = useCallStore((s) => s.tickDuration)
  const toggleMute = useCallStore((s) => s.toggleMute)
  const destinationNumber = useCallStore((s) => s.destinationNumber)

  // Timer — tick every second while call is active or held
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (callState === "active" || callState === "held") {
      intervalRef.current = setInterval(tickDuration, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [callState, tickDuration])

  const isVisible =
    callState === "active" ||
    callState === "held" ||
    callState === "ringing" ||
    callState === "connecting"

  if (!isVisible) return null

  const canControl = callState === "active" || callState === "held"

  const handleMute = () => {
    toggleCallMute()
    // Mute is local (audio track toggle) — no Telnyx notification fired,
    // so optimistic store update is correct.
    toggleMute()
  }

  const handleHold = () => {
    // Telnyx fires "held"/"active" notifications — let notification-handler.ts
    // be the single source of truth for hold state (avoids race condition).
    if (isOnHold) {
      unholdCall()
    } else {
      holdCall()
    }
  }

  return (
    <div className="flex items-center justify-between border-b border-[#bbf7d0] bg-[#f0fdf4] px-4 py-2">
      {/* Left: Status indicator + destination + timer */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {callState === "connecting" && (
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
          )}
          {callState === "ringing" && (
            <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
          )}
          {callState === "active" && (
            <span className="h-2 w-2 rounded-full bg-green-500" />
          )}
          {callState === "held" && (
            <span className="h-2 w-2 rounded-full bg-orange-500" />
          )}

          <span className="text-[12px] font-semibold text-[#0f172a]">
            {callState === "connecting"
              ? "Connecting..."
              : callState === "ringing"
                ? "Ringing..."
                : callState === "held"
                  ? "On Hold"
                  : destinationNumber ?? "Active Call"}
          </span>
        </div>

        {canControl && (
          <span className="font-mono text-[12px] tabular-nums text-[#64748b]">
            {formatDuration(callDuration)}
          </span>
        )}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1">
        {/* Mute */}
        <button
          type="button"
          onClick={handleMute}
          disabled={!canControl}
          aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
          className={`flex h-8 w-8 items-center justify-center rounded-sm transition-colors disabled:opacity-40 ${
            isMuted
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#0f172a]"
          }`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </button>

        {/* Hold */}
        <button
          type="button"
          onClick={handleHold}
          disabled={!canControl}
          aria-label={isOnHold ? "Resume call" : "Put call on hold"}
          className={`flex h-8 w-8 items-center justify-center rounded-sm transition-colors disabled:opacity-40 ${
            isOnHold
              ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
              : "text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#0f172a]"
          }`}
          title={isOnHold ? "Resume" : "Hold"}
        >
          {isOnHold ? (
            <Play className="h-4 w-4" />
          ) : (
            <Pause className="h-4 w-4" />
          )}
        </button>

        {/* DTMF Keypad */}
        <DTMFKeypad disabled={callState !== "active"} />

        {/* Hangup */}
        <button
          type="button"
          onClick={hangupCall}
          aria-label="End call"
          className="flex h-8 items-center gap-1.5 rounded-sm bg-red-500 px-3 text-white transition-colors hover:bg-red-600"
          title="End call"
        >
          <PhoneOff className="h-3.5 w-3.5" />
          <span className="text-[11px] font-bold">END</span>
        </button>
      </div>
    </div>
  )
}
