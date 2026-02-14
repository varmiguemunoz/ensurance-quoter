import type { Metadata } from "next"
import { PasswordResetForm } from "@/components/auth/password-reset-form"

export const metadata: Metadata = {
  title: "Reset Password — My Insurance Quoter",
  description:
    "Request a password reset link to regain access to your agent account.",
}

export default function PasswordPage() {
  return <PasswordResetForm />
}
