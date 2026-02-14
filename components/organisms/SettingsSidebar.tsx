import {
  User,
  BadgeCheck,
  Building2,
  Plug,
  Receipt,
  Users,
  SlidersHorizontal,
  Shield,
} from "lucide-react";
import { SettingsNavItem } from "@/components/atoms/SettingsNavItem";
import { Progress } from "@/components/ui/progress";

const navItems = [
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: BadgeCheck, label: "Licenses", href: "/dashboard/profile/licenses" },
  {
    icon: Building2,
    label: "Business Info",
    href: "/dashboard/profile/business",
  },
  {
    icon: Plug,
    label: "Integrations",
    href: "/dashboard/profile/integrations",
  },
  { icon: Receipt, label: "Billing", href: "/dashboard/profile/billing" },
  { icon: Users, label: "Team", href: "/dashboard/profile/team" },
  {
    icon: SlidersHorizontal,
    label: "Preferences",
    href: "/dashboard/profile/preferences",
  },
  { icon: Shield, label: "Security", href: "/dashboard/profile/security" },
];

interface SettingsSidebarProps {
  activePage?: string;
}

function SettingsSidebar({ activePage = "Profile" }: SettingsSidebarProps) {
  return (
    <aside className="flex h-full min-h-[calc(100vh-4rem)] fixed left-0 w-64 z-20 shrink-0 flex-col border-r border-slate-200 bg-slate-100">
      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-6">
        {navItems.map((item) => (
          <SettingsNavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={item.label === activePage}
          />
        ))}
      </nav>

      {/* Plan Usage Card */}
      <div className="border-t border-slate-200 p-4">
        <div className="rounded border border-slate-100 bg-white p-3.5 shadow-sm">
          <p className="text-xs font-semibold text-slate-800">
            Your Plan: Professional
          </p>
          <Progress
            value={75}
            className="mt-2 h-1.5 bg-slate-100 [&>[data-slot=progress-indicator]]:bg-[#1773cf]"
          />
          <p className="mt-2 text-[11px] text-slate-500">
            750/1000 quotes used this month
          </p>
        </div>
      </div>
    </aside>
  );
}

export { SettingsSidebar };
