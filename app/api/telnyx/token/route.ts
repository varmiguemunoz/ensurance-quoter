import { NextResponse } from "next/server"
import { z } from "zod"

/* ------------------------------------------------------------------ */
/*  POST /api/telnyx/token                                             */
/*  Generate a JWT token for TelnyxRTC client authentication.          */
/*  Credentials stay server-side — only the token reaches the client.  */
/* ------------------------------------------------------------------ */

const RequestSchema = z.object({
  leadId: z.string().uuid(),
})

// TODO(P5): Add auth check — this endpoint grants telephony access (real cost per call)
export async function POST(request: Request) {
  const apiKey = process.env.TELNYX_API_KEY
  const connectionId = process.env.TELNYX_CONNECTION_ID
  const callerNumber = process.env.TELNYX_CALLER_NUMBER

  if (!apiKey || !connectionId || !callerNumber) {
    return NextResponse.json(
      { error: "Telnyx credentials not configured" },
      { status: 500 },
    )
  }

  // Validate request body
  let body: z.infer<typeof RequestSchema>
  try {
    const raw = await request.json()
    body = RequestSchema.parse(raw)
  } catch {
    return NextResponse.json(
      { error: "Invalid request — leadId (UUID) required" },
      { status: 400 },
    )
  }

  // Generate JWT from Telnyx API
  try {
    const response = await fetch(
      `https://api.telnyx.com/v2/telephony_credentials/${encodeURIComponent(connectionId)}/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      },
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to generate call token. Please try again." },
        { status: 502 },
      )
    }

    const raw = await response.json()
    const token: unknown = raw?.data?.token
    if (typeof token !== "string" || token.length === 0) {
      return NextResponse.json(
        { error: "Invalid token response from Telnyx" },
        { status: 502 },
      )
    }

    return NextResponse.json({
      token,
      callerNumber: callerNumber ?? null,
      leadId: body.leadId,
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to generate call token. Please try again." },
      { status: 500 },
    )
  }
}
