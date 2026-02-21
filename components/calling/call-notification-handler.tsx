"use client"

import { useEffect, useRef } from "react"
import { disconnect } from "@/lib/telnyx/client"
import { connectAndReady } from "@/lib/telnyx/connect"
import { RemoteAudio } from "./remote-audio"

/**
 * Global call handler mounted in root layout.
 * Auto-connects the TelnyxRTC client on mount so inbound calls can be
 * received at any time. Ensures audio playback persists across route
 * navigation and cleans up on page unload.
 *
 * Notification processing is handled by lib/telnyx/notification-handler.ts
 * (wired as a callback during client initialization in connect.ts).
 */
export function CallNotificationHandler() {
  const didConnect = useRef(false)

  useEffect(() => {
    // Auto-connect once on mount for inbound call readiness
    if (!didConnect.current) {
      didConnect.current = true
      void (async () => {
        try {
          const res = await fetch("/api/telnyx/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          })
          if (!res.ok) return
          const data = (await res.json()) as { token?: string }
          if (!data.token) return
          await connectAndReady(data.token)
        } catch {
          // Silent failure — outbound calls will retry on dial
        }
      })()
    }

    const handleUnload = () => {
      disconnect()
    }
    window.addEventListener("beforeunload", handleUnload)
    return () => {
      window.removeEventListener("beforeunload", handleUnload)
      disconnect()
    }
  }, [])

  return <RemoteAudio />
}
