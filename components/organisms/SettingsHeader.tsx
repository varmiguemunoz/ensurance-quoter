import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

function SettingsHeader() {
  return (
    <header className="flex h-16 w-full fixed top-0 z-20 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded bg-[#1773cf] shadow-sm">
          <span className="text-lg font-bold leading-none text-white">Q</span>
        </div>
        <span className="text-lg font-semibold tracking-tight text-slate-900">
          My Insurance Quoter
        </span>
      </div>

      {/* Right: Back link + Divider + User */}
      <div className="flex items-center gap-6">
        {/* Back to Dashboard */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="size-5" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-900">
              Sarah Jenkins
            </span>
            <span className="text-xs text-slate-500">Senior Broker</span>
          </div>
          <div className="relative size-9 overflow-hidden rounded-full border border-slate-300 bg-slate-200">
            <Image
              src="/placeholder-avatar.jpg"
              alt="Sarah Jenkins"
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-600">
              SJ
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export { SettingsHeader };
