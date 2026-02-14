import { MaterialIcon } from "@/components/landing/atoms/MaterialIcon";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative border-b border-slate-200 pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24 px-4 sm:px-6 lg:px-10 overflow-hidden">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex-1 flex flex-col gap-6 items-start">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-light border border-brand-muted">
              <MaterialIcon name="bolt" size="sm" className="text-brand" />
              <span className="text-xs font-bold text-brand tracking-wide">
                BUILT FOR AGENTS
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Stop <span className="text-brand">Tab-Switching</span>. One
              Command Center.
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              The high-velocity quoting portal for agents who demand peak
              efficiency. Quote Term, Final Expense, IUL, and Annuities
              side-by-side during live consultations.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-brand text-white font-bold text-lg rounded-lg px-8 py-5 shadow-[0px_20px_25px_-5px_rgba(23,115,207,0.3),0px_8px_10px_-6px_rgba(23,115,207,0.3)] hover:bg-brand/90 gap-2"
                >
                  Request Access
                  <MaterialIcon
                    name="arrow_forward"
                    size="md"
                    className="text-white"
                  />
                </Button>
              </Link>

              <Link href="/auth/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="font-bold text-lg rounded-lg px-8 py-5 border-slate-200 text-slate-900 gap-2"
                >
                  <MaterialIcon
                    name="play_circle"
                    size="md"
                    className="text-slate-900"
                  />
                  Interactive Demo
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-6">
              <div className="flex -space-x-3">
                <div className="size-10 rounded-xl bg-slate-300 border-2 border-slate-900" />
                <div className="size-10 rounded-xl bg-slate-400 border-2 border-slate-900" />
                <div className="size-10 rounded-xl bg-slate-500 border-2 border-slate-900" />
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Trusted by{" "}
                <span className="font-bold text-slate-900">5,000+ Agents</span>{" "}
                across 50 states
              </p>
            </div>
          </div>

          {/* Right - Dashboard Mockup */}
          <div className="flex-1 relative w-full max-w-xl lg:max-w-none">
            <div className="bg-slate-200 border border-slate-300 rounded-lg p-2.5 shadow-2xl">
              <div className="relative w-full aspect-[526/450]">
                {/* Top-left card: Input form mockup */}
                <div className="absolute top-0 left-0 right-[33%] bottom-[48%] bg-white border border-slate-200 rounded p-4 flex flex-col gap-4">
                  <div className="bg-slate-200 h-2 rounded-sm w-24" />
                  <div className="flex flex-col gap-3">
                    <div className="bg-slate-50 border border-dashed border-slate-300 h-8 rounded-sm" />
                    <div className="bg-slate-50 border border-dashed border-slate-300 h-8 rounded-sm" />
                    <div className="bg-slate-50 border border-dashed border-slate-300 h-8 rounded-sm" />
                  </div>
                </div>

                {/* Top-right card: Analytics icon */}
                <div className="absolute top-0 left-[68%] right-0 bottom-[55%] bg-brand-light border border-brand-muted rounded flex flex-col items-center justify-center gap-1.5">
                  <MaterialIcon
                    name="analytics"
                    size="md"
                    className="text-brand"
                  />
                  <div className="bg-brand/30 h-2 rounded-sm w-20" />
                </div>

                {/* Bottom-right card: Placeholder pills */}
                <div className="absolute top-[35%] left-[68%] right-0 bottom-0 bg-white border border-slate-200 rounded p-4 flex flex-col gap-4">
                  <div className="bg-slate-200 h-2 rounded-sm w-20" />
                  <div className="flex flex-col gap-2">
                    <div className="bg-slate-100 h-4 rounded-full w-full" />
                    <div className="bg-slate-100 h-4 rounded-full w-3/4" />
                    <div className="bg-slate-100 h-4 rounded-full w-1/2" />
                  </div>
                </div>

                {/* Bottom-left card: Chart mockup */}
                <div className="absolute top-[52%] left-0 right-[33%] bottom-0 bg-white border border-slate-200 rounded">
                  <div className="flex items-center justify-between px-4 pt-4">
                    <div className="bg-slate-200 flex-1 h-2 rounded-sm" />
                    <div className="bg-brand/20 h-4 rounded-full w-10 ml-3" />
                  </div>
                  <div className="px-4 pt-6">
                    <div className="relative w-full aspect-[314/177] rounded-sm bg-slate-100 opacity-50" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating API Uptime Badge */}
            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white border border-slate-200 rounded p-4 shadow-xl flex items-center gap-3">
              <div className="size-2 rounded-full bg-green-500" />
              <span className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">
                API Uptime: 99.99%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
