import type { TelnyxRTC } from "@telnyx/webrtc"

/* ------------------------------------------------------------------ */
/*  TelnyxRTC Singleton Wrapper                                        */
/*  Manages connection lifecycle, token refresh, and reconnection.     */
/*  Client-side only — use dynamic import if SSR issues arise.         */
/* ------------------------------------------------------------------ */

let clientInstance: TelnyxRTC | null = null
let currentToken: string | null = null

export interface TelnyxClientOptions {
  token: string
  onReady: () => void
  onError: (error: unknown) => void
  onNotification: (notification: TelnyxNotification) => void
  onSocketClose: () => void
}

export interface TelnyxNotification {
  type: string
  call?: unknown
}

/**
 * Initialize and connect the TelnyxRTC client.
 * If a client already exists with the same token, returns it.
 * If the token has changed, disconnects the old client first.
 */
export async function initClient(
  options: TelnyxClientOptions,
): Promise<TelnyxRTC> {
  // Reuse existing client if token unchanged
  if (clientInstance && currentToken === options.token) {
    return clientInstance
  }

  // Disconnect stale client
  if (clientInstance) {
    disconnect()
  }

  // Dynamic import to avoid SSR issues
  const { TelnyxRTC: TelnyxRTCConstructor } = await import("@telnyx/webrtc")

  const client = new TelnyxRTCConstructor({
    login_token: options.token,
  })

  // Wire events before connecting
  client.on("telnyx.ready", () => {
    options.onReady()
  })

  client.on("telnyx.error", (error: unknown) => {
    options.onError(error)
  })

  client.on("telnyx.notification", (notification: TelnyxNotification) => {
    options.onNotification(notification)
  })

  client.on("telnyx.socket.close", () => {
    options.onSocketClose()
  })

  client.connect()

  clientInstance = client
  currentToken = options.token

  return client
}

/**
 * Get the current TelnyxRTC client instance (or null if not connected).
 */
export function getClient(): TelnyxRTC | null {
  return clientInstance
}

/**
 * Disconnect and clean up the TelnyxRTC client.
 */
export function disconnect(): void {
  if (clientInstance) {
    try {
      clientInstance.disconnect()
    } catch {
      // Client may already be disconnected
    }
    clientInstance = null
    currentToken = null
  }
}

/**
 * Check if the client is currently connected and ready.
 */
export function isConnected(): boolean {
  return clientInstance !== null
}

/**
 * Refresh the token by disconnecting and reconnecting with a new one.
 */
export async function refreshToken(
  options: TelnyxClientOptions,
): Promise<TelnyxRTC> {
  disconnect()
  return initClient(options)
}
