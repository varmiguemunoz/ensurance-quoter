import Link from "next/link"
import { Logo } from "@/components/landing/atoms/Logo"
import { MaterialIcon } from "@/components/landing/atoms/MaterialIcon"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-svh flex-col bg-[#f6f7f8]">
      {/* Navbar */}
      <header className="flex items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
        <Logo iconSize="sm" />
        <Link
          href="/support"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Need help?
          <span className="font-medium text-brand">Contact Support</span>
        </Link>
      </header>

      {/* Content area */}
      <main className="relative flex flex-1 items-center justify-center px-4 py-8">
        {/* Decorative gradient blurs */}
        <div
          className="pointer-events-none absolute left-1/4 top-1/4 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-light opacity-40 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-brand-light opacity-30 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-lg">{children}</div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col items-center gap-3 px-4 py-6 text-center">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <MaterialIcon name="lock" size="sm" />
          <span>Secure 256-bit SSL Encrypted</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1 text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} My Insurance Quoter.</span>
          <span>All rights reserved.</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/privacy"
            className="text-slate-400 transition-colors hover:text-slate-600"
          >
            Privacy Policy
          </Link>
          <span className="text-slate-300" aria-hidden="true">
            |
          </span>
          <Link
            href="/terms"
            className="text-slate-400 transition-colors hover:text-slate-600"
          >
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  )
}
