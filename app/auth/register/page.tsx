import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create Account — My Insurance Quoter",
  description:
    "Create your agent account to manage quotes and clients on the platform.",
}

export default function RegisterPage() {
  return <RegisterForm />
}
