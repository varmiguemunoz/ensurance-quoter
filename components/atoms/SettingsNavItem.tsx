import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SettingsNavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
}

function SettingsNavItem({
  icon: Icon,
  label,
  href,
  isActive = false,
}: SettingsNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-[#1773cf]/10 text-[#1773cf]"
          : "text-slate-600 hover:bg-slate-100",
      )}
    >
      <Icon className="size-5 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export { SettingsNavItem };
