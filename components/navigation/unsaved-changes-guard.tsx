"use client"

import { useEffect } from "react"

interface UnsavedChangesGuardProps {
  isDirty: boolean
}

/**
 * Prevents accidental data loss by warning the user before leaving
 * a page with unsaved changes (browser close/refresh via beforeunload).
 *
 * Note: Next.js App Router does not support route-change interception
 * (router.events was Pages Router only). The beforeunload event covers
 * browser close, refresh, and external navigation.
 */
export function UnsavedChangesGuard({ isDirty }: UnsavedChangesGuardProps) {
  useEffect(() => {
    if (!isDirty) return

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isDirty])

  return null
}
