import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export function NavLink({ href, children, className }: NavLinkProps) {
    return (
        <Link
            href={href}
            className={cn(
                "text-sm font-medium text-slate-900 hover:text-brand transition-colors",
                className
            )}
        >
            {children}
        </Link>
    );
}
