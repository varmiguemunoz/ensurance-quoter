"use client"

import { MessageSquare, PanelRightClose, Send, Sparkles } from "lucide-react"

interface AiAssistantPanelProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function AiAssistantPanel({
  isCollapsed,
  onToggle,
}: AiAssistantPanelProps) {
  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="flex w-10 shrink-0 flex-col items-center gap-2 border-l border-[#e2e8f0] bg-white py-4 text-[#64748b] transition-colors hover:bg-[#f9fafb] hover:text-[#1773cf]"
      >
        <MessageSquare className="h-4 w-4" />
        <span className="text-[9px] font-bold uppercase tracking-[0.5px] [writing-mode:vertical-lr]">
          AI Assistant
        </span>
      </button>
    )
  }

  return (
    <aside className="flex w-[340px] shrink-0 flex-col border-l border-[#e2e8f0] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e2e8f0] px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#1773cf]" />
          <span className="text-[13px] font-bold text-[#0f172a]">
            AI Assistant
          </span>
          <span className="rounded-sm bg-[#dbeafe] px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#1773cf]">
            Beta
          </span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="text-[#94a3b8] transition-colors hover:text-[#64748b]"
        >
          <PanelRightClose className="h-4 w-4" />
        </button>
      </div>

      {/* Message Area */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1f5f9]">
          <MessageSquare className="h-5 w-5 text-[#94a3b8]" />
        </div>
        <p className="mt-4 text-[13px] font-medium text-[#475569]">
          AI-powered insights
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-[#94a3b8]">
          Ask about carrier comparisons, underwriting rules, or client
          eligibility. Powered by real-time quote data.
        </p>
      </div>

      {/* Input Bar */}
      <div className="border-t border-[#e2e8f0] px-4 py-3">
        <div className="flex items-center gap-2 rounded-sm border border-[#e2e8f0] bg-[#f9fafb] px-3 py-2">
          <input
            type="text"
            disabled
            placeholder="Coming soon..."
            className="flex-1 border-none bg-transparent text-[12px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="button"
            disabled
            className="text-[#94a3b8] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
