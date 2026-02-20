"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { ArrowDown, Copy, MessageSquare, Mic } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCallStore } from "@/lib/store/call-store"
import { TranscriptEntryBubble } from "./transcript-entry"
import { CoachingHintCard } from "./coaching-hint-card"
import type { TranscriptEntry, CoachingHint } from "@/lib/types/call"
import { toast } from "sonner"

/* ------------------------------------------------------------------ */
/*  Transcript View                                                    */
/*  Scrolling timeline of transcript bubbles + coaching hint cards.    */
/*  Auto-scroll on by default, pauses when user scrolls up.           */
/* ------------------------------------------------------------------ */

type TimelineItem =
  | { type: "transcript"; timestamp: number; data: TranscriptEntry }
  | { type: "hint"; timestamp: number; data: CoachingHint }

const AUTO_SCROLL_THRESHOLD = 40

interface TranscriptViewProps {
  isPostCall: boolean
  onReturnToChat: () => void
}

export function TranscriptView({ isPostCall, onReturnToChat }: TranscriptViewProps) {
  const transcript = useCallStore((s) => s.transcript)
  const coachingHints = useCallStore((s) => s.coachingHints)
  const callState = useCallStore((s) => s.callState)

  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const [hasNewBelow, setHasNewBelow] = useState(false)
  const prevCountRef = useRef(0)

  // Merge transcript + hints into one sorted timeline
  const items = useMemo<TimelineItem[]>(() => {
    const merged: TimelineItem[] = [
      ...transcript.map((e) => ({
        type: "transcript" as const,
        timestamp: e.timestamp,
        data: e,
      })),
      ...coachingHints.map((h) => ({
        type: "hint" as const,
        timestamp: h.timestamp,
        data: h,
      })),
    ]
    return merged.sort((a, b) => a.timestamp - b.timestamp)
  }, [transcript, coachingHints])

  // Auto-scroll when new items arrive
  useEffect(() => {
    const newCount = items.length
    if (newCount > prevCountRef.current) {
      if (autoScroll) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
      } else {
        setHasNewBelow(true)
      }
    }
    prevCountRef.current = newCount
  }, [items.length, autoScroll])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < AUTO_SCROLL_THRESHOLD
    setAutoScroll(atBottom)
    if (atBottom) {
      setHasNewBelow(false)
    }
  }, [])

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    setAutoScroll(true)
    setHasNewBelow(false)
  }, [])

  const handleCopyTranscript = useCallback(() => {
    const text = transcript
      .filter((e) => e.isFinal)
      .map((e) => `[${e.speaker === "agent" ? "Agent" : "Client"}] ${e.text}`)
      .join("\n")
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Transcript copied")
    }).catch(() => {
      toast.error("Failed to copy transcript")
    })
  }, [transcript])

  const isCallActive = callState === "active" || callState === "held" ||
    callState === "ringing" || callState === "connecting"

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScrollArea className="min-h-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="px-3 py-3"
        >
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1f5f9]">
                <Mic className="h-5 w-5 text-[#94a3b8]" />
              </div>
              <p className="mt-4 text-[13px] font-medium text-[#475569]">
                {isCallActive
                  ? "Waiting for speech..."
                  : "No transcript available"}
              </p>
              {isCallActive && (
                <p className="mt-1.5 text-[11px] leading-relaxed text-[#94a3b8]">
                  Speech will appear here as the conversation progresses.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) =>
                item.type === "transcript" ? (
                  <TranscriptEntryBubble key={item.data.id} entry={item.data} />
                ) : (
                  <CoachingHintCard key={item.data.id} hint={item.data} />
                ),
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* "New messages" floating button */}
      {hasNewBelow && (
        <div className="flex justify-center border-t border-[#e2e8f0] py-1">
          <button
            type="button"
            onClick={scrollToBottom}
            className="flex items-center gap-1 rounded-full bg-[#1773cf] px-3 py-1 text-[10px] font-medium text-white shadow-sm transition-colors hover:bg-[#1565b8]"
          >
            <ArrowDown className="h-3 w-3" />
            New messages
          </button>
        </div>
      )}

      {/* Post-call footer */}
      {isPostCall && (
        <div className="flex items-center gap-2 border-t border-[#e2e8f0] px-4 py-3">
          <button
            type="button"
            onClick={onReturnToChat}
            className="flex items-center gap-1.5 rounded-sm bg-[#f1f5f9] px-3 py-1.5 text-[11px] font-medium text-[#475569] transition-colors hover:bg-[#e2e8f0]"
          >
            <MessageSquare className="h-3 w-3" />
            Return to Chat
          </button>
          {transcript.length > 0 && (
            <button
              type="button"
              onClick={handleCopyTranscript}
              className="flex items-center gap-1.5 rounded-sm bg-[#f1f5f9] px-3 py-1.5 text-[11px] font-medium text-[#475569] transition-colors hover:bg-[#e2e8f0]"
            >
              <Copy className="h-3 w-3" />
              Copy Transcript
            </button>
          )}
        </div>
      )}
    </div>
  )
}
