import { Logo } from "@/components/landing/atoms/Logo";
import { MaterialIcon } from "@/components/landing/atoms/MaterialIcon";
import { FooterLinkGroup } from "@/components/landing/molecules/FooterLinkGroup";

const PRODUCT_LINKS = [
    { label: "Term Life", href: "#" },
    { label: "Final Expense", href: "#" },
    { label: "IUL Quoter", href: "#" },
    { label: "Carrier List", href: "#" },
];

const COMPANY_LINKS = [
    { label: "Security", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact Support", href: "#" },
];

export function Footer() {
    return (
        <footer className="bg-[#f9fafa] border-t border-slate-200 pt-16 pb-16 px-4 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-[1200px]">
                {/* Main Footer Content */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-12">
                    {/* Company Info */}
                    <div className="flex flex-col gap-6 lg:flex-[2]">
                        <Logo iconSize="sm" />

                        <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                            The professional standard for insurance quoting and client
                            consultation management. Built by agents, for agents.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-4 pt-2">
                            <a
                                href="#"
                                className="bg-slate-100 size-10 rounded flex items-center justify-center hover:bg-slate-200 transition-colors min-w-[44px] min-h-[44px]"
                                aria-label="Website"
                            >
                                <MaterialIcon
                                    name="public"
                                    size="md"
                                    className="text-slate-900"
                                />
                            </a>
                            <a
                                href="#"
                                className="bg-slate-100 size-10 rounded flex items-center justify-center hover:bg-slate-200 transition-colors min-w-[44px] min-h-[44px]"
                                aria-label="Email"
                            >
                                <MaterialIcon
                                    name="mail"
                                    size="md"
                                    className="text-slate-900"
                                />
                            </a>
                        </div>
                    </div>

                    {/* Link Groups */}
                    <div className="flex flex-col sm:flex-row gap-12 sm:gap-16 lg:flex-[2]">
                        <FooterLinkGroup title="Product" links={PRODUCT_LINKS} />
                        <FooterLinkGroup title="Company" links={COMPANY_LINKS} />
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-200 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-medium text-slate-400">
                        © 2024 My Insurance Quoter. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-green-500" />
                        <span className="text-xs font-medium text-slate-400">
                            Systems Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
