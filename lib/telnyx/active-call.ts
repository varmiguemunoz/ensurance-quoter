/* ------------------------------------------------------------------ */
/*  Active Call Reference                                              */
/*  Module-level storage for the current Telnyx Call object.           */
/*  Kept outside Zustand because Call objects aren't serializable.     */
/* ------------------------------------------------------------------ */

/* eslint-disable @typescript-eslint/no-explicit-any */

let activeCall: unknown = null

export function getActiveCall(): unknown {
  return activeCall
}

export function setActiveCall(call: unknown): void {
  activeCall = call
}

/** Hang up the active call. */
export function hangupCall(): void {
  const call = activeCall as any
  call?.hangup()
}

/** Put the active call on hold. */
export function holdCall(): void {
  const call = activeCall as any
  call?.hold()
}

/** Resume the active call from hold. */
export function unholdCall(): void {
  const call = activeCall as any
  call?.unhold()
}

/** Toggle microphone mute on the active call. */
export function toggleCallMute(): void {
  const call = activeCall as any
  call?.toggleAudioMute()
}

const VALID_DTMF = new Set([
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "#", "A", "B", "C", "D",
])

/** Send a DTMF digit during the active call. */
export function sendDTMF(digit: string): void {
  if (!VALID_DTMF.has(digit)) return
  const call = activeCall as any
  call?.dtmf(digit)
}

/** Get the remote MediaStream for audio playback. */
export function getRemoteStream(): MediaStream | null {
  const call = activeCall as any
  return call?.remoteStream ?? null
}
