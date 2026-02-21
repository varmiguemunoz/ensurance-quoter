"use client"

import { useEffect, useRef } from "react"
import { getRemoteStream } from "@/lib/telnyx/active-call"
import { useCallStore } from "@/lib/store/call-store"

/**
 * Hidden <audio> element that plays the remote party's audio.
 * Must be mounted in root layout so audio persists across navigation.
 */
export function RemoteAudio() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const callState = useCallStore((s) => s.callState)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (callState === "active" || callState === "held") {
      const stream = getRemoteStream()
      if (stream) {
        audio.srcObject = stream
        // Explicit play() in case browser blocks autoplay
        audio.play().catch(() => {
          // Autoplay policy may block; call was user-initiated so this is rare
        })
      }
    } else {
      audio.srcObject = null
    }
  }, [callState])

  return <audio ref={audioRef} autoPlay />
}
