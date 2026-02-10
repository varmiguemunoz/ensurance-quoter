import { FeatureCard } from "@/components/landing/molecules/FeatureCard";

const FEATURES = [
    {
        icon: "speed",
        title: "Sub-Second Quotes",
        description:
            "Optimized engine built for high-pressure sales calls. No loading spinners, just data.",
    },
    {
        icon: "database",
        title: "Carrier Depth",
        description:
            "From Final Expense to complex IULs, we have the most comprehensive carrier coverage in the industry.",
    },
    {
        icon: "security",
        title: "Agent Security",
        description:
            "Your client data is encrypted and remains yours. We never sell leads to third parties.",
    },
];

export function FeaturesGrid() {
    return (
        <section className="bg-slate-50 border-y border-slate-200 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-16">
            <div className="mx-auto max-w-[1200px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {FEATURES.map((feature) => (
                        <FeatureCard
                            key={feature.title}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
