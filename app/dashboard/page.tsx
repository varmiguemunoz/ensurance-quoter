import type { Metadata } from "next";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { QuoteEngineHeader } from "@/components/organisms/QuoteEngineHeader";
import { CoverageTermPanel } from "@/components/organisms/CoverageTermPanel";
import { UnderwritingPanel } from "@/components/organisms/UnderwritingPanel";
import { MarketComparisonTable } from "@/components/organisms/MarketComparisonTable";

export const metadata: Metadata = {
  title: "Agent Command Center — Term Life | My Insurance Quoter",
  description:
    "Compare term life insurance quotes from top carriers. Real-time rates, underwriting requirements, and market comparison for insurance agents.",
};

export default function DashboardPage() {
  return (
    <DashboardTemplate>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <QuoteEngineHeader />

        {/* Coverage + Underwriting Row */}
        <div className="flex gap-6">
          <div className="flex-1">
            <CoverageTermPanel />
          </div>
          <div className="w-80 shrink-0">
            <UnderwritingPanel />
          </div>
        </div>

        {/* Market Comparison Table */}
        <MarketComparisonTable />
      </div>
    </DashboardTemplate>
  );
}
