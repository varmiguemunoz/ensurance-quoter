import type { TranscriptEntry } from "@/lib/types/call"

/* ------------------------------------------------------------------ */
/*  Transcript Bubble                                                  */
/*  Agent: left-aligned, blue tint. Client: right-aligned, gray.      */
/*  Interim (non-final) entries: italic, reduced opacity.              */
/* ------------------------------------------------------------------ */

interface TranscriptEntryBubbleProps {
  entry: TranscriptEntry
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function TranscriptEntryBubble({ entry }: TranscriptEntryBubbleProps) {
  const isAgent = entry.speaker === "agent"

  return (
    <div className={`flex ${isAgent ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 ${
          isAgent
            ? "bg-blue-50 text-[#0f172a]"
            : "bg-[#f1f5f9] text-[#0f172a]"
        } ${!entry.isFinal ? "opacity-60" : ""}`}
      >
        <div className="mb-0.5 flex items-center gap-1.5">
          <span
            className={`text-[9px] font-bold uppercase tracking-wider ${
              isAgent ? "text-[#1773cf]" : "text-[#94a3b8]"
            }`}
          >
            {isAgent ? "Agent" : "Client"}
          </span>
          <span className="text-[9px] text-[#94a3b8]">
            {formatTimestamp(entry.timestamp)}
          </span>
        </div>
        <p
          className={`whitespace-pre-wrap text-[12px] leading-relaxed ${
            !entry.isFinal ? "italic" : ""
          }`}
        >
          {entry.text}
        </p>
      </div>
    </div>
  )
}
