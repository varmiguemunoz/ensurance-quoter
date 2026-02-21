import type { CoachingHint } from "@/lib/types/call"
import { INSIGHT_ICONS, INSIGHT_COLORS } from "@/lib/constants/insight-styles"

/* ------------------------------------------------------------------ */
/*  Inline Coaching Hint Card                                          */
/*  Rendered between transcript entries in the timeline.               */
/* ------------------------------------------------------------------ */

interface CoachingHintCardProps {
  hint: CoachingHint
}

export function CoachingHintCard({ hint }: CoachingHintCardProps) {
  const Icon = INSIGHT_ICONS[hint.type]
  const colors = INSIGHT_COLORS[hint.type]

  return (
    <div
      className={`rounded-sm border-l-2 ${colors.border} ${colors.bg} px-2.5 py-2`}
    >
      <div className="flex items-start gap-1.5">
        <Icon className={`mt-0.5 h-3 w-3 shrink-0 ${colors.icon}`} />
        <p className="text-[11px] leading-relaxed text-[#475569]">
          {hint.text}
        </p>
      </div>
      {hint.relatedCarriers.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1 pl-[18px]">
          {hint.relatedCarriers.map((carrier) => (
            <span
              key={carrier}
              className="rounded-sm bg-white/60 px-1 py-0.5 text-[9px] font-medium text-[#475569]"
            >
              {carrier}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
