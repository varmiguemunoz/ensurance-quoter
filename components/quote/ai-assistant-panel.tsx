"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import {
  AlertTriangle,
  Info,
  Lightbulb,
  Loader2,
  MessageSquare,
  PanelRightClose,
  Send,
  Sparkles,
  X,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LeadEnrichmentPopover } from "@/components/quote/lead-enrichment-popover"
import type {
  QuoteRequest,
  QuoteResponse,
  ProactiveInsight,
  EnrichmentResult,
  EnrichmentAutoFillData,
} from "@/lib/types"

interface AiAssistantPanelProps {
  isCollapsed: boolean
  onToggle: () => void
  intakeData: QuoteRequest | null
  quoteResponse: QuoteResponse | null
  onAutoFill?: (data: EnrichmentAutoFillData) => void
}

const INSIGHT_ICONS: Record<ProactiveInsight["type"], React.ComponentType<{ className?: string }>> = {
  warning: AlertTriangle,
  tip: Lightbulb,
  info: Info,
}

const INSIGHT_COLORS: Record<ProactiveInsight["type"], { border: string; bg: string; icon: string }> = {
  warning: { border: "border-l-amber-400", bg: "bg-amber-50", icon: "text-amber-500" },
  tip: { border: "border-l-emerald-400", bg: "bg-emerald-50", icon: "text-emerald-500" },
  info: { border: "border-l-blue-400", bg: "bg-blue-50", icon: "text-blue-500" },
}

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("")
}

export function AiAssistantPanel({
  isCollapsed,
  onToggle,
  intakeData,
  quoteResponse,
  onAutoFill,
}: AiAssistantPanelProps) {
  const [insights, setInsights] = useState<ProactiveInsight[]>([])
  const [insightsLoading, setInsightsLoading] = useState(false)
  const [insightsEnabled, setInsightsEnabled] = useState(true)
  const [dismissedInsightIds, setDismissedInsightIds] = useState<Set<string>>(new Set())
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: {
          context: {
            intakeData: intakeData ?? undefined,
            quoteResponse: quoteResponse ?? undefined,
          },
        },
      }),
    [intakeData, quoteResponse],
  )

  const { messages, sendMessage, status } = useChat({ transport })

  const isBusy = status === "submitted" || status === "streaming"

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Proactive insights — debounced fetch when intake data changes
  useEffect(() => {
    if (!insightsEnabled || !intakeData) return

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      setInsightsLoading(true)
      try {
        const response = await fetch("/api/chat/proactive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            intakeData,
            quoteResponse: quoteResponse ?? undefined,
          }),
        })

        if (!response.ok) return

        const data = await response.json() as { insights: ProactiveInsight[] }
        setInsights(data.insights ?? [])
        setDismissedInsightIds(new Set())
      } catch {
        // Silently fail — insights are non-critical
      } finally {
        setInsightsLoading(false)
      }
    }, 2000)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [intakeData, quoteResponse, insightsEnabled])

  const handleDismissInsight = useCallback((id: string) => {
    setDismissedInsightIds((prev) => new Set([...prev, id]))
  }, [])

  const handleSendToChat = useCallback((text: string) => {
    if (isCollapsed) onToggle()
    sendMessage({ text })
  }, [sendMessage, isCollapsed, onToggle])

  const handleEnrichmentResult = useCallback((result: EnrichmentResult) => {
    const parts: string[] = []
    if (result.fullName) parts.push(`Name: ${result.fullName}`)
    if (result.age) parts.push(`Age: ${result.age}`)
    if (result.locationName) parts.push(`Location: ${result.locationName}`)
    if (result.jobCompanyName) parts.push(`Company: ${result.jobCompanyName}`)
    if (result.industry) parts.push(`Industry: ${result.industry}`)
    if (result.jobTitle) parts.push(`Title: ${result.jobTitle}`)
    if (result.inferredSalary) parts.push(`Est. Salary: ${result.inferredSalary}`)
    if (result.workEmail) parts.push(`Work Email: ${result.workEmail}`)

    if (parts.length > 0) {
      setInsights((prev) => [
        {
          id: `enrichment-${Date.now()}`,
          type: "info" as const,
          title: "Lead Enrichment",
          body: parts.join(" | "),
        },
        ...prev,
      ])
    }
  }, [])

  const handleSend = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const text = inputValue.trim()
      if (!text || isBusy) return
      setInputValue("")
      sendMessage({ text })
    },
    [inputValue, isBusy, sendMessage],
  )

  const visibleInsights = insights.filter((i) => !dismissedInsightIds.has(i.id))

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
    <aside className="flex w-[340px] shrink-0 flex-col overflow-hidden border-l border-[#e2e8f0] bg-white">
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
        <div className="flex items-center gap-1">
          <LeadEnrichmentPopover
            onEnrichmentResult={handleEnrichmentResult}
            onAutoFill={onAutoFill}
            onSendToChat={handleSendToChat}
          />
          <button
            type="button"
            onClick={() => setInsightsEnabled((prev) => !prev)}
            className={`rounded-sm px-1.5 py-0.5 text-[9px] font-bold transition-colors ${
              insightsEnabled
                ? "bg-[#dcfce7] text-[#16a34a]"
                : "bg-[#f1f5f9] text-[#94a3b8]"
            }`}
            title={insightsEnabled ? "Disable auto-insights" : "Enable auto-insights"}
          >
            {insightsEnabled ? "AUTO" : "OFF"}
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="ml-1 text-[#94a3b8] transition-colors hover:text-[#64748b]"
          >
            <PanelRightClose className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Proactive Insights */}
      {(visibleInsights.length > 0 || insightsLoading) && (
        <div className="border-b border-[#e2e8f0] px-3 py-2">
          {insightsLoading && (
            <div className="flex items-center gap-2 py-1">
              <Loader2 className="h-3 w-3 animate-spin text-[#1773cf]" />
              <span className="text-[10px] text-[#94a3b8]">
                Generating insights...
              </span>
            </div>
          )}
          <div className="space-y-1.5">
            {visibleInsights.map((insight) => {
              const Icon = INSIGHT_ICONS[insight.type]
              const colors = INSIGHT_COLORS[insight.type]
              return (
                <div
                  key={insight.id}
                  className={`relative rounded-sm border-l-2 ${colors.border} ${colors.bg} px-2.5 py-2`}
                >
                  <button
                    type="button"
                    onClick={() => handleDismissInsight(insight.id)}
                    className="absolute right-1.5 top-1.5 text-[#94a3b8] hover:text-[#475569]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="flex items-start gap-1.5 pr-4">
                    <Icon className={`mt-0.5 h-3 w-3 shrink-0 ${colors.icon}`} />
                    <div>
                      <p className="text-[11px] font-bold text-[#0f172a]">
                        {insight.title}
                      </p>
                      <p className="mt-0.5 text-[10px] leading-relaxed text-[#475569]">
                        {insight.body}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <ScrollArea className="min-h-0 flex-1">
        <div className="px-3 py-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
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
          ) : (
            <div className="space-y-3">
              {messages.map((message) => {
                const text = getMessageText(message)
                if (!text) return null
                return (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 ${
                        message.role === "user"
                          ? "bg-[#1773cf] text-white"
                          : "bg-[#f1f5f9] text-[#0f172a]"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="mb-1 flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-[#1773cf]" />
                          <span className="text-[9px] font-bold text-[#1773cf]">AI</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap text-[12px] leading-relaxed">
                        {text}
                      </p>
                    </div>
                  </div>
                )
              })}
              {status === "submitted" && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-[#f1f5f9] px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#1773cf]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Bar */}
      <div className="border-t border-[#e2e8f0] px-4 py-3">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 rounded-sm border border-[#e2e8f0] bg-[#f9fafb] px-3 py-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about carriers, rules, eligibility..."
            className="flex-1 border-none bg-transparent text-[12px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none"
            disabled={isBusy}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isBusy}
            className="text-[#1773cf] transition-colors hover:text-[#1565b8] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </aside>
  )
}
