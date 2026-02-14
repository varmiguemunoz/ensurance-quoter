import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login — My Insurance Quoter",
  description:
    "Access your agent dashboard and client quotes securely.",
}

export default function LoginPage() {
  return <LoginForm />
}
