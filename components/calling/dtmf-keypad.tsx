"use client"

import { useCallback } from "react"
import { sendDTMF } from "@/lib/telnyx/active-call"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Grid3x3 } from "lucide-react"

const KEYS = [
  { digit: "1", sub: "" },
  { digit: "2", sub: "ABC" },
  { digit: "3", sub: "DEF" },
  { digit: "4", sub: "GHI" },
  { digit: "5", sub: "JKL" },
  { digit: "6", sub: "MNO" },
  { digit: "7", sub: "PQRS" },
  { digit: "8", sub: "TUV" },
  { digit: "9", sub: "WXYZ" },
  { digit: "*", sub: "" },
  { digit: "0", sub: "" },
  { digit: "#", sub: "" },
] as const

interface DTMFKeypadProps {
  disabled?: boolean
}

export function DTMFKeypad({ disabled }: DTMFKeypadProps) {
  const handlePress = useCallback((digit: string) => {
    sendDTMF(digit)
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="flex h-8 w-8 items-center justify-center rounded-sm text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#0f172a] disabled:opacity-40"
          title="Keypad"
        >
          <Grid3x3 className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-3" align="center">
        <div className="grid grid-cols-3 gap-1.5">
          {KEYS.map(({ digit, sub }) => (
            <button
              key={digit}
              type="button"
              onClick={() => handlePress(digit)}
              className="flex h-12 flex-col items-center justify-center rounded-md transition-colors hover:bg-[#f1f5f9] active:bg-[#e2e8f0]"
            >
              <span className="text-[16px] font-bold text-[#0f172a]">
                {digit}
              </span>
              {sub && (
                <span className="text-[8px] tracking-widest text-[#94a3b8]">
                  {sub}
                </span>
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
