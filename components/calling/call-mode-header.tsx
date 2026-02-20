import { Phone } from "lucide-react"
import { useCallStore } from "@/lib/store/call-store"

/* ------------------------------------------------------------------ */
/*  Call Mode Header                                                   */
/*  Shows destination number, live timer, and status indicator.        */
/* ------------------------------------------------------------------ */

const STATUS_DOT: Record<string, string> = {
  connecting: "bg-amber-400",
  ringing: "bg-blue-400",
  active: "bg-emerald-400",
  held: "bg-orange-400",
  ending: "bg-[#94a3b8]",
}

export function CallModeHeader() {
  const destinationNumber = useCallStore((s) => s.destinationNumber)
  const callState = useCallStore((s) => s.callState)
  const callDurationFormatted = useCallStore((s) => s.callDurationFormatted)

  const dotColor = STATUS_DOT[callState] ?? "bg-[#94a3b8]"

  return (
    <div className="flex items-center justify-between border-b border-[#e2e8f0] px-4 py-3">
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-emerald-500" />
        <span className="text-[13px] font-bold text-[#0f172a]">
          Live Call
        </span>
        <span className={`h-2 w-2 rounded-full ${dotColor}`} />
      </div>
      <div className="flex items-center gap-2">
        {destinationNumber && (
          <span className="text-[11px] text-[#94a3b8]">
            {destinationNumber}
          </span>
        )}
        <span className="font-mono text-[12px] font-medium text-[#0f172a]">
          {callDurationFormatted()}
        </span>
      </div>
    </div>
  )
}
