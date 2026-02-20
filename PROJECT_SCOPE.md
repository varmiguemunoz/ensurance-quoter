# Project Scope — Ensurance

## Vision

Ensurance is a full-stack insurance agent platform that combines carrier underwriting intelligence, real-time quoting, lead management, telephony, and AI-powered call assistance into a single tool. Agents go from cold CSV lead to quoted, called, and closed — without leaving the platform.

**One-liner:** The agent command center that turns lead lists into closed policies.

## Goals

- [x] Quote engine with carrier intelligence (tobacco, medical, DUI, state filtering)
- [x] AI assistant panel with proactive insights
- [x] PDL lead enrichment (80+ fields)
- [x] Three-column layout (intake / results / AI)
- [ ] **Lead CRM** — CSV upload, lead list, lead detail, persistence
- [ ] **Enrichment → Quote pipeline** — one-click enrich → auto-fill → agent runs quote
- [ ] **Telnyx calling** — outbound dialer, number provisioning, call recording, transcription
- [ ] **Ringba inbound** — webhook receiver, auto-create leads from qualified inbound calls
- [ ] **Live AI assistant** — real-time transcript analysis, carrier suggestions mid-call
- [ ] **Real pricing** — Compulife API replaces mock pricing engine
- [ ] **Authentication** — Supabase Auth wired to existing UI pages
- [ ] **Resizable panels** — dynamic three-column layout with collapse/close

## Non-Goals (Explicitly Out of Scope)

- AI voice agents (Telnyx agentic calling) — agents make real calls, AI assists silently
- White-label / multi-agency — single-tenant for now
- Commission tracking — future phase
- Mobile app — web-only
- Whole life / IUL quoting — term life only for MVP
- Auto-quoting without agent review — agent always controls when quotes run

## Success Criteria

- [ ] Agent can upload a CSV, see leads in a list, click one, enrich it, review the auto-filled intake, and run a quote — all in one session
- [ ] Quote + enrichment data persists across page refreshes (database-backed)
- [ ] Agent can call a lead from the platform via Telnyx with call recording
- [ ] Call transcription appears in real-time during the call
- [ ] AI provides carrier-relevant suggestions based on transcript content
- [ ] Resizable/collapsible panels let agent customize their workspace

## Phases

### Phase 1: Lead CRM Foundation
**Status:** Not Started
**Tasks:** TASKS/01-* through TASKS/08-*
**Outcome:** Agents can upload CSVs, browse leads, click into lead detail, enrich, review auto-filled intake, run quotes, and save everything to Supabase.

### Phase 2: Enrichment → Quote Pipeline Refinement
**Status:** Not Started
**Tasks:** TASKS/09-* through TASKS/11-*
**Outcome:** Streamlined flow — enrich auto-fills all available fields, agent reviews and triggers quote. Enrichment results persist per lead. Single "Send to AI" button replaces current dual-action buttons.

### Phase 3: Telnyx Calling
**Status:** Not Started (research needed)
**Tasks:** TASKS/12-* through TASKS/17-*
**Outcome:** Agents can purchase numbers, make outbound calls via WebRTC in-browser, record calls, and view transcriptions stored per lead.
**Dependencies:** Telnyx account, WebRTC SDK research, transcription provider decision.

### Phase 4: Ringba Inbound + Live AI
**Status:** Not Started (research needed)
**Tasks:** TASKS/18-* through TASKS/22-*
**Outcome:** Inbound calls from Ringba create leads automatically. During calls, AI reads transcript and surfaces carrier intelligence in real-time.
**Dependencies:** Ringba account, Phase 3 transcription infrastructure.

### Phase 5: Production Readiness
**Status:** Not Started
**Tasks:** TASKS/23-* through TASKS/27-*
**Outcome:** Compulife real pricing, Supabase Auth wired, deployment, monitoring.
**Dependencies:** Compulife API access (follow up with Jeremiah).

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Compulife API access delayed | High | Medium | Mock pricing works for demos; prioritize CRM/calling first |
| Telnyx WebRTC documentation gaps | Medium | High | Lukas has Telnyx experience from Growthly project; start with basic call control |
| Ringba integration complexity | Medium | Medium | Ringba has REST API + webhooks; start with webhook receiver only |
| PDL free tier data limitations | Low | High | Age estimation fallback already implemented; upgrade when revenue justifies |
| State management complexity | Medium | Medium | Migrate to Zustand before adding persistence; avoid Context spaghetti |

## Dependencies

- [x] OpenAI API key (GPT-4o-mini) — active
- [x] People Data Labs API key — active (free tier)
- [ ] Supabase project — MCP connected but no schema
- [ ] Compulife API — $480/yr, pending commercial access (contact: Jeremiah)
- [ ] Telnyx account — Lukas has existing account from Growthly
- [ ] Ringba account — needs setup
- [ ] Domain + hosting — Vercel (not yet deployed)

## Human Checkpoints

- [ ] Database migrations (Phase 1, Task 02)
- [ ] Supabase RLS policies (Phase 1, Task 02)
- [ ] Telnyx number purchase (Phase 3 — real money)
- [ ] Ringba account setup (Phase 4)
- [ ] Production deployment (Phase 5)
- [ ] Compulife API key configuration (Phase 5)

## Recommended Agents

| Agent | Use For | Phase |
|-------|---------|-------|
| planner | All task breakdowns | All |
| architect | Database schema, state management migration | 1 |
| database-reviewer | Supabase schema, RLS, migrations | 1 |
| code-reviewer | Component quality, TypeScript patterns | 1-2 |
| ui-reviewer | Lead list/detail views, resizable panels | 1-2 |
| security-reviewer | Auth flow, API key management, Telnyx credentials | 3-5 |
| build-error-resolver | Integration issues | All |

### Skills to Load

| Skill | When to Use |
|-------|-------------|
| postgres-patterns | Schema design, RLS, indexing (Phase 1) |
| frontend-patterns | Lead list, state management, hooks (Phase 1-2) |
| shadcn-ui | Data table, resizable panels, sheet components (Phase 1) |
| next-best-practices | API routes, server/client patterns (All) |
| backend-patterns | Webhook handlers, external API integration (Phase 3-4) |
| security-review | Auth, credential management (Phase 3-5) |
| coding-standards | TypeScript strict patterns (All) |

## Architecture Notes

### Current State (What Exists)
- 10 carriers with intelligence data in static TypeScript (`lib/data/carriers.ts`)
- Mock pricing engine (`lib/engine/mock-pricing.ts`) — to be replaced by Compulife
- Eligibility + match scoring engines (`lib/engine/`) — permanent, our competitive moat
- AI chat panel with GPT-4o-mini streaming + proactive insights
- PDL enrichment with 80+ fields, stored in React useState (no persistence)
- All state in `QuotePageClient` useState — no global state management
- No database, no auth logic, no persistence

### Target State (After Phase 2)
- Supabase PostgreSQL with `leads`, `quotes`, `enrichments`, `call_logs` tables
- Lead-centric workflow: lead list → lead detail → enrich → quote → call
- Zustand store for active lead state, synced to Supabase
- Resizable three-column layout with collapse/close
- Enrichment + quote results persist per lead record

### Key Architectural Decisions
1. **Supabase over raw Postgres** — auth, RLS, real-time subscriptions, hosted
2. **Zustand over Context** — simpler than Redux, works with server components, persist middleware
3. **Lead as first-class entity** — everything (enrichment, quotes, calls) attaches to a lead record
4. **Telnyx for outbound, Ringba for inbound** — different tools for different flows
5. **Agent controls the flow** — no auto-quoting, no auto-calling. AI assists, agent decides.
