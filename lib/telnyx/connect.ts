/* ------------------------------------------------------------------ */
/*  Telnyx Connection Orchestration                                    */
/*  Initializes the TelnyxRTC client and waits for ready state.        */
/* ------------------------------------------------------------------ */

import type { TelnyxRTC } from "@telnyx/webrtc"
import { initClient, getClient } from "./client"
import { handleTelnyxNotification } from "./notification-handler"
import { useCallStore } from "@/lib/store/call-store"
import { toast } from "sonner"

const CONNECTION_TIMEOUT_MS = 15_000

/**
 * Initialize the TelnyxRTC client and wait for it to reach "ready" state.
 * If a client already exists with the same token and is ready, returns immediately.
 * Throws on timeout (15s) or connection error.
 */
export async function connectAndReady(token: string): Promise<TelnyxRTC> {
  // If already connected and ready, reuse
  const existing = getClient()
  if (existing && useCallStore.getState().isClientReady) {
    return existing
  }

  return new Promise<TelnyxRTC>((resolve, reject) => {
    let settled = false

    const timeoutId = setTimeout(() => {
      if (!settled) {
        settled = true
        reject(new Error("Telnyx connection timeout (15s)"))
      }
    }, CONNECTION_TIMEOUT_MS)

    initClient({
      token,
      onReady: () => {
        if (settled) return
        settled = true
        clearTimeout(timeoutId)
        useCallStore.getState().setClientReady(true)
        const client = getClient()
        if (client) {
          resolve(client)
        } else {
          reject(new Error("Client unavailable after ready"))
        }
      },
      onError: (error) => {
        if (settled) return
        settled = true
        clearTimeout(timeoutId)
        const msg =
          error instanceof Error ? error.message : "Connection failed"
        useCallStore.getState().setError(msg)
        reject(new Error(msg))
      },
      onNotification: handleTelnyxNotification,
      onSocketClose: () => {
        useCallStore.getState().setClientReady(false)
        toast.error("Call connection lost")
      },
    }).catch((err) => {
      if (!settled) {
        settled = true
        clearTimeout(timeoutId)
        reject(err)
      }
    })
  })
}
