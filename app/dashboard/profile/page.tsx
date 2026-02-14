import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { SettingsTemplate } from "@/components/templates/SettingsTemplate";
import { PersonalInfoCard } from "@/components/organisms/PersonalInfoCard";
import { ProfessionalInfoCard } from "@/components/organisms/ProfessionalInfoCard";

export const metadata: Metadata = {
  title: "Profile Settings | My Insurance Quoter",
  description:
    "Manage your personal details and professional credentials for your insurance brokerage profile.",
};

export default function ProfilePage() {
  return (
    <SettingsTemplate activePage="Profile">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-16 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center" aria-label="Breadcrumb">
          <ol className="flex items-center">
            <li>
              <span className="text-sm text-slate-500">Settings</span>
            </li>
            <li className="flex items-center px-2">
              <ChevronRight className="size-4 text-slate-400" />
            </li>
            <li>
              <span className="text-sm font-medium text-slate-900">
                Profile
              </span>
            </li>
          </ol>
        </nav>

        {/* Page Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">
            Profile Settings
          </h1>
          <p className="text-base text-slate-600">
            Manage your personal details and professional credentials.
          </p>
        </div>

        {/* Form Sections */}
        <div className="mt-2 flex flex-col gap-6">
          <PersonalInfoCard />
          <ProfessionalInfoCard />
        </div>
      </div>
    </SettingsTemplate>
  );
}
