import { z } from "zod"
import { getCallCounts } from "@/lib/supabase/calls"

const querySchema = z.object({
  leadIds: z.string().min(1),
})

export async function GET(request: Request) {
  const url = new URL(request.url)
  const parsed = querySchema.safeParse({ leadIds: url.searchParams.get("leadIds") })

  if (!parsed.success) {
    return Response.json(
      { error: "leadIds query parameter is required" },
      { status: 400 },
    )
  }

  const leadIds = parsed.data.leadIds.split(",").filter(Boolean)
  if (leadIds.length === 0) {
    return Response.json({ counts: {} })
  }

  try {
    const counts = await getCallCounts(leadIds)
    return Response.json({ counts })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load call counts"
    return Response.json({ error: message }, { status: 500 })
  }
}
