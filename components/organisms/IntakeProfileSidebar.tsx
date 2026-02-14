"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Settings, LogOut, PlusCircle } from "lucide-react";
import { NumberStepper } from "@/components/atoms/NumberStepper";
import { ToggleSwitch } from "@/components/atoms/ToggleSwitch";
import { IntakeField } from "@/components/molecules/IntakeField";
import { IntakeSelect } from "@/components/molecules/IntakeSelect";

function IntakeProfileSidebar() {
  const [age, setAge] = useState(45);
  const [gender, setGender] = useState("male");
  const [state, setState] = useState("california");
  const [tobaccoIndex, setTobaccoIndex] = useState(0);

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-white shadow-sm">
      {/* Top Section: Intake Profile */}
      <div className="border-b border-slate-200">
        <div className="flex flex-col gap-6 px-6 pb-6 pt-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-sm bg-[#1773cf] shadow-sm">
              <ShieldCheck className="size-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-[1.4px] text-slate-500">
                Intake Profile
              </span>
              <span className="font-mono text-xs tracking-tight text-[#1773cf]">
                ID: #4920-ALPHA
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-5">
            {/* Full Name */}
            <IntakeField label="Full Name">
              <input
                type="text"
                defaultValue="Johnathan Doe"
                className="w-full rounded-sm border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900"
              />
            </IntakeField>

            {/* Age + Gender */}
            <div className="flex gap-3">
              <div className="flex-1">
                <IntakeField label="Age">
                  <NumberStepper
                    value={age}
                    onDecrement={() => setAge((a) => Math.max(18, a - 1))}
                    onIncrement={() => setAge((a) => Math.min(99, a + 1))}
                  />
                </IntakeField>
              </div>
              <div className="flex-1">
                <IntakeSelect
                  label="Gender"
                  value={gender}
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                  onChange={setGender}
                />
              </div>
            </div>

            {/* State / Territory */}
            <IntakeSelect
              label="State / Territory"
              value={state}
              options={[
                { value: "california", label: "California (CA)" },
                { value: "texas", label: "Texas (TX)" },
                { value: "florida", label: "Florida (FL)" },
                { value: "new-york", label: "New York (NY)" },
              ]}
              onChange={setState}
            />

            {/* Tobacco Usage */}
            <IntakeField label="Tobacco Usage">
              <ToggleSwitch
                options={["NON-SMOKER", "SMOKER"]}
                activeIndex={tobaccoIndex}
                onToggle={setTobaccoIndex}
              />
            </IntakeField>
          </div>
        </div>
      </div>

      {/* Middle Section: Health Indicators */}
      <div className="flex-1 bg-slate-50/50 p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500">
              Health Indicators
            </span>
            <PlusCircle className="size-3.5 text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-sm border border-green-200 bg-green-50 px-3 py-1 text-[10px] font-bold text-green-700 shadow-sm">
              BP 120/80
            </span>
            <span className="rounded-sm border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700 shadow-sm">
              LDL 180
            </span>
            <span className="rounded-sm border border-yellow-200 bg-yellow-50 px-3 py-1 text-[10px] font-bold text-amber-700 shadow-sm">
              BMI 26.4
            </span>
            <span className="rounded-sm border border-gray-300 bg-gray-200 px-3 py-1 text-[10px] font-bold text-gray-700 shadow-sm">
              NO PRE-EX
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Agent Info */}
      <div className="border-t border-slate-200 bg-white px-6 pb-6 pt-6">
        <div className="flex flex-col gap-4">
          {/* Agent */}
          <div className="flex items-center gap-3">
            <div className="relative size-10 overflow-hidden rounded-sm border border-gray-300 bg-gray-200">
              <Image
                src="/placeholder-avatar.jpg"
                alt="Agent Marcus V."
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-600">
                MV
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">
                Agent Marcus V.
              </span>
              <span className="mt-1 font-mono text-[10px] text-slate-500">
                NPN: 18273645
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link
              href="/dashboard/profile"
              className="flex flex-1 items-center justify-center rounded-sm border border-slate-200 bg-gray-100 p-2.5 text-slate-500 transition-colors hover:bg-gray-200"
            >
              <Settings className="size-[18px]" />
            </Link>
            <button
              type="button"
              className="flex flex-1 items-center justify-center rounded-sm border border-slate-200 bg-gray-100 p-2.5 text-slate-500 transition-colors hover:bg-gray-200"
            >
              <LogOut className="size-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export { IntakeProfileSidebar };
