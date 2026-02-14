import {
  StepIndicator,
  type StepStatus,
} from "@/components/atoms/StepIndicator";

interface Step {
  label: string;
  status: StepStatus;
}

interface StepperNavProps {
  currentStep: number;
  className?: string;
}

const steps: Step[] = [
  { label: "Application", status: "completed" },
  { label: "Payment", status: "active" },
  { label: "Confirmation", status: "pending" },
];

function getStepStatuses(currentStep: number): Step[] {
  return steps.map((step, i) => ({
    ...step,
    status:
      i + 1 < currentStep
        ? "completed"
        : i + 1 === currentStep
          ? "active"
          : "pending",
  }));
}

function StepperNav({ currentStep, className }: StepperNavProps) {
  const computedSteps = getStepStatuses(currentStep);

  return (
    <div className={`flex items-center justify-center ${className ?? ""}`}>
      {computedSteps.map((step, i) => (
        <div key={step.label} className="flex items-center">
          {i > 0 && (
            <div className="w-12 mx-2 h-0.5">
              <div
                className={`h-full ${
                  step.status !== "pending" ? "bg-[#1773cf]" : "bg-slate-200"
                }`}
              />
            </div>
          )}
          <div className="flex items-center">
            <StepIndicator step={i + 1} status={step.status} />
            <span
              className={`ml-2 text-sm ${
                step.status === "active"
                  ? "font-bold text-[#1773cf]"
                  : step.status === "completed"
                    ? "font-medium text-slate-900"
                    : "font-medium text-slate-500"
              }`}
            >
              {step.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export { StepperNav };
