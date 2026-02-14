"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MaterialIcon } from "@/components/landing/atoms/MaterialIcon"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

const RESEND_COOLDOWN_SECONDS = 60

export function CheckEmailCard() {
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  async function handleResend() {
    if (cooldown > 0) return
    setResending(true)
    try {
      // TODO: Implement resend email logic
      setCooldown(RESEND_COOLDOWN_SECONDS)
    } catch {
      // TODO: Show error toast/message to user
    } finally {
      setResending(false)
    }
  }

  return (
    <Card className="shadow-lg">
      {/* Header with large email icon */}
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex size-20 items-center justify-center rounded-full bg-brand-light">
          <MaterialIcon
            name="mark_email_read"
            size="xl"
            className="text-brand"
          />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">
          Check Your Email
        </h1>
        <p className="text-base text-slate-600">
          We have sent a secure link to your registered email address. Please
          follow the instructions to reset your password.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Return to Login */}
        <Button
          asChild
          className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
          size="lg"
        >
          <Link href="/auth/login">Return to Login</Link>
        </Button>

        {/* Resend CTA */}
        <p className="text-center text-sm text-slate-600">
          Did not receive the email?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="font-medium text-brand transition-colors hover:text-brand/80 disabled:opacity-50"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
          </button>
        </p>
      </CardContent>
    </Card>
  )
}
