import { Loader2 } from "lucide-react"

export default function LeadDetailLoading() {
  return (
    <div className="flex flex-1 items-center justify-center bg-[#f6f7f8]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#1773cf]" />
        <p className="text-[13px] text-[#94a3b8]">Loading lead...</p>
      </div>
    </div>
  )
}
