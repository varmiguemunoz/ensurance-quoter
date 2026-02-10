import { cn } from "@/lib/utils";

interface ComplianceBadgeProps {
    label: string;
    className?: string;
}

export function ComplianceBadge({ label, className }: ComplianceBadgeProps) {
    return (
        <span
            className={cn(
                "text-xl font-black text-slate-900 tracking-tight",
                className
            )}
        >
            {label}
        </span>
    );
}
