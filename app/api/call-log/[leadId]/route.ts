import { getCallLogs } from "@/lib/supabase/calls"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ leadId: string }> },
) {
  const { leadId } = await params

  if (!leadId) {
    return Response.json({ error: "leadId is required" }, { status: 400 })
  }

  try {
    const callLogs = await getCallLogs(leadId)
    return Response.json({ callLogs })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load call logs"
    return Response.json({ error: message }, { status: 500 })
  }
}
