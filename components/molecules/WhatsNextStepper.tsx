import {
  StepIndicator,
  type StepStatus,
} from "@/components/atoms/StepIndicator";
import { Check } from "lucide-react";

interface WhatsNextStep {
  label: string;
  description: string;
  status: StepStatus;
}

const nextSteps: WhatsNextStep[] = [
  {
    label: "Submission",
    description: "Application sent to Prudential",
    status: "completed",
  },
  {
    label: "Medical Exam",
    description: "Nurse will contact client to schedule",
    status: "active",
  },
  {
    label: "Underwriting",
    description: "Review of medical records",
    status: "pending",
  },
  {
    label: "Policy Approval",
    description: "Final decision & delivery",
    status: "pending",
  },
];

function WhatsNextStepper() {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h3 className="text-lg font-bold text-slate-900 text-center">
        What Happens Next?
      </h3>

      <div className="relative w-full">
        {/* Horizontal line behind circles */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200" />

        <div className="relative flex items-start justify-center gap-4">
          {nextSteps.map((step, i) => (
            <div
              key={step.label}
              className="flex flex-1 flex-col items-center gap-2"
            >
              {/* Circle */}
              <div className="relative z-10">
                {step.status === "completed" ? (
                  <div className="flex items-center justify-center rounded-xl size-10 bg-green-100 border-4 border-white p-1">
                    <Check
                      className="size-[18px] text-green-700"
                      strokeWidth={3}
                    />
                  </div>
                ) : step.status === "active" ? (
                  <div className="flex items-center justify-center rounded-xl size-10 bg-[#1773cf] border-4 border-white shadow-[0_10px_15px_-3px_rgba(23,115,207,0.2),0_4px_6px_-4px_rgba(23,115,207,0.2)]">
                    <span className="text-white font-bold text-base">
                      {i + 1}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-xl size-10 bg-slate-200 border-4 border-white">
                    <span className="text-slate-500 font-bold text-base">
                      {i + 1}
                    </span>
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-bold text-slate-900 text-center">
                  {step.label}
                </span>
                <span className="text-xs text-slate-500 text-center leading-4">
                  {step.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { WhatsNextStepper };
