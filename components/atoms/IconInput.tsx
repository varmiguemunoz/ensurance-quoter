import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { LucideIcon } from "lucide-react";

interface IconInputProps extends React.ComponentProps<"input"> {
  icon: LucideIcon;
}

function IconInput({ icon: Icon, className, ...props }: IconInputProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="size-5 text-slate-400" />
      </div>
      <Input
        className={cn(
          "h-11 rounded border-slate-300 pl-11 text-sm text-slate-900 shadow-sm",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export { IconInput };
