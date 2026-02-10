import { MaterialIcon } from "@/components/landing/atoms/MaterialIcon";
import { cn } from "@/lib/utils";

interface FeatureItemProps {
    icon: string;
    title: string;
    description: string;
    className?: string;
}

export function FeatureItem({
    icon,
    title,
    description,
    className,
}: FeatureItemProps) {
    return (
        <div className={cn("flex gap-4 items-start", className)}>
            <div className="flex-shrink-0 size-10 bg-brand-light rounded-sm flex items-center justify-center">
                <MaterialIcon name={icon} size="md" className="text-brand" />
            </div>
            <div className="flex flex-col gap-0.5">
                <h3 className="font-bold text-lg text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}
