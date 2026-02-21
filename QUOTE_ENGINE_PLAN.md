# ENSURANCE QUOTER — Build Plan
# Drop this file into your Anysphere project root as QUOTE_ENGINE_PLAN.md
# Then tell Claude: "Read QUOTE_ENGINE_PLAN.md and execute tasks in order"

---

## Planning Principles (from claude-code-framework)

Follow these rules for every task:

1. **Knowledge first**: Read CLAUDE.md, GLOBAL_RULES.md, and relevant existing components before writing any code
2. **Guardrails**: Do NOT modify existing auth/ or landing/ components. Do NOT touch globals.css theme. Do NOT install new dependencies (everything needed is already installed).
3. **Success criteria**: Each task has specific verification checks. Don't move to next task until current one passes.
4. **Failure handling**: If a component doesn't render or a type doesn't compile, fix it before moving on. Log unexpected issues.
5. **Atomic tasks**: Complete one task fully before starting the next. Don't scaffold 5 files with TODO comments.

---

## Project Status (from audit)

- Next.js 16.1.6, React 19, TypeScript strict, Tailwind v4 OKLCH
- 55 shadcn/ui components installed (Dialog, Table, Tabs, Badge, Select, Slider, Sheet, Card, Accordion, Checkbox, all present)
- React Hook Form 7.71 + Zod 4.3 + @hookform/resolvers installed
- Recharts 2.15 installed
- Auth flow complete (login, register, confirm, password reset)
- Landing page complete
- Data layer: EMPTY. No API routes, no types, no data files, no database.
- Quote engine page: Does not exist yet.

---

## Data Architecture

```
lib/
├── types/
│   ├── carrier.ts         # All carrier-related types
│   └── quote.ts           # Quote request/response types
├── data/
│   ├── carriers.ts        # All carrier intelligence in one file (MVP — split later if needed)
│   ├── medical-conditions.ts
│   └── state-availability.ts
├── engine/
│   ├── mock-pricing.ts    # TEMPORARY — replaced by Compulife API
│   ├── match-scoring.ts   # OUR intelligence layer (stays forever)
│   └── eligibility.ts     # State + medical + weight eligibility
└── utils.ts               # Existing

app/
├── api/
│   └── quote/
│       └── route.ts       # POST endpoint
└── quote/
    └── page.tsx           # Quote engine page

components/
└── quote/
    ├── intake-form.tsx
    ├── carrier-results.tsx
    ├── carrier-card.tsx
    ├── carrier-detail-modal.tsx
    └── carrier-comparison.tsx
```

---

## TASK 1: Type System

**Create**: `lib/types/carrier.ts` and `lib/types/quote.ts`

**carrier.ts must define:**
```typescript
// Core carrier identity
interface Carrier {
  id: string
  name: string
  abbr: string           // 2-4 char abbreviation for logo badges
  color: string          // Brand hex color
  amBest: string         // "A++", "A+", "A", "A-", "B++"
  amBestLabel: string    // "Superior", "Excellent"
  yearsFounded: number
  products: Product[]
  tobacco: TobaccoRules
  livingBenefits: string
  dui: DUIRule | null
  operational: OperationalInfo
  medicalHighlights: Record<string, string>  // condition -> rule summary
}

interface Product {
  name: string
  type: "term" | "wholeLife" | "finalExpense" | "iul" | "accidental"
  ageRange: string
  faceAmountRange: string
  conversionAge: number | null
  isSimplifiedIssue: boolean
  hasROP: boolean
  gradedPeriod: string | null
}

interface TobaccoRules {
  cigarettes: string
  cigars: string
  vaping: string
  smokeless: string
  nrt: string            // nicotine replacement therapy
  marijuana: string
  quitLookback: string
  keyNote: string        // The critical differentiator callout
}

interface DUIRule {
  rule: string
  result: string
}

interface OperationalInfo {
  eSign: boolean
  eSignNote?: string
  declinesReported?: boolean
  phoneInterview?: string
  telesales?: boolean | string
  payments?: string
}
```

**quote.ts must define:**
```typescript
interface QuoteRequest {
  name: string
  age: number
  gender: "Male" | "Female"
  state: string           // Full state name
  coverageAmount: number  // 25000 - 5000000
  termLength: 10 | 15 | 20 | 25 | 30
  tobaccoStatus: "non-smoker" | "smoker"
  healthIndicators?: {
    bloodPressure?: string
    ldl?: number
    bmi?: number
    preExistingConditions?: string[]
  }
}

interface CarrierQuote {
  carrier: Carrier
  product: Product
  monthlyPremium: number
  annualPremium: number
  matchScore: number      // 0-99
  isEligible: boolean
  ineligibilityReason?: string
  isBestValue: boolean
  features: string[]      // 3-4 key feature bullets for the card view
}

interface QuoteResponse {
  quotes: CarrierQuote[]
  clientSummary: string   // "45yo M | CA | $1M | 20Y | Non-Tobacco"
  totalCarriersChecked: number
  eligibleCount: number
  timestamp: string
}
```

**Success criteria**: `npx tsc --noEmit` passes. Types are importable from other files.

---

## TASK 2: Carrier Intelligence Data

**Create**: `lib/data/carriers.ts`

This file contains ALL 11 carriers with their real intelligence data. Here's the complete data to encode:

### Carriers to include:

**AMAM (American Amicable)** — A- Excellent, founded 1910
- Term products: Express Term (18-75, $25K-$500K, conv 75), Term Made Simple (18-75, $50K-$500K), Home Certainty (20-75, $25K-$500K)
- WL products: Dignity Solutions Immediate (50-85, $2.5K-$50K), Dignity Solutions Graded (50-85, $2.5K-$20K, 30/70/100)
- Tobacco: All tobacco rates. 36-month lookback for Preferred. Rx check on SI products.
- Vaping: Tobacco rates
- Living benefits: Terminal + confined care
- DUI: 3 years / 2+ accidents / 3+ violations = DECLINE
- E-sign: NO for apps
- Key medical: Anxiety 1-2 mild meds OK. Diabetes Type 2 A1C≤8.5 OK. Most cardiac DECLINE.
- States not available: AK, CT, HI, MA, ME, MT, NH, NJ, NY, OR, RI, VT, WA

**Foresters Financial** — A Excellent, founded 1874
- Term: Strong Foundation (18-80, $50K-$500K, conv 65), Your Term medical (18-55+, $100K+)
- WL: Plan Right Immediate (50-85, $5K-$35K), PlanRight Graded (50-85, $5K-$20K, 30/70/100)
- Tobacco: ★ VAPING = NON-SMOKER RATES on YourTerm. 12-month cigarette-free lookback.
- KEY DIFFERENTIATOR: Only carrier giving non-smoker rates to vapers
- Living benefits: Terminal (none with Graded)
- DUI: Single <12mo = DECLINE, 2 in 5yr = DECLINE, 2+ = Call Risk Assessment
- E-sign: YES
- Available in ALL states
- Key medical: 10+ years since alcohol treatment = ACCEPT

**Mutual of Omaha (MOO)** — A+ Superior, founded 1909
- Term: Term Life Express (18-70, $25K-$300K, conv 70), Term Life ROP (18-50, $25K-$300K)
- WL: Living Promise (45-85, $20K-$50K), Living Promise Graded (45-80, $2K-$20K, 2yr)
- IUL: IULE Non-Tobacco (18-70, $25K-$300K)
- Tobacco: All tobacco rates. 12-month lookback.
- Living benefits: Terminal (none with Graded)
- DUI: 5yr lookback, DUI + reckless + 4+ violations = DECLINE
- E-sign: YES
- States not available: AK, MT

**John Hancock** — A+ Superior, founded 1862
- Term: Simple Term Vitality (20-60, $25K-$500K, conv 70), 25yr ROP (20-50), 30yr ROP (20-45)
- Tobacco: Cigarettes = tobacco. Cigars = NON-TOBACCO possible. Smokeless = NON-TOBACCO possible. NRT/ZYN pouches = NON-TOBACCO possible. Marijuana ≤2x/week = Preferred Best NT possible.
- KEY DIFFERENTIATOR: Most lenient carrier for non-cigarette nicotine users
- 12-month lookback for non-tobacco
- E-sign: YES
- Available in ALL states

**LGA / Banner Life** — A+ Superior, founded 1981
- Term: Quility Term Plus (20-65, $100K-$2M, FUW)
- Tobacco: All tobacco rates. 12-month lookback. 4 risk classes.
- E-sign: YES
- States not available: AK, MT, HI

**SBLI** — A Excellent, founded 1907
- Term: Quility Level Term (18-65, $100K-$1M, conv 70)
- Tobacco: All tobacco rates. 6 rate classes (Elite to Standard).
- E-sign: YES
- Available in ALL states

**NLG/LSW (National Life)** — A Excellent, founded 1848
- Term: LSW Term (0-65, $100K-$250K, conv 70)
- IUL: Flex Life II IUL (0-85, $100K+)
- Tobacco: All tobacco rates. 6 rate classes with BMI ranges.
- E-sign: YES
- States not available: AK, MT

**Transamerica** — A Excellent, founded 1904
- Term: Super/Out (18-75, $25K-$100K, conv 70), Living Benefits Term (18-60, $25K-$249K)
- WL: Immediate Solutions (0-85, $1K-$50K), Easy Solution Graded (18-80, $1K-$25K, 2yr)
- Living benefits: 0-44 accelerated death benefit, 45-85 terminal
- DUI: Complex age-based flat extra schedule ($3.50-$5 by age bracket)
- Tobacco: All tobacco rates.
- States not available: CA
- E-sign: YES

**Americo** — A Excellent, founded 1981
- Term: HMS Series (20-75, $25K-$450K)
- WL: Eagle Premier (40-85, $5K-$40K), Eagle Guaranteed GIWL (50-85, $5K-$10K, 3yr)
- IUL: IDIUL (18-75, $50K-$450K)
- Tobacco: All tobacco rates. 12-month lookback.
- Living benefits: Terminal (none with Eagle Guaranteed)
- DUI: Multiple DUI or last under 25 = DECLINE
- E-sign: DocuSign only
- States not available: AK, CT, HI, MA, ME, NH, NJ, NY, VT

**United Home Life (UHL)** — A- Excellent, founded 1948
- Term: Term 20 (20-55, $25K-$300K), Term 30 (20-60, $25K-$200K), DLX (20-60, $25K-$50K)
- WL: Provider (0-80, $10K-$150K), GIWL (45-75, $5K-$25K, 3yr)
- Living benefits: Terminal (none with EIWL/GIWL)
- DUI: Term = 5yr lookback DECLINE. DLX product = ACCEPTS DUI.
- E-sign: NO
- States not available: AK, CA, CT, HI, MA, ME, MT, NH, NJ, NY, OR, RI, VT, WA

**F&G (Fidelity & Guaranty)** — A- Excellent, founded 1959
- IUL: Pathsetter IUL (0-80, $50K-$500K)
- Tobacco: All tobacco rates. Separate male/female Preferred & Standard charts.
- E-sign: YES
- States not available: AK, CT, HI, MA, MT, NH, NJ, NY, VT

**Success criteria**: All carriers importable. TypeScript compiles. Each carrier object satisfies the Carrier interface.

---

## TASK 3: Mock Pricing Engine

**Create**: `lib/engine/mock-pricing.ts`

Formula per carrier:
```
monthlyPremium = (coverageAmount / 1000) × baseRate × ageFactor × genderFactor × termFactor × tobaccoFactor
```

Base rates (per $1,000 of coverage — gives realistic carrier differentiation):
- LGA: 0.11 (lowest — fully underwritten, higher face amounts)
- SBLI: 0.115
- MOO: 0.12
- NLG: 0.125
- Foresters: 0.13
- F&G: 0.13
- AMAM: 0.14
- Americo: 0.145
- JH: 0.15 (Vitality program premium)
- UHL: 0.155
- TransAm: 0.16

Factors:
- ageFactor = 1 + ((age - 25) × 0.035)
- genderFactor = Male: 1.0, Female: 0.88
- termFactor = {10: 0.7, 15: 0.85, 20: 1.0, 25: 1.15, 30: 1.3}
- tobaccoFactor = smoker: 2.4, non-smoker: 1.0

annualPremium = monthlyPremium × 11.5 (annual discount)

**Success criteria**: Given age=45, male, $1M, 20Y, non-tobacco — prices should range roughly $35-$55/month across carriers, matching the design mockup ballpark.

---

## TASK 4: Match Scoring + Eligibility Engine

**Create**: `lib/engine/match-scoring.ts` and `lib/engine/eligibility.ts`

**Eligibility checks** (returns isEligible + reason):
1. State availability — is carrier available in client's state?
2. Age range — does client age fall within product's age range?
3. Face amount — does requested coverage fall within product's range?
4. Term availability — does carrier offer the requested term length?

**Match scoring** (0-99 scale):
- Start at 70
- AM Best A+ or A++: +8 points
- AM Best A: +5 points
- AM Best A-: +3 points
- E-sign available: +4 points
- ROP available: +2 points
- If client is non-tobacco and carrier has favorable lookback: +3 points
- If client vapes and carrier is Foresters: +12 points (KEY differentiator)
- If carrier not available in state: -50 points (effectively eliminates)
- Price rank bonus: cheapest gets +5, second cheapest +3

**Success criteria**: Foresters should rank #1 for vapers. LGA should have highest match for healthy, high-coverage, non-tobacco clients. State-excluded carriers should show as ineligible.

---

## TASK 5: Quote API Route

**Create**: `app/api/quote/route.ts`

POST endpoint:
1. Parse and validate request body with Zod (using the QuoteRequest schema)
2. Load carriers from lib/data/carriers.ts
3. Run eligibility engine against each carrier
4. Run mock pricing for eligible carriers
5. Calculate match scores
6. Sort by match score (default) or price
7. Mark best value (lowest price among eligible)
8. Return QuoteResponse

**Success criteria**: `curl -X POST http://localhost:3000/api/quote -H "Content-Type: application/json" -d '{"name":"John Doe","age":45,"gender":"Male","state":"California","coverageAmount":1000000,"termLength":20,"tobaccoStatus":"non-smoker"}'` returns valid JSON with multiple carrier quotes sorted by match score.

---

## TASK 6: Intake Sidebar Component

**Create**: `components/quote/intake-form.tsx`

Match the Figma design (left sidebar):
- Full Name text input
- Age with +/- stepper buttons
- Gender select (Male/Female)
- State/Territory select dropdown (all 50 states + DC)
- Coverage Amount with slider ($100K to $5M) + displayed value
- Term Duration toggle buttons (10Y / 15Y / 20Y / 30Y)
- Tobacco Usage toggle (NON-SMOKER / SMOKER)
- Health Indicators section with tag-style chips (BP, LDL, BMI, Pre-Ex)
- Agent info at bottom

Use React Hook Form + Zod for validation. On form change, auto-submit to the quote API (debounced 500ms) or use a "Get Quotes" button.

Match the existing design system — use the shadcn/ui components that are already installed (Input, Select, Slider, Button, Badge, Label).

**Success criteria**: Form renders, validates, and submits to API. Changing any field triggers a new quote request.

---

## TASK 7: Market Comparison Table

**Create**: `components/quote/carrier-results.tsx`

Match the Figma design (Market Comparison section):
- Header row: CARRIER | PRODUCT NAME | RATING | MONTHLY | ANNUAL | ACTIONS
- Each row shows: carrier logo badge (colored square with abbr) + name, product name, AM Best rating badge, monthly premium (large bold), annual premium (smaller gray), APPLY NOW button
- Best Value row highlighted with green accent + "BEST VALUE" badge
- Sort/filter bar above table with: Sort dropdown + Filter button
- "REFRESH RATES" button in header

Use shadcn/ui Table component. Carrier logo badges are colored div squares with white text abbreviation.

**Success criteria**: Table renders with real carrier data and mock prices. Sorting works. Best value is highlighted. Ineligible carriers are either hidden or shown as grayed out with reason.

---

## TASK 8: Carrier Detail Modal

**Create**: `components/quote/carrier-detail-modal.tsx`

Click carrier row or "View Details" → opens Dialog with tabbed content:

**Tab 1 — Pricing & Features**
- Monthly/annual premium breakdown
- "Why this price?" section (age factor, coverage, health class, term length)
- Key features list: convertible until age X, living benefits, ROP available/not
- Application features: e-sign yes/no, accelerated UW, no-exam thresholds

**Tab 2 — Underwriting Intelligence**
- Tobacco/nicotine rules (all 8 categories with carrier's classification)
- Key differentiator callout box (highlighted if carrier has special rules)
- DUI/driving rules
- Medical condition highlights (top conditions with accept/decline)
- Build chart summary (BMI/weight limits)

**Tab 3 — Company Info**
- AM Best rating with explanation
- Years in business (since founded year)
- Operational details: e-sign, telesales, phone interview, payment methods
- State availability note

Use shadcn/ui Dialog + Tabs + Badge + Separator components.

**Success criteria**: Modal opens with correct carrier data. All three tabs render. Tobacco differentiator callouts are visually prominent. Close button returns to table.

---

## TASK 9: Side-by-Side Comparison

**Create**: `components/quote/carrier-comparison.tsx`

- Checkbox on each carrier row in the table
- When 2-3 carriers selected, floating "Compare Selected (N)" button appears
- Click opens Sheet or Dialog with comparison table:
  - Columns: one per selected carrier
  - Rows: Monthly Premium, Annual Premium, AM Best Rating, Term Options, Conversion Age, E-Sign, Living Benefits, Tobacco Rules, DUI Policy, State Availability
  - "Apply Now" button at bottom of each column

Use shadcn/ui Sheet (slides in from right) + Table + Checkbox components.

**Success criteria**: Can select 2-3 carriers. Comparison view shows accurate data side-by-side. Can close and re-select.

---

## TASK 10: Quote Page Assembly

**Create**: `app/quote/page.tsx`

Wire everything together:
- Layout: sidebar (intake form) + main area (results)
- State management: useState for QuoteResponse, loading state, selected carriers for comparison
- On mount or form change: fetch from /api/quote
- Pass results to carrier-results table
- Handle modal opens for detail view
- Handle comparison selection and display
- Top bar with product type tabs (only Term Life active for MVP, others show "Coming Soon")
- Session timer display (from design)
- "SAVE QUOTE" button in top-right

**Success criteria**: Full page renders. Changing intake fields updates results. Can view carrier details. Can compare carriers. Matches the Figma design layout.

---

## Execution Notes

- Execute tasks 1-5 (data layer) before tasks 6-10 (UI layer)
- Tasks 1-2 are foundational — everything depends on them
- Task 3 is intentionally simple — it WILL be replaced by Compulife
- UI tasks can reference existing auth form patterns for React Hook Form + Zod setup
- Follow GLOBAL_RULES.md for component patterns and design tokens
- Use the project's existing OKLCH color system — don't introduce new colors outside the theme
