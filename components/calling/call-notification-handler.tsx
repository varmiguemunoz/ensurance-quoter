"use client"

import { useEffect } from "react"
import { disconnect } from "@/lib/telnyx/client"
import { RemoteAudio } from "./remote-audio"

/**
 * Global call handler mounted in root layout.
 * Ensures audio playback persists across route navigation and
 * cleans up the Telnyx client on page unload.
 *
 * Notification processing is handled by lib/telnyx/notification-handler.ts
 * (wired as a callback during client initialization in connect.ts).
 */
export function CallNotificationHandler() {
  useEffect(() => {
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
