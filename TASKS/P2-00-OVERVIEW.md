# Phase 2: Telnyx Dialer + Live Transcription + AI Coaching

## Overview
Add browser-based outbound calling via Telnyx WebRTC, real-time speech-to-text via Deepgram, and carrier-intelligent AI coaching that surfaces underwriting insights during live calls. After the call, everything is saved — transcript, coaching hints, and AI summary.

## Demo Story (for Max)
Agent opens a lead → sees their phone number → clicks "Call" → Telnyx connects the call through the browser → while talking, the AI panel shows a live transcript → when the client mentions they're diabetic, a coaching hint appears: "John Hancock offers Preferred DB for insulin-dependent diabetes. Most others decline." → call ends → transcript and summary save to the lead record → agent can review any past call.

## Task Dependency Graph

```
P2-01 Telnyx SDK + Call Store
  │
  ├── P2-02 Dialer UI + Call Controls
  │     │
  │     └── P2-03 Deepgram Streaming Transcription ⚠️ COMPLEX
  │           │
  │           ├── P2-04 Live Transcript UI (can start with mock data)
  │           │
  │           └── P2-05 Real-Time AI Coaching
  │                 │
  │                 └── P2-06 Post-Call Persistence + Summary
```

## Execution Order

| Order | Task | Depends On | Complexity | Human Checkpoint |
|---|---|---|---|---|
| 1 | P2-01: SDK + Call Store | Phase 1, Telnyx portal | Medium | ✅ Portal config |
| 2 | P2-02: Dialer + Controls | P2-01 | Medium | ✅ Test real call |
| 3 | P2-03: Deepgram Transcription | P2-01, P2-02 | **HIGH** | ✅ Test real call |
| 4 | P2-04: Transcript UI | P2-01 (P2-03 optional) | Low-Med | None |
| 5 | P2-05: AI Coaching | P2-03, P2-04 | Medium | None |
| 6 | P2-06: Post-Call Persistence | P2-02, P2-03, P2-05 | Medium | ✅ Verify in DB |

**Note:** P2-04 (Transcript UI) can start in parallel with P2-03 using mock transcript data. This is intentional — the UI developer can work on the display while the audio pipeline is being built.

## Pre-Requisites (Lukas must do before Task 01)

### Telnyx Portal Setup
1. Log in to portal.telnyx.com
2. Create a **Credential Connection** (SIP credentials for WebRTC auth)
3. Create an **Outbound Voice Profile** (OVP) with whitelisted destinations: ["US"]
4. Link the OVP to the Credential Connection
5. Purchase a phone number and assign it to the Credential Connection
6. Generate an **API v2 Key** (for JWT token generation)
7. Note the **Connection ID** from the Credential Connection detail page

### Deepgram Setup
1. Sign up at console.deepgram.com
2. Claim $200 free credits
3. Generate an API key

### Environment Variables
```bash
# Add to .env.local
TELNYX_API_KEY=KEY_xxx          # API v2 key from portal
TELNYX_CONNECTION_ID=xxx        # From Credential Connection
TELNYX_CALLER_NUMBER=+1xxx     # Purchased Telnyx number in E.164 format
DEEPGRAM_API_KEY=xxx            # From Deepgram console
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER                               │
│                                                          │
│  ┌─────────┐     ┌──────────────┐     ┌──────────────┐ │
│  │ Dialer  │────▶│ TelnyxRTC    │────▶│ PSTN Call     │ │
│  │   UI    │     │ Client       │     │ (via Telnyx)  │ │
│  └─────────┘     └──────┬───────┘     └──────────────┘ │
│                         │                                │
│                   MediaStream                            │
│                         │                                │
│                  ┌──────▼───────┐                        │
│                  │ AudioContext  │                        │
│                  │ PCM Capture   │                        │
│                  └──────┬───────┘                        │
│                         │                                │
│                   PCM Chunks                             │
│                         │                                │
│  ┌──────────────────────▼────────────────────────────┐  │
│  │         SSE + POST Client                         │  │
│  │  (POSTs audio, receives transcripts via SSE)      │  │
│  └──────────────────────┬────────────────────────────┘  │
│                         │                                │
│  ┌──────────────────────▼────────────────────────────┐  │
│  │           Call Store (Zustand)                      │  │
│  │  • callState    • transcript[]                     │  │
│  │  • callDuration • coachingHints[]                  │  │
│  └──────────────────────┬────────────────────────────┘  │
│                         │                                │
│  ┌──────────────────────▼────────────────────────────┐  │
│  │         AI Panel (Call Mode)                        │  │
│  │  • Live transcript with speaker labels              │  │
│  │  • Inline coaching hints                            │  │
│  │  • Auto-scroll                                      │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────┬───────────────────────────────┘
                           │
                    ┌──────▼───────┐
                    │  Next.js API  │
                    │  Routes       │
                    │               │
                    │ /api/telnyx/  │──▶ Telnyx API (JWT)
                    │   token       │
                    │               │
                    │ /api/         │──▶ Deepgram Streaming
                    │   transcribe  │    API (SSE out + POST in)
                    │   transcribe/ │
                    │   audio       │
                    │               │
                    │ /api/         │──▶ OpenAI GPT-4o-mini
                    │   coaching    │    (carrier coaching)
                    │               │
                    │ /api/call-    │──▶ OpenAI GPT-4o-mini
                    │   summary     │    (call summary)
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Supabase   │
                    │  call_logs   │
                    └──────────────┘
```

## Cost Per Call (10-minute call estimate)

| Service | Rate | 10-min Cost |
|---|---|---|
| Telnyx Voice | ~$0.01/min | $0.10 |
| Deepgram Nova-3 | $0.0077/min | $0.077 |
| GPT-4o-mini Coaching (~20 calls) | ~$0.0001/call | $0.002 |
| GPT-4o-mini Summary (1 call) | ~$0.0003 | $0.0003 |
| **Total** | | **~$0.18** |

Deepgram $200 credits = ~430 hours of calls before billing starts.

## Risk Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Next.js doesn't support WebSocket API routes | High | **DECIDED**: SSE for transcript output (`GET /api/transcribe`) + POST for audio input (`/api/transcribe/audio`). Most Next.js-native approach. |
| Browser can't capture remote call audio | High | Mix local mic + remote stream via Web Audio API. Fallback: Telnyx call recording + post-call download. |
| ScriptProcessorNode deprecated | Low | Still widely supported. Migrate to AudioWorklet in future if needed. |
| Deepgram diarization accuracy | Medium | Agent is always speaker 0 (local mic). If diarization fails, default to timestamp-based attribution. |
| WebSocket disconnects during call | Medium | Buffer audio chunks (max 5s), reconnect with exponential backoff, replay buffer. |

## Architecture Decisions (from validation audit)

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | **SSE + POST** for Deepgram proxy (not WebSocket) | Next.js App Router doesn't support WS upgrades. SSE out + POST in is the most native approach. Tiny latency is negligible for transcript display. |
| 2 | **Reuse `CallDirection`** from `database.ts` | Already exported as `"inbound" \| "outbound"`. Don't redefine in `call.ts`. |
| 3 | **Call logs stay separate** from Lead type | No `callLogs` field on Lead. Call-store holds active call data. P2-06 badge does separate count query by lead_id. |
| 4 | **CallNotificationHandler in root layout** | Mounts in `app/layout.tsx` so call state works across all routes (leads, quote, etc.). |
| 5 | **ActiveCallBar inside LeadDetailClient** | Between breadcrumb header and `<QuoteWorkspace>`. Not in layout. |
| 6 | **call_logs migration at P2-06** | Add `ai_summary` TEXT + `coaching_hints` JSONB columns via Supabase MCP as first step of P2-06. Not a pre-Phase-2 blocker. |
| 7 | **Token endpoint returns caller number** | Server reads `TELNYX_CALLER_NUMBER` env var, returns it alongside JWT so client never needs server-only env vars. |
| 8 | **Reuse ProactiveInsight color/icon maps** for CoachingHint | Same `type` enum values. Share `INSIGHT_ICONS` and `INSIGHT_COLORS` from ai-assistant-panel. |
| 9 | **Supabase MCP for all migrations** | No local `supabase/migrations/` directory. Use `apply_migration` tool. Regenerate types after. |

## Files Created (complete list)

```
lib/
├── types/call.ts                    # CallState, TranscriptEntry, CoachingHint, CallLogEntry (reuses CallDirection from database.ts)
├── store/call-store.ts              # Zustand store for all call state
├── telnyx/
│   ├── client.ts                    # TelnyxRTC singleton wrapper
│   └── audio-capture.ts            # MediaStream → PCM chunks
├── deepgram/
│   └── stream.ts                   # WebSocket client for Deepgram proxy
├── ai/
│   ├── call-coach.ts               # Coaching prompt builder + parser
│   └── coaching-context.ts         # Condensed carrier intel for coaching
└── supabase/
    └── calls.ts                    # saveCallLog, getCallLogs, getCallLog

app/api/
├── telnyx/token/route.ts           # JWT token generation (server-side)
├── transcribe/route.ts             # SSE endpoint for transcript streaming
├── transcribe/audio/route.ts      # POST endpoint for audio chunks → Deepgram
├── coaching/route.ts               # Real-time AI coaching endpoint
└── call-summary/route.ts           # Post-call AI summary endpoint

components/calling/
├── call-button.tsx                  # Click-to-call in lead header
├── active-call-bar.tsx             # During-call controls bar
├── dtmf-keypad.tsx                 # DTMF tone pad modal
├── remote-audio.tsx                # Hidden <audio> for remote stream
├── call-notification-handler.tsx   # TelnyxRTC event → store dispatcher
├── transcript-view.tsx             # Scrolling transcript container
├── transcript-entry.tsx            # Individual speech bubble
├── coaching-hint-card.tsx          # Inline coaching hint display
├── call-mode-header.tsx            # Call info bar in AI panel
├── call-log-viewer.tsx             # Past calls list in lead detail
└── transcript-modal.tsx            # Full transcript review modal
```
