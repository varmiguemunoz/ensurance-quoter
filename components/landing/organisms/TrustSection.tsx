import { ComplianceBadge } from "@/components/landing/atoms/ComplianceBadge";

const COMPLIANCE_STANDARDS = [
    "SOC2 TYPE II",
    "HIPAA",
    "PCI DSS",
    "SSL/TLS 1.3",
    "AES-256",
];

export function TrustSection() {
    return (
        <section
            id="security"
            className="bg-slate-50 border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-10"
        >
            <div className="mx-auto max-w-[1200px]">
                <div className="flex flex-col gap-10">
                    {/* Section Label */}
                    <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[2.4px]">
                        Enterprise Grade Security &amp; Compliance
                    </p>

                    {/* Badges */}
                    <div className="relative flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-20 opacity-40">
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-white mix-blend-saturation pointer-events-none"
                        />
                        {COMPLIANCE_STANDARDS.map((standard) => (
                            <ComplianceBadge key={standard} label={standard} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
