import type { Metadata } from "next"
import { CheckEmailCard } from "@/components/auth/check-email-card"

export const metadata: Metadata = {
  title: "Check Your Email — My Insurance Quoter",
  description:
    "A password reset link has been sent to your email address.",
}

export default function ConfirmPage() {
  return <CheckEmailCard />
}
