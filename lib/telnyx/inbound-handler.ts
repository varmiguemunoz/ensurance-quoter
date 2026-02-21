/* ------------------------------------------------------------------ */
/*  Inbound Call Handler                                               */
/*  Accept / decline inbound calls via the active TelnyxCall object.   */
/* ------------------------------------------------------------------ */

import { useCallStore } from "@/lib/store/call-store"
import { getActiveCall, setActiveCall } from "./active-call"
import { toast } from "sonner"

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Set up call-store state when an inbound call starts ringing.
 * Called from notification-handler when it detects an inbound ringing event.
 */
export function handleInboundCall(call: unknown, callId: string): void {
  const telnyxCall = call as any
  const callerNumber: string =
    telnyxCall?.options?.remoteCallerNumber ??
    telnyxCall?.options?.callerNumber ??
    "Unknown"

  setActiveCall(call)
  useCallStore.getState().setInboundRinging(callId, callerNumber)
}

/**
 * Accept the currently ringing inbound call.
 * Transitions to active state — audio, transcript, coaching all start.
 */
export function acceptInboundCall(): void {
  const call = getActiveCall() as any
  if (!call) {
    toast.error("No incoming call to accept")
    return
  }

  try {
    call.answer()
  } catch {
    toast.error("Failed to answer call")
    useCallStore.getState().resetCall()
    setActiveCall(null)
  }
}

/**
 * Decline the currently ringing inbound call.
 * Hangs up and resets state.
 */
export function declineInboundCall(): void {
  const call = getActiveCall() as any
  if (!call) {
    useCallStore.getState().resetCall()
    return
  }

  try {
    call.hangup()
  } catch {
    // Call may have already ended
  }

  useCallStore.getState().resetCall()
  setActiveCall(null)
}
