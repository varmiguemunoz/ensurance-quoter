"use client"

import { useEffect, useRef } from "react"

/**
 * Plays a repeating ring tone using the Web Audio API while mounted.
 * Two 440Hz beeps per cycle, mimicking a classic phone ring pattern.
 * Unmounts when the parent component (IncomingCallBanner) unmounts.
 */
export function RingSound() {
  const ctxRef = useRef<AudioContext | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const ctx = new AudioContext()
    ctxRef.current = ctx

    function playBeep() {
      if (ctx.state === "closed") return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 440
      gain.gain.value = 0.15
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.15)

      // Second beep after short gap
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.frequency.value = 440
      gain2.gain.value = 0.15
      osc2.start(ctx.currentTime + 0.25)
      osc2.stop(ctx.currentTime + 0.4)
    }

    // Play immediately, then repeat every 2 seconds
    playBeep()
    intervalRef.current = setInterval(playBeep, 2000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      void ctx.close()
    }
  }, [])

  return null
}
