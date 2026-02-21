export interface MedicalCondition {
  readonly id: string
  readonly label: string
  readonly category: string
}

export const MEDICAL_CONDITIONS: readonly MedicalCondition[] = [
  { id: "diabetesType1", label: "Diabetes Type 1", category: "Metabolic" },
  { id: "diabetesType2", label: "Diabetes Type 2", category: "Metabolic" },
  { id: "anxiety", label: "Anxiety", category: "Mental Health" },
  { id: "depression", label: "Depression", category: "Mental Health" },
  { id: "bipolar", label: "Bipolar Disorder", category: "Mental Health" },
  { id: "copd", label: "COPD", category: "Respiratory" },
  { id: "asthma", label: "Asthma", category: "Respiratory" },
  { id: "sleepApnea", label: "Sleep Apnea", category: "Respiratory" },
  { id: "cancer", label: "Cancer (history)", category: "Oncology" },
  { id: "highBloodPressure", label: "High Blood Pressure", category: "Cardiovascular" },
  { id: "cardiac", label: "Heart Disease / Cardiac", category: "Cardiovascular" },
  { id: "afib", label: "Atrial Fibrillation (A-Fib)", category: "Cardiovascular" },
  { id: "epilepsy", label: "Epilepsy", category: "Neurological" },
  { id: "seizures", label: "Seizures", category: "Neurological" },
  { id: "crohns", label: "Crohn's Disease", category: "Gastrointestinal" },
  { id: "alcoholTreatment", label: "Alcohol Treatment (history)", category: "Substance" },
  { id: "hepatitisC", label: "Hepatitis C", category: "Liver" },
  { id: "kidneyDisease", label: "Kidney Disease", category: "Renal" },
] as const
