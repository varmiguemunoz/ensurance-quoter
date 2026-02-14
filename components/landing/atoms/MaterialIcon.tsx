import { cn } from "@/lib/utils";

interface MaterialIconProps {
    name: string;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

const sizeMap = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-[30px]",
    xl: "text-4xl",
} as const;

export function MaterialIcon({
    name,
    size = "md",
    className,
}: MaterialIconProps) {
    return (
        <span
            className={cn(
                "material-symbols-outlined leading-none select-none",
                sizeMap[size],
                className
            )}
            aria-hidden="true"
        >
            {name}
        </span>
    );
}
