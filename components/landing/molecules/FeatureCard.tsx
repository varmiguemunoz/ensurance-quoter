import { MaterialIcon } from "@/components/landing/atoms/MaterialIcon";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
    className?: string;
}

export function FeatureCard({
    icon,
    title,
    description,
    className,
}: FeatureCardProps) {
    return (
        <article
            className={cn(
                "bg-white border border-slate-200 rounded-lg p-8 flex flex-col gap-4",
                "hover:shadow-md transition-shadow duration-300",
                className
            )}
        >
            <MaterialIcon name={icon} size="lg" className="text-brand" />
            <h3 className="font-bold text-xl text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        </article>
    );
}
