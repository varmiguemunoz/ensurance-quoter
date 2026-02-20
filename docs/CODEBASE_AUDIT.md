# Ensurance Quoter — Full Codebase Audit

> Generated 2026-02-18

## 1. Pages & Layouts

| Route | File | Type | Description |
|---|---|---|---|
| `/` | `app/page.tsx` | Server | Marketing landing: Hero, Trust, ProductTabs, Features, CTA |
| `/auth/login` | `app/auth/login/page.tsx` | Server→Client | Email/agent# + password login, Zod-validated |
| `/auth/register` | `app/auth/register/page.tsx` | Server→Client | Full name, email, password, confirm, ToS |
| `/auth/confirm` | `app/auth/confirm/page.tsx` | Server→Client | "Check your email" card with 60s resend cooldown |
| `/auth/password` | `app/auth/password/page.tsx` | Server→Client | Password reset request (email input) |
| `/auth/password/reset` | `app/auth/password/reset/page.tsx` | Server→Client | Set new password with strength rules |
| `/quote` | `app/quote/page.tsx` | Server→Client | **Main app** — three-column quote engine |
| `/dashboard` | `app/dashboard/page.tsx` | Server | Legacy prototype dashboard (superseded by `/quote`) |
| `/dashboard/profile` | `app/dashboard/profile/page.tsx` | Server | Profile settings (personal + professional info) |
| `/dashboard/payment` | `app/dashboard/payment/page.tsx` | Server | Payment checkout (order summary + card/ACH form) |
| `/dashboard/payment/success` | `app/dashboard/payment/success/page.tsx` | Server | Confirmation screen with "What's Next" stepper |
| `/dashboard/payment/cancel` | `app/dashboard/payment/cancel/page.tsx` | Server | Payment failure with countdown + retry |

**Layouts:** Root (`app/layout.tsx` — Inter + Geist Mono fonts), Auth (`app/auth/layout.tsx` — centered card shell with gradient blobs)

### Custom Components (non-shadcn)

#### Quote Components (`components/quote/`)

| File | Component | Description |
|---|---|---|
| `intake-form.tsx` | `IntakeForm` | Left sidebar form — name, age, gender, state, coverage, term, tobacco, medical, DUI |
| `medical-history-section.tsx` | `MedicalHistorySection` | Collapsible section: conditions combobox, medications, DUI toggle |
| `carrier-results.tsx` | `CarrierResults` | Two-tier carrier display: Best Matches (top 3) + All Carriers (collapsible) |
| `carrier-detail-modal.tsx` | `CarrierDetailModal` | Three-tab dialog: Overview, Underwriting, Carrier Info |
| `carrier-comparison.tsx` | `CarrierComparison` + `CompareFloatingButton` + `ComparisonSheet` | Side-by-side comparison for up to 3 carriers |
| `ai-assistant-panel.tsx` | `AiAssistantPanel` | Right panel: streaming chat + proactive insights + enrichment trigger |
| `lead-enrichment-popover.tsx` | `LeadEnrichmentPopover` | PDL lookup popover + enrichment results dialog |

#### Auth Components (`components/auth/`)

| File | Component | Description |
|---|---|---|
| `login-form.tsx` | `LoginForm` | Email/agent# + password with "remember device" |
| `register-form.tsx` | `RegisterForm` | Full name, email, password, confirm, ToS checkbox |
| `password-reset-form.tsx` | `PasswordResetForm` | Email input for password reset |
| `set-password-form.tsx` | `SetPasswordForm` | New password + confirm with strength rules |
| `check-email-card.tsx` | `CheckEmailCard` | Confirmation card with resend cooldown |

#### Landing Components (`components/landing/`)

- **Atoms:** `MaterialIcon`, `Logo`, `NavLink`, `ComplianceBadge`
- **Molecules:** `FeatureItem`, `FeatureCard`, `FooterLinkGroup`
- **Organisms:** `Header`, `HeroSection`, `TrustSection`, `ProductTabSwitcher`, `FeaturesGrid`, `CTASection`, `Footer`
- **Template:** `MarketingTemplate`

#### Dashboard/Legacy Components (`components/organisms/`, `components/templates/`)

- `DashboardTopNav`, `DashboardFooter`, `IntakeProfileSidebar`, `QuoteEngineHeader`
- `CoverageTermPanel`, `UnderwritingPanel`, `MarketComparisonTable`
- `PaymentPageShell`, `OrderSummaryCard`, `PaymentMethodForm`
- `ConfirmationDetailsCard`, `ErrorDetailsCard`
- `PersonalInfoCard`, `ProfessionalInfoCard`, `SettingsHeader`, `SettingsSidebar`
- Templates: `DashboardTemplate`, `SettingsTemplate`

#### Atoms (`components/atoms/`)

`CarrierBadge`, `DurationButton`, `IconInput`, `KeyboardShortcut`, `NumberStepper`, `PaymentMethodTab`, `ProductTab`, `SettingsNavItem`, `StatusBadge`, `StepIndicator`, `ToggleSwitch`

#### Molecules (`components/molecules/`)

`CarrierTableRow`, `CoverageSlider`, `IntakeField`, `IntakeSelect`, `PaymentFooter`, `PaymentNavBar`, `ProfilePhotoUpload`, `SpecializationGrid`, `StepperNav`, `UnderwritingItem`, `WhatsNextStepper`

#### shadcn/ui (56 installed)

`accordion`, `alert-dialog`, `alert`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button-group`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `combobox`, `command`, `context-menu`, `dialog`, `direction`, `drawer`, `dropdown-menu`, `empty`, `field`, `form`, `hover-card`, `input-group`, `input-otp`, `input`, `item`, `kbd`, `label`, `menubar`, `native-select`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `switch`, `table`, `tabs`, `textarea`, `toggle-group`, `toggle`, `tooltip`

#### Custom Hooks

| File | Hook | Description |
|---|---|---|
| `hooks/use-mobile.ts` | `useIsMobile()` | Returns `true` below 768px viewport |

---

## 2. API Routes

| Method | Route | Purpose | External Service |
|---|---|---|---|
| `POST` | `/api/quote` | Core quote engine — eligibility + pricing + scoring for all carriers | None (local engine) |
| `POST` | `/api/chat` | Streaming AI chat via Vercel AI SDK `streamText` | OpenAI `gpt-4o-mini` |
| `POST` | `/api/chat/proactive` | Non-streaming proactive insights (2-4 JSON cards) | OpenAI `gpt-4o-mini` |
| `POST` | `/api/enrichment` | Lead enrichment via PDL (80+ field extraction) | People Data Labs API |

**Environment variables:** `OPENAI_API_KEY`, `PEOPLEDATALABS_API_KEY` (both in `.env.local`)

---

## 3. PDL Enrichment Flow

### Trigger
- `LeadEnrichmentPopover` in the AI assistant panel header
- Button shows **"Enrich"** (no data) or **"View Lead"** (data exists, reopens dialog directly)

### Input
Popover accepts: **name**, **email**, **phone** (at least one required). LinkedIn URL supported in API type but not yet exposed in UI.

### API Call
```
POST /api/enrichment  →  GET https://api.peopledatalabs.com/v5/person/enrich
Headers: X-Api-Key: <PEOPLEDATALABS_API_KEY>
```

### Data Returned (`EnrichmentResult` — `lib/types/ai.ts`)
80+ fields across 10 categories:
- **Identity:** fullName, firstName, lastName, birthDate, birthYear, age, ageEstimated, sex, summary, headline, nameAliases
- **Location:** city, state, zip, country, locationName, streetAddresses[], regions[]
- **Current Employment:** jobTitle, jobCompanyName, jobCompanySize, jobCompanyIndustry, jobCompanyInferredRevenue, jobCompanyTicker, jobStartDate
- **Income:** inferredSalary, inferredYearsExperience
- **Career:** experience[] (title, company, dates, summary, isCurrent)
- **Education:** education[] (school, degree, major, dates, summary)
- **Skills/Certs/Languages:** skills[], certifications[], languages[]
- **Contact:** workEmail, mobilePhone, phones[], emails[], personalEmails[], phoneNumbers[]
- **Social:** linkedinUrl, facebookUrl, twitterUrl, githubUrl, profiles[]
- **Metadata:** numSources, numRecords, firstSeen, rawData (cleaned)

**Age fallback:** If `birth_year` is gated (PDL free tier), estimates age from education dates (assumes 18 at bachelor's start or 22 at end).

### Storage
**None.** Results held in React `useState` inside `LeadEnrichmentPopover`. No database, no persistence. Lost on page refresh.

### Display
Dialog with accordion sections: Identity, Location, Current Role, Financial Signals, Work History, Education, Skills & Certs, Social Profiles, Contact Info, Data Quality.

### Actions from Enrichment
1. **"Apply to Intake"** — auto-fills age, gender (from `sex`), state into the quote form via `EnrichmentAutoFillData`
2. **"Analyze with AI"** — serializes enrichment JSON into chat as a user message, auto-opens AI panel

---

## 4. AI Chat Panel

### Component
`components/quote/ai-assistant-panel.tsx` — right column, 340px wide, collapsible

### Wiring
Uses **Vercel AI SDK** `useChat` from `@ai-sdk/react` with `DefaultChatTransport`:
```
api: "/api/chat"
body.context: { intakeData, quoteResponse }
```
Context is re-injected on every message (transport recreated via `useMemo` when intake/quotes change).

### System Prompt (`lib/ai/system-prompt.ts`)
`buildSystemPrompt(context?)` assembles:
1. **Persona + rules:** Expert insurance AI, under 150 words, cite carrier names, specific heuristics for DUI/vaping/nicotine clients, enrichment estimation logic
2. **`CARRIER_INTELLIGENCE_SUMMARY`** (`lib/data/carrier-intelligence-summary.ts`): Full text dump of all 10 carriers' underwriting rules, tobacco policies, DUI rules, state availability
3. **Current client profile** (if `intakeData` exists): name, age, gender, state, coverage, term, tobacco
4. **Current quote results** (if `quoteResponse` exists): eligible/ineligible carriers with premiums and match scores

### Proactive Insights
- `useEffect` watches `intakeData` + `quoteResponse`, debounces 2s, fetches `POST /api/chat/proactive`
- Returns 2-4 `ProactiveInsight` cards: `{ type: "warning"|"tip"|"info", title, body }`
- Displayed as color-coded cards (amber/emerald/blue) above chat messages
- AUTO/OFF toggle to enable/disable
- Enrichment results also inject a synthetic "Lead Enrichment" insight card (no API call)

### Model
`gpt-4o-mini` for both streaming chat and proactive insights

---

## 5. Quote Engine Intake

### Form Component
`components/quote/intake-form.tsx` — left sidebar (480px)

### Fields & Zod Schema (`intakeSchema`)

| Field | Type | Validation | Default |
|---|---|---|---|
| name | string | min(1) | "Johnathan Doe" |
| age | number | int, 18-85 | 45 |
| gender | enum | "Male" / "Female" | "Male" |
| state | string | min(1), all 50 states + DC | "California" |
| coverageAmount | number | 100K-10M | 250,000 |
| termLength | enum | "10"/"15"/"20"/"25"/"30"/"35"/"40" | "20" |
| tobaccoStatus | enum | "non-smoker" / "smoker" | "non-smoker" |
| medicalConditions | string[] | optional | [] |
| medications | string | optional | "" |
| duiHistory | boolean | optional | false |
| yearsSinceLastDui | number | int, 0-50, optional | undefined |

### Medical History Section (`components/quote/medical-history-section.tsx`)
- **Conditions:** searchable combobox from `MEDICAL_CONDITIONS` (18 conditions: diabetes T1/T2, anxiety, depression, bipolar, COPD, asthma, sleep apnea, cancer, high BP, cardiac, A-Fib, epilepsy, seizures, Crohn's, alcohol treatment, hepatitis C, kidney disease)
- **Medications:** free text
- **DUI:** switch toggle + years-since input

### Auto-Submit Behavior
- Fires on initial mount
- Every field change triggers `debouncedSubmit()` (500ms debounce)
- Transforms `IntakeFormValues` → `QuoteRequest` → `POST /api/quote`

### Population Methods
1. **Manual entry** by agent
2. **Auto-fill from enrichment** — `handleAutoFill({ age, gender, state })` pushes 3 fields from PDL data

### Coverage Slider (page-level)
Separate slider in main content area with 18 steps: 100K, 150K, 200K, 250K, 300K, 400K, 500K, 750K, 1M, 1.5M, 2M, 2.5M, 3M, 4M, 5M, 6M, 7.5M, 10M. Also term duration button grid. These are display controls independent of the intake form.

### Quote Engine Pipeline
```
IntakeForm → QuoteRequest → POST /api/quote → CARRIERS.forEach:
  1. checkEligibility(carrier, age, state, coverage, term, dui)
  2. calculatePremium(carrier, age, gender, coverage, term, tobacco)
  3. calculateMatchScore(carrier, medical, tobacco, priceRank)
→ QuoteResponse { eligible: CarrierQuote[], ineligible: [] }
```

### Carrier Data (10 carriers in `lib/data/carriers.ts`)

| ID | Name | AM Best | Term Products | DUI Policy | E-Sign |
|---|---|---|---|---|---|
| `amam` | American Amicable | A- | 3 | DECLINE | No |
| `foresters` | Foresters Financial | A | 2 | Decline if <12mo or 2 in 5yr | Yes |
| `moo` | Mutual of Omaha | A+ | 2 | DECLINE (5yr lookback) | Yes |
| `jh` | John Hancock | A+ | 3 | No policy listed | Yes |
| `lga` | LGA / Banner Life | A+ | 1 (up to $2M) | No policy listed | Yes |
| `sbli` | SBLI | A | 1 | No policy listed | Yes |
| `nlg` | NLG/LSW National Life | A | 1 | No policy listed | Yes |
| `transamerica` | Transamerica | A | 2 | Flat extra $3.50-$5 by age | Yes |
| `americo` | Americo | A | 1 | DECLINE (multiple or under 25) | Yes |
| `uhl` | United Home Life | A- | 3 | DLX product accepts DUI | No |

### Pricing Engine (`lib/engine/mock-pricing.ts`)
```
monthly = (coverage / 1000) x baseRate x ageFactor x genderFactor x termFactor x tobaccoFactor
annual  = monthly x 11.5
```
- Base rates: `lga=0.11` (cheapest) to `transamerica=0.16` (most expensive)
- Age factor: `1 + (age - 25) x 0.035`
- Gender: Male=1.0, Female=0.88
- Term: 10Y=0.7 ... 40Y=1.6
- Tobacco: non-smoker=1.0, smoker=2.4

### Match Scoring (`lib/engine/match-scoring.ts`)
Base 70, adjustments: AM Best (+0-8), e-sign (+4), ROP (+2), vape bonus (+12 Foresters), price rank (+3-5), medical declined (-8 each), medical accepted (+2 each), state ineligible (-50). Clamped 0-99.

---

## 6. Lead / Contact / CRM Data Structures

### No Formal Lead/CRM Model
No `Lead`, `Contact`, `Client`, or `Prospect` type. The closest equivalents:
- `EnrichmentResult` (80+ fields, see section 3)
- `QuoteRequest` (intake profile)

### Auto-Fill Bridge
```typescript
// lib/types/ai.ts
interface EnrichmentAutoFillData {
  age?: number
  gender?: "Male" | "Female"
  state?: string
}
```

### CRM UI Placeholders (Not Wired)
- Search input: `"CRM Lookup / Client Search..."` (`quote-page-client.tsx:162`)
- Keyboard shortcut label: `ALT+S → Sync CRM` (`quote-page-client.tsx:327`)
- `SAVE QUOTE` button (`quote-page-client.tsx:176`)
- Recording timer `00:12:45` with red pulsing dot (static, no backend)

### State Management
All state is local React `useState` in `QuotePageClient`. No Zustand, Jotai, Redux, or Context.

### No Database
No Supabase, Prisma, Drizzle, Redis, or any persistence layer. All data is ephemeral per browser session.

---

## 7. Telnyx

**Zero references exist anywhere in the codebase.**

- No `telnyx`, `Telnyx`, `TELNYX` in any source, config, or docs
- No telephony dependencies in `package.json` (no Twilio, Vonage, etc.)
- No SMS, voice, or webhook handlers for any telephony service
- The recording timer in the UI (`00:12:45`) is a **static decoration** with no backend

The only "phone" references are:
- `EnrichmentResult` phone fields (PDL contact data, not calling)
- `LeadEnrichmentPopover` phone input (PDL lookup, not calling)
- `Phone` Lucide icon in UI labels

---

## Appendix: Key File Index

### Engine
- `lib/engine/eligibility.ts` — carrier eligibility checks
- `lib/engine/mock-pricing.ts` — premium calculation (base rates per carrier)
- `lib/engine/match-scoring.ts` — 0-99 match scoring algorithm

### Data
- `lib/data/carriers.ts` — 10 carrier definitions with products, rules, state exclusions
- `lib/data/medical-conditions.ts` — 18 medical conditions
- `lib/data/carrier-intelligence-summary.ts` — text dump for AI system prompt

### Types
- `lib/types/carrier.ts` — Carrier, Product, TobaccoRules, DUIRule
- `lib/types/quote.ts` — QuoteRequest, CarrierQuote, QuoteResponse
- `lib/types/ai.ts` — EnrichmentResult (80+ fields), ProactiveInsight, AutoFillData

### AI
- `lib/ai/system-prompt.ts` — buildSystemPrompt()

### Quote Page Components
- `app/quote/quote-page-client.tsx` — main page shell + all state
- `components/quote/intake-form.tsx` — left sidebar form
- `components/quote/carrier-results.tsx` — two-tier carrier display
- `components/quote/ai-assistant-panel.tsx` — right panel (chat + insights)
- `components/quote/lead-enrichment-popover.tsx` — PDL enrichment UI
- `components/quote/carrier-detail-modal.tsx` — carrier detail dialog
- `components/quote/carrier-comparison.tsx` — side-by-side comparison sheet
- `components/quote/medical-history-section.tsx` — medical conditions combobox

### External Dependencies
- `@ai-sdk/openai` + `@ai-sdk/react` + `ai` — Vercel AI SDK (OpenAI)
- `openai` — direct OpenAI Node SDK (proactive insights)
- PDL API via `fetch` (no SDK)
