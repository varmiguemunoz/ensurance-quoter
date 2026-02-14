import { IntakeProfileSidebar } from "@/components/organisms/IntakeProfileSidebar";
import { DashboardTopNav } from "@/components/organisms/DashboardTopNav";
import { DashboardFooter } from "@/components/organisms/DashboardFooter";

interface DashboardTemplateProps {
  children: React.ReactNode;
}

function DashboardTemplate({ children }: DashboardTemplateProps) {
  return (
    <div className="flex h-screen flex-col bg-[#f6f7f8]">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <IntakeProfileSidebar />

        {/* Main Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Nav */}
          <DashboardTopNav />

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">{children}</main>

          {/* Footer */}
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
}

export { DashboardTemplate };
