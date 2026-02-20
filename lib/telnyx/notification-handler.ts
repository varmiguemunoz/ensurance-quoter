/* ------------------------------------------------------------------ */
/*  Telnyx Notification Handler                                        */
/*  Maps TelnyxRTC call state events to our Zustand call-store.        */
/*  Pure module — no React dependencies, safe to call from anywhere.   */
/* ------------------------------------------------------------------ */

import { useCallStore } from "@/lib/store/call-store"
import { setActiveCall, getLocalStream, getRemoteStream } from "./active-call"
import type { TelnyxNotification } from "./client"
import { startTranscription, stopTranscription } from "@/lib/deepgram/stream"
import { toast } from "sonner"

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Tracked timeout for post-hangup reset, so it can be cancelled on redial. */
let hangupTimeoutId: ReturnType<typeof setTimeout> | null = null

function clearHangupTimeout(): void {
  if (hangupTimeoutId) {
    clearTimeout(hangupTimeoutId)
    hangupTimeoutId = null
  }
}

/**
 * Process a TelnyxRTC notification event.
 *
 * Telnyx call states → our CallState mapping:
 *   new, requesting, trying → (connecting — already set by CallButton)
 *   ringing                 → ringing
 *   early, answering        → (transitional — keep current state)
 *   active                  → active
 *   held                    → held
 *   hangup                  → ending → idle (after 2s)
 *   destroy, purge          → idle (immediate reset)
 */
export function handleTelnyxNotification(
  notification: TelnyxNotification,
): void {
  // Handle microphone permission errors
  if (notification.type === "userMediaError") {
    stopTranscription()
    clearHangupTimeout()
    useCallStore
      .getState()
      .setError("Microphone access denied")
    toast.error(
      "Microphone access denied — please allow microphone access and try again",
    )
    useCallStore.getState().resetCall()
    setActiveCall(null)
    return
  }

  if (notification.type !== "callUpdate" || !notification.call) return

  const call = notification.call as any
  const telnyxState = call.state as string
  const callId: string = (call.id ?? call.sipCallId ?? "") as string

  // Cancel pending hangup reset if a new call event arrives
  if (telnyxState !== "hangup") {
    clearHangupTimeout()
  }

  setActiveCall(call)

  const store = useCallStore.getState()

  switch (telnyxState) {
    case "new":
    case "requesting":
    case "trying":
      // Pre-connection states — callConnecting was already set by CallButton
      break

    case "ringing":
      store.setCallRinging(callId)
      break

    case "early":
    case "answering":
      // Transitional SIP states — stay in current state
      break

    case "active":
      if (store.callState === "held") {
        // Resuming from hold
        store.setCallUnheld()
      } else if (store.callState !== "active") {
        store.setCallActive(callId)
        toast.success("Call connected")

        // Start live transcription once call is active.
        // TODO(P3): Gate on recording consent — currently assumes agent
        // plays disclosure prompt before call connects (see compliance.md).
        startTranscription(getLocalStream(), getRemoteStream())
      }
      break

    case "held":
      store.setCallHeld()
      break

    case "hangup":
      stopTranscription()
      store.setCallEnding()
      toast.info("Call ended")
      clearHangupTimeout()
      hangupTimeoutId = setTimeout(() => {
        hangupTimeoutId = null
        useCallStore.getState().resetCall()
        setActiveCall(null)
      }, 2000)
      break

    case "destroy":
    case "purge":
      stopTranscription()
      clearHangupTimeout()
      store.resetCall()
      setActiveCall(null)
      break
  }
}
