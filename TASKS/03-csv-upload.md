# Task: 03-csv-upload

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
- [x] Bash: `bunx tsc --noEmit`, `bun add papaparse @types/papaparse`
- [x] Grep, Glob (search)
- [ ] WebFetch (external docs)
- [ ] Task (sub-agents)

### 3. Guardrails (DO NOT)
- [ ] Do NOT modify: `components/ui/*`, existing quote components
- [ ] Do NOT expose: PII in console.log or error messages
- [ ] Do NOT skip: validation of CSV data before creating leads

### 4. Knowledge (MUST READ)
- [x] CLAUDE.md (always)
- [ ] Specific files: `lib/types/lead.ts` (from Task 02), `lib/store/lead-store.ts` (from Task 02)
- [ ] Current state audit: No CSV handling exists anywhere in the codebase.

### 5. Memory
- [x] N/A (fresh context)

### 6. Success Criteria
- [ ] `components/leads/csv-upload.tsx` exists — drag-and-drop + file picker UI
- [ ] `lib/utils/csv-parser.ts` exists — parses CSV, detects columns, returns structured data
- [ ] Column mapping UI: agent sees CSV columns and maps them to lead fields (name, email, phone, state, age, etc.)
- [ ] Preview: agent sees first 5 rows before confirming import
- [ ] On confirm: creates Lead[] via addLead() from store, persists to Supabase
- [ ] Handles: malformed rows (skip with warning), duplicate emails (flag), empty required fields
- [ ] Verification command: `bunx tsc --noEmit` exits 0

### 7. Dependencies
- [x] Task 02 must be complete (Lead type and store exist)

### 8. Failure Handling
**Max attempts:** 3

**On failure (per attempt):**
- [ ] Retry with different approach

**After max attempts exhausted:**
- [ ] Save error to `ERRORS/03-csv-upload.md` and STOP

**Rollback command:** `git stash && git checkout HEAD~1`

### 9. Learning
**Log to LEARNINGS.md if:**
- [ ] PapaParse has issues with specific CSV encodings
- [ ] Large CSV files (10k+ rows) cause performance issues — may need streaming parser

---

## Human Checkpoint
- [x] **NONE** - proceed automatically

---

## Description
Build a CSV upload component that lets agents import lead lists from vendors. The agent drops a CSV file, maps columns to lead fields, previews the data, and confirms the import. Leads are created in the Zustand store and persisted to Supabase.

## Acceptance Criteria
- [ ] Drag-and-drop zone with file picker fallback
- [ ] Auto-detects common column names (first_name, last_name, email, phone, state, zip, age, dob)
- [ ] Manual column mapping UI for unrecognized columns
- [ ] Preview table showing first 5 rows with mapped fields
- [ ] Import summary: "X leads imported, Y skipped (reasons)"
- [ ] Raw CSV row stored in lead.rawCsvData for reference
- [ ] Works with CSV files from common lead vendors (comma and tab delimited)

## Steps (high-level, /plan will expand)
1. Install PapaParse: `bun add papaparse @types/papaparse`
2. Create `lib/utils/csv-parser.ts` — parse CSV, auto-detect columns, return typed rows
3. Create `components/leads/csv-upload.tsx` — upload UI with drag-drop (use shadcn Card + Button)
4. Create `components/leads/column-mapper.tsx` — column mapping UI (dropdowns mapping CSV cols → Lead fields)
5. Create `components/leads/import-preview.tsx` — preview table with first 5 rows
6. Wire import button to create leads via store.addLead()
7. Add error handling for malformed/empty rows
8. Test with a sample CSV

## On Completion
- **Commit:** `feat: add CSV upload with column mapping for lead import`
- **Update:** [ ] CLAUDE.md (add papaparse to dependencies)
- **Handoff notes:** CSV upload component is ready. Task 04 (lead list view) will display the imported leads. The upload component should be accessible from the lead list view header.

## Notes
- Common lead vendor CSV columns: first_name, last_name, email, phone, address, city, state, zip, age, dob, source, campaign
- Some vendors use "Full Name" instead of first/last — handle splitting
- Store the entire raw CSV row as jsonb so nothing is lost even if agent doesn't map every column
- Don't over-engineer the mapping — 8-10 mappable fields is enough for MVP