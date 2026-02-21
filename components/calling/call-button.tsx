"use client"

import { useCallback, useState } from "react"
import { Phone, Loader2 } from "lucide-react"
import { useCallStore } from "@/lib/store/call-store"
import { useLeadStore } from "@/lib/store/lead-store"
import { connectAndReady } from "@/lib/telnyx/connect"
import { toast } from "sonner"

/**
 * Click-to-call button shown in the lead detail header.
 * Only visible when the active lead has a phone number.
 */
export function CallButton() {
  const activeLead = useLeadStore((s) => s.activeLead)
  const canDial = useCallStore((s) => s.canDial)
  const setCallConnecting = useCallStore((s) => s.setCallConnecting)
  const setError = useCallStore((s) => s.setError)
  const resetCall = useCallStore((s) => s.resetCall)

  const [isInitializing, setIsInitializing] = useState(false)

  const phoneNumber = activeLead?.phone ?? null
  const isDisabled = !canDial() || !phoneNumber || isInitializing

  const handleCall = useCallback(async () => {
    if (!activeLead || !phoneNumber) return

    setIsInitializing(true)
    setCallConnecting(activeLead.id, phoneNumber)

    try {
      // 1. Fetch token from server
      const res = await fetch("/api/telnyx/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: activeLead.id }),
      })

      const body = (await res.json().catch(() => null)) as Record<
        string,
        unknown
      > | null

      if (!res.ok) {
        throw new Error(
          (body?.error as string) ?? "Failed to get call token",
        )
      }

      const token = body?.token as string
      const callerNumber = body?.callerNumber as string

      if (!token) {
        throw new Error("No token received from server")
      }

      // 2. Connect client and wait for ready
      const client = await connectAndReady(token)

      // 3. Initiate the call
      client.newCall({
        destinationNumber: phoneNumber,
        callerNumber,
      })

      toast.info(`Calling ${phoneNumber}...`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to start call"
      setError(msg)
      toast.error(msg)
      resetCall()
    } finally {
      setIsInitializing(false)
    }
  }, [activeLead, phoneNumber, setCallConnecting, setError, resetCall])

  if (!phoneNumber) return null

  return (
    <button
      type="button"
      onClick={handleCall}
      disabled={isDisabled}
      className="flex items-center gap-1.5 rounded-sm bg-[#16a34a] px-3 py-1.5 text-white shadow-[0px_4px_6px_-1px_rgba(22,163,74,0.25)] transition-colors hover:bg-[#15803d] disabled:opacity-50"
      title={`Call ${phoneNumber}`}
    >
      {isInitializing ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Phone className="h-3.5 w-3.5" />
      )}
      <span className="text-[11px] font-bold">CALL</span>
    </button>
  )
}
