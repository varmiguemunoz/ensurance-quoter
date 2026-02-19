# Task: 04-lead-list-view

## Status
- [x] Pending
- [x] In Progress
- [x] Verified
- [x] Complete

## Pillars

### 1. Model
sonnet

### 2. Tools Required
- [x] Read, Edit, Write (file operations)
- [x] Bash: `bunx tsc --noEmit`
- [x] Grep, Glob (search)
- [ ] WebFetch (external docs)
- [ ] Task (sub-agents)

### 3. Guardrails (DO NOT)
- [ ] Do NOT modify: `components/ui/*`, existing quote engine components
- [ ] Do NOT delete: existing `/quote` page functionality
- [ ] Do NOT skip: keyboard navigation and accessibility

### 4. Knowledge (MUST READ)
- [x] CLAUDE.md (always)
- [ ] Specific files: `lib/types/lead.ts`, `lib/store/lead-store.ts`, `lib/store/ui-store.ts` (from Task 02)
- [ ] Current state audit: No lead list exists. The `/quote` page currently shows a single-client quote flow.

### 5. Memory
- [x] N/A (fresh context)

### 6. Success Criteria
- [ ] `components/leads/lead-list.tsx` exists — table view of all leads with columns: Name, Email, Phone, State, Source, Status, Date
- [ ] Search/filter bar: filter by name, email, state, source
- [ ] Sort by any column (click header)
- [ ] Click a lead row → sets activeLead in store → navigates to detail/quote view
- [ ] CSV upload button in header (opens CSV upload from Task 03)
- [ ] Empty state: "No leads yet. Upload a CSV or add a lead manually."
- [ ] Verification command: `bunx tsc --noEmit` exits 0

### 7. Dependencies
- [x] Task 02 must be complete (Lead store)
- [x] Task 03 must be complete (CSV upload component)

### 8. Failure Handling
**Max attempts:** 3

**On failure (per attempt):**
- [ ] Retry with different approach

**After max attempts exhausted:**
- [ ] Save error to `ERRORS/04-lead-list-view.md` and STOP

**Rollback command:** `git stash && git checkout HEAD~1`

### 9. Learning
**Log to LEARNINGS.md if:**
- [ ] shadcn DataTable pattern requires specific setup
- [ ] Performance issues with large lead lists (>1000 rows)

---

## Human Checkpoint
- [x] **NONE** - proceed automatically

---

## Description
Build the lead list view — the main CRM screen where agents see all their leads. This is the entry point for the lead management workflow. Agents browse leads, search/filter, and click into individual leads to enrich and quote them.

## Acceptance Criteria
- [ ] Lead list renders from Zustand store (leads[])
- [ ] Columns: Name (first + last), Email, Phone, State, Source (badge: CSV/Ringba/Manual), Enriched (yes/no icon), Quoted (yes/no icon), Created date
- [ ] Search input filters across name, email, phone
- [ ] State dropdown filter
- [ ] Source dropdown filter (CSV, Ringba, Manual, All)
- [ ] Clicking a row sets activeLead and switches UI to detail view
- [ ] "Upload CSV" button in top-right opens the CSV upload dialog
- [ ] "Add Lead" button for manual entry (simple form dialog — name, email, phone, state)
- [ ] Responsive: works on tablet (768px+) and desktop

## Steps (high-level, /plan will expand)
1. Create `app/leads/page.tsx` — server component wrapper
2. Create `components/leads/lead-list.tsx` — client component with data table
3. Use shadcn Table component (or DataTable pattern with @tanstack/react-table if needed)
4. Add search input with debounced filtering
5. Add filter dropdowns (State, Source)
6. Add sort by column header click
7. Wire row click → store.setActiveLead() → route to lead detail
8. Add empty state
9. Add "Upload CSV" button → opens Dialog with CsvUpload component
10. Add "Add Lead" button → opens Dialog with simple manual entry form

## On Completion
- **Commit:** `feat: add lead list view with search, filter, and CSV upload`
- **Update:** [x] CLAUDE.md (add /leads route to directory structure)
- **Handoff notes:** Lead list is ready. Task 05 (lead detail) handles what happens when agent clicks a lead. The CSV upload dialog from Task 03 should be integrated into this view.

## Notes
- For MVP, load all leads into Zustand on page mount (fetch from Supabase). Pagination can come later.
- The lead list should feel like a CRM inbox — clean, scannable, fast.
- Source badge colors: CSV=blue, Ringba=green, Manual=gray
- Consider showing a "last quoted" date column so agents know which leads still need quoting