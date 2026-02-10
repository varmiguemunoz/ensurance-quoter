import { Header } from "@/components/landing/organisms/Header";
import { Footer } from "@/components/landing/organisms/Footer";

interface MarketingTemplateProps {
    children: React.ReactNode;
}

export function MarketingTemplate({ children }: MarketingTemplateProps) {
    return (
        <div className="min-h-screen bg-[#f9fafa]">
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
