"use client"

import { useEffect, useRef } from "react"
import { useCallStore } from "@/lib/store/call-store"
import { acceptInboundCall, declineInboundCall } from "@/lib/telnyx/inbound-handler"
import { Phone, PhoneOff } from "lucide-react"
import { RingSound } from "./ring-sound"

/** Format E.164 number for display: +12025551234 → (202) 555-1234 */
function formatCallerNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  // US 10-digit or 11-digit (with leading 1)
  const national = digits.length === 11 && digits.startsWith("1")
    ? digits.slice(1)
    : digits
  if (national.length === 10) {
    return `(${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`
  }
  return raw
}

const TIMEOUT_MS = 30_000

/**
 * Fixed-position banner that appears when an inbound call is ringing.
 * Shows caller ID, accept (green) and decline (red) buttons.
 * Auto-dismisses after 30 seconds if not answered.
 */
export function IncomingCallBanner() {
  const callState = useCallStore((s) => s.callState)
  const callDirection = useCallStore((s) => s.callDirection)
  const callerNumber = useCallStore((s) => s.inboundCallerNumber)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isVisible = callDirection === "inbound" && callState === "ringing"

  // Auto-decline after 30 seconds
  useEffect(() => {
    if (isVisible) {
      timeoutRef.current = setTimeout(() => {
        declineInboundCall()
      }, TIMEOUT_MS)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [isVisible])

  if (!isVisible) return null

  const displayNumber = callerNumber
    ? formatCallerNumber(callerNumber)
    : "Unknown Caller"

  return (
    <>
      <RingSound />
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-blue-200 bg-blue-50 px-4 py-3 shadow-md animate-in slide-in-from-top duration-300">
        {/* Left: Pulsing icon + caller info */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 animate-pulse">
            <Phone className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0f172a]">
              Incoming Call
            </p>
            <p className="text-xs text-[#64748b]">{displayNumber}</p>
          </div>
        </div>

        {/* Right: Accept / Decline */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={declineInboundCall}
            className="flex h-10 items-center gap-1.5 rounded-md bg-red-500 px-4 text-white transition-colors hover:bg-red-600"
            aria-label="Decline call"
          >
            <PhoneOff className="h-4 w-4" />
            <span className="text-sm font-semibold">Decline</span>
          </button>
          <button
            type="button"
            onClick={acceptInboundCall}
            className="flex h-10 items-center gap-1.5 rounded-md bg-green-500 px-4 text-white transition-colors hover:bg-green-600"
            aria-label="Accept call"
          >
            <Phone className="h-4 w-4" />
            <span className="text-sm font-semibold">Accept</span>
          </button>
        </div>
      </div>
    </>
  )
}
