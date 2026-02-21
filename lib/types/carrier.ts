export type ProductType =
  | "term"
  | "wholeLife"
  | "finalExpense"
  | "iul"
  | "accidental"

export type AmBestRating = "A++" | "A+" | "A" | "A-" | "B++"

export interface Product {
  name: string
  type: ProductType
  ageRange: string
  faceAmountRange: string
  conversionAge: number | null
  isSimplifiedIssue: boolean
  hasROP: boolean
  gradedPeriod: string | null
}

export interface TobaccoRules {
  cigarettes: string
  cigars: string
  vaping: string
  smokeless: string
  nrt: string
  marijuana: string
  quitLookback: string
  keyNote: string
}

export interface DUIRule {
  rule: string
  result: string
}

export interface OperationalInfo {
  eSign: boolean
  eSignNote?: string
  declinesReported?: boolean
  phoneInterview?: string
  telesales?: boolean | string
  payments?: string
}

export interface Carrier {
  id: string
  name: string
  abbr: string
  color: string
  amBest: AmBestRating
  amBestLabel: string
  yearFounded: number
  products: Product[]
  tobacco: TobaccoRules
  livingBenefits: string
  dui: DUIRule | null
  operational: OperationalInfo
  medicalHighlights: Record<string, string>
  statesNotAvailable: string[]
}
