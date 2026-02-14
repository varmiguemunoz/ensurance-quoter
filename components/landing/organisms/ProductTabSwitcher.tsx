"use client";

import { useState } from "react";
import { FeatureItem } from "@/components/landing/molecules/FeatureItem";
import { cn } from "@/lib/utils";

const TABS = [
    {
        id: "term-life",
        label: "Term Life",
        features: [
            {
                icon: "groups",
                title: "Multi-Carrier Live Feed",
                description:
                    "Direct API integrations with 50+ A-rated carriers for precise, bindable quotes.",
            },
            {
                icon: "history",
                title: "Instant Scenario Comparison",
                description:
                    "Adjust death benefits, riders, and terms with a single slider. Results update in <100ms.",
            },
            {
                icon: "send",
                title: "E-App Drop Ticket",
                description:
                    "Start the application directly from the quoter. Zero double-entry of data.",
            },
        ],
    },
    {
        id: "final-expense",
        label: "Final Expense",
        features: [
            {
                icon: "favorite",
                title: "Simplified Underwriting",
                description:
                    "Guaranteed and simplified issue carriers compared side-by-side in seconds.",
            },
            {
                icon: "payments",
                title: "Premium Comparison",
                description:
                    "View monthly and annual premium breakdowns across all available carriers.",
            },
            {
                icon: "description",
                title: "One-Click Applications",
                description:
                    "Submit applications directly from the comparison view with pre-filled client data.",
            },
        ],
    },
    {
        id: "iul",
        label: "IUL",
        features: [
            {
                icon: "trending_up",
                title: "Index Strategy Modeling",
                description:
                    "Compare cap rates, participation rates, and floor guarantees across top IUL carriers.",
            },
            {
                icon: "calculate",
                title: "Illustration Engine",
                description:
                    "Generate compliant illustrations with real-time premium calculations and projections.",
            },
            {
                icon: "shield",
                title: "Living Benefits Overlay",
                description:
                    "Automatically compare chronic, critical, and terminal illness riders across products.",
            },
        ],
    },
    {
        id: "annuities",
        label: "Annuities",
        features: [
            {
                icon: "account_balance",
                title: "Rate Aggregation",
                description:
                    "Real-time MYGA, FIA, and SPIA rates aggregated from 30+ carriers.",
            },
            {
                icon: "swap_horiz",
                title: "1035 Exchange Workflow",
                description:
                    "Built-in suitability checks and exchange paperwork automated end-to-end.",
            },
            {
                icon: "timeline",
                title: "Income Projections",
                description:
                    "Model guaranteed vs. projected income streams with adjustable assumptions.",
            },
        ],
    },
];

export function ProductTabSwitcher() {
    const [activeTab, setActiveTab] = useState("term-life");
    const currentTab = TABS.find((t) => t.id === activeTab) ?? TABS[0];

    return (
        <section
            id="features"
            className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10"
        >
            <div className="mx-auto max-w-[1200px]">
                {/* Section Header */}
                <div className="flex flex-col items-center gap-4 mb-12 lg:mb-16">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 text-center">
                        One Unified Intake. Four Product Lines.
                    </h2>
                    <p className="text-base text-slate-500 text-center max-w-md">
                        Stop re-entering client data. Enter once, toggle instantly.
                    </p>
                </div>

                {/* Tab Card */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    {/* Tab Buttons */}
                    <div className="border-b border-slate-200 overflow-x-auto">
                        <div className="flex px-4 min-w-max">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "px-6 sm:px-8 py-5 text-sm font-bold transition-colors border-b-[3px] min-w-[44px] min-h-[44px]",
                                        activeTab === tab.id
                                            ? "border-brand text-brand"
                                            : "border-transparent text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                            {/* Feature List */}
                            <div className="flex-1 flex flex-col gap-6">
                                {currentTab.features.map((feature) => (
                                    <FeatureItem
                                        key={feature.title}
                                        icon={feature.icon}
                                        title={feature.title}
                                        description={feature.description}
                                    />
                                ))}
                            </div>

                            {/* Image Placeholder */}
                            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-6">
                                <div className="w-full aspect-video bg-slate-100 rounded flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-3 opacity-60">
                                        <span className="material-symbols-outlined text-4xl text-slate-400">
                                            desktop_windows
                                        </span>
                                        <span className="text-sm text-slate-400 font-medium">
                                            {currentTab.label} Dashboard Preview
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
