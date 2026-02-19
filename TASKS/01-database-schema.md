# Task: 01-database-schema

## Status
- [x] Pending
- [x] In Progress
- [x] Verified
- [x] Complete

## Pillars

### 1. Model
opus

### 2. Tools Required
- [x] Read, Edit, Write (file operations)
- [x] Bash: `bunx supabase migration new`, `bunx supabase db push`
- [x] Grep, Glob (search)
- [ ] WebFetch (external docs)
- [ ] Task (sub-agents)

### 3. Guardrails (DO NOT)
- [ ] Do NOT modify: `components/ui/*`, `styles/globals.css`
- [ ] Do NOT delete: any existing `lib/data/` or `lib/engine/` files
- [ ] Do NOT expose: Supabase service key in client code
- [ ] Do NOT skip: RLS policies on every table

### 4. Knowledge (MUST READ)
- [x] CLAUDE.md (always)
- [x] PROJECT_SCOPE.md
- [ ] Specific files: `lib/types/carrier.ts`, `lib/types/quote.ts`, `lib/types/ai.ts` (existing types to reference)
- [ ] External docs: https://supabase.com/docs/guides/database/tables
- [ ] Current state audit: No database exists yet. Supabase MCP is connected but no schema.

### 5. Memory
- [x] N/A (fresh context)

### 6. Success Criteria
- [ ] `leads` table created with: id, agent_id, first_name, last_name, email, phone, state, age, gender, tobacco_status, source (csv/ringba/manual), raw_csv_data (jsonb), created_at, updated_at
- [ ] `enrichments` table created with: id, lead_id (FK), pdl_data (jsonb), enriched_at
- [ ] `quotes` table created with: id, lead_id (FK), request_data (jsonb), response_data (jsonb), created_at
- [ ] `call_logs` table created with: id, lead_id (FK), direction (inbound/outbound), provider (telnyx/ringba), provider_call_id, duration_seconds, recording_url, transcript_text, started_at, ended_at
- [ ] RLS policies: agents can only see their own leads/quotes/calls
- [ ] Verification command: `bunx supabase db push --dry-run` exits 0

### 7. Dependencies
- [ ] Supabase project must exist and be linked (`bunx supabase link`)
- [ ] SUPABASE_URL and SUPABASE_ANON_KEY in `.env.local`

### 8. Failure Handling
**Max attempts:** 3

**On failure (per attempt):**
- [ ] Retry with different approach
- [ ] Rollback: `bunx supabase db reset`

**After max attempts exhausted:**
- [ ] Escalate to human immediately

**Rollback command:** `bunx supabase migration repair --status reverted`

### 9. Learning
**Log to LEARNINGS.md if:**
- [ ] Supabase MCP has limitations with schema creation
- [ ] RLS policy syntax issues
- [ ] jsonb column indexing needed for query performance

---

## Human Checkpoint
- [x] **REQUIRED** - approval needed (database migration)

---

## Description
Create the foundational database schema in Supabase for lead management. This schema supports the full agent workflow: leads come in (CSV upload, Ringba webhook, or manual entry), get enriched (PDL), quoted (quote engine), and called (Telnyx/Ringba). All data persists per lead.

## Acceptance Criteria
- [ ] Migration file created in `supabase/migrations/`
- [ ] All 4 tables created with correct columns and types
- [ ] Foreign keys: enrichments.lead_id → leads.id, quotes.lead_id → leads.id, call_logs.lead_id → leads.id
- [ ] RLS enabled on all tables
- [ ] Indexes on: leads.agent_id, leads.email, leads.state, quotes.lead_id, call_logs.lead_id
- [ ] TypeScript types generated or manually created in `lib/types/database.ts`

## Steps (high-level, /plan will expand)
1. Initialize Supabase in project if not already (`bunx supabase init`)
2. Create migration file with all 4 tables
3. Add RLS policies (agent sees own data only)
4. Add indexes for common query patterns
5. Create `lib/types/database.ts` with TypeScript interfaces matching schema
6. Create `lib/supabase/client.ts` for browser client and `lib/supabase/server.ts` for server client
7. Test migration with dry-run
8. Apply migration (HUMAN CHECKPOINT)

## On Completion
- **Commit:** `feat: add Supabase schema for leads, quotes, enrichments, call_logs`
- **Update:** [x] PROJECT_SCOPE.md [x] CLAUDE.md
- **Handoff notes:** Schema is ready. Task 02 (Lead type) can reference `lib/types/database.ts`. Supabase clients in `lib/supabase/`.

## Notes
- Use `jsonb` for raw_csv_data, pdl_data, request_data, response_data — flexible storage for varying structures
- agent_id will reference Supabase auth.users.id once auth is implemented (Phase 5). For now, use a placeholder UUID.
- The `source` column on leads tracks origin: 'csv', 'ringba', 'manual', 'api'
- Consider `ON DELETE CASCADE` for enrichments/quotes/call_logs when lead is deleted