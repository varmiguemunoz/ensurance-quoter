import { type ReactNode } from "react";

interface IntakeFieldProps {
  label: string;
  children: ReactNode;
}

function IntakeField({ label, children }: IntakeFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase text-slate-500">
        {label}
      </span>
      {children}
    </div>
  );
}

export { IntakeField };
