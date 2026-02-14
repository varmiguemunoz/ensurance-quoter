"use client";

import { SettingsHeader } from "@/components/organisms/SettingsHeader";
import { SettingsSidebar } from "@/components/organisms/SettingsSidebar";

interface SettingsTemplateProps {
  children: React.ReactNode;
  activePage?: string;
}

function SettingsTemplate({
  children,
  activePage = "Profile",
}: SettingsTemplateProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f8]">
      {/* Header */}
      <SettingsHeader />

      {/* Body: Sidebar + Main Content */}
      <div className="flex flex-1 mt-16">
        <SettingsSidebar activePage={activePage} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export { SettingsTemplate };
