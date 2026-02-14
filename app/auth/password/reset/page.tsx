import type { Metadata } from "next"
import { SetPasswordForm } from "@/components/auth/set-password-form"

export const metadata: Metadata = {
  title: "Set New Password — My Insurance Quoter",
  description:
    "Create a new secure password for your agent account.",
}

export default function SetPasswordPage() {
  return <SetPasswordForm />
}
