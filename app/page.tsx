import { MarketingTemplate } from "@/components/landing/templates/MarketingTemplate";
import { HeroSection } from "@/components/landing/organisms/HeroSection";
import { TrustSection } from "@/components/landing/organisms/TrustSection";
import { ProductTabSwitcher } from "@/components/landing/organisms/ProductTabSwitcher";
import { FeaturesGrid } from "@/components/landing/organisms/FeaturesGrid";
import { CTASection } from "@/components/landing/organisms/CTASection";

export default function Home() {
  return (
    <MarketingTemplate>
      <HeroSection />
      <TrustSection />
      <ProductTabSwitcher />
      <FeaturesGrid />
      <CTASection />
    </MarketingTemplate>
  );
}
