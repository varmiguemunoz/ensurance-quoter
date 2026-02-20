import { AlertTriangle, Info, Lightbulb } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Shared insight / coaching hint style maps                          */
/*  Used by: ai-assistant-panel.tsx, coaching-hint-card.tsx            */
/* ------------------------------------------------------------------ */

export type InsightType = "warning" | "tip" | "info"

export const INSIGHT_ICONS: Record<InsightType, React.ComponentType<{ className?: string }>> = {
  warning: AlertTriangle,
  tip: Lightbulb,
  info: Info,
}

export const INSIGHT_COLORS: Record<InsightType, { border: string; bg: string; icon: string }> = {
  warning: { border: "border-l-amber-400", bg: "bg-amber-50", icon: "text-amber-500" },
  tip: { border: "border-l-emerald-400", bg: "bg-emerald-50", icon: "text-emerald-500" },
  info: { border: "border-l-blue-400", bg: "bg-blue-50", icon: "text-blue-500" },
}
