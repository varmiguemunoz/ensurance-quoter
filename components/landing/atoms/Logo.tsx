import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    iconSize?: "sm" | "md";
}

export function Logo({ className, iconSize = "md" }: LogoProps) {
    const iconDimensions = iconSize === "sm" ? "size-5" : "size-6";
    const containerPadding = iconSize === "sm" ? "p-1" : "p-1.5";

    return (
        <Link
            href="/"
            className={cn("flex items-center gap-3", className)}
            aria-label="My Insurance Quoter - Home"
        >
            <div
                className={cn(
                    "bg-brand rounded-sm flex items-center justify-center",
                    containerPadding
                )}
            >
                <svg
                    className={cn("text-brand-foreground", iconDimensions)}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M12 22V12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M22 7L12 12L2 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
                My Insurance Quoter
            </span>
        </Link>
    );
}
