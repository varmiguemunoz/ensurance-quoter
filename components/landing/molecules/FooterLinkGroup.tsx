import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterLinkGroupProps {
    title: string;
    links: { label: string; href: string }[];
    className?: string;
}

export function FooterLinkGroup({
    title,
    links,
    className,
}: FooterLinkGroupProps) {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest">
                {title}
            </h4>
            <ul className="flex flex-col gap-4">
                {links.map((link) => (
                    <li key={link.label}>
                        <Link
                            href={link.href}
                            className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
