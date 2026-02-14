"use client";

interface NumberStepperProps {
  value: number;
  onDecrement?: () => void;
  onIncrement?: () => void;
}

function NumberStepper({
  value,
  onDecrement,
  onIncrement,
}: NumberStepperProps) {
  return (
    <div className="flex w-full items-center rounded-sm border border-slate-200 bg-slate-50">
      <button
        type="button"
        onClick={onDecrement}
        className="shrink-0 border-r border-slate-200 px-2.5 py-1 text-base text-slate-500 transition-colors hover:bg-slate-100"
        aria-label="Decrease"
      >
        −
      </button>
      <span className="flex-1 text-center text-sm font-bold text-slate-900">
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        className="shrink-0 border-l border-slate-200 px-2 py-1 text-base text-slate-500 transition-colors hover:bg-slate-100"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

export { NumberStepper };
