import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database"

/**
 * Server-side Supabase client using the service role key.
 * Bypasses RLS — use only in server components, API routes, and server actions.
 * Auth-scoped RLS policies will take over in Phase 5.
 */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  }

  return createSupabaseClient<Database>(url, key)
}
