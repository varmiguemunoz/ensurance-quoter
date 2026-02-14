"use client";

import { useState } from "react";
import { CoverageSlider } from "@/components/molecules/CoverageSlider";
import { DurationButton } from "@/components/atoms/DurationButton";

const DURATIONS = ["10Y", "15Y", "20Y", "30Y"];

function CoverageTermPanel() {
  const [coverage, setCoverage] = useState(1_000_000);
  const [selectedDuration, setSelectedDuration] = useState("20Y");

  return (
    <div className="rounded border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex gap-8">
        {/* Left: Coverage Slider */}
        <div className="w-1/2">
          <CoverageSlider value={coverage} onChange={setCoverage} />
        </div>

        {/* Right: Term Duration */}
        <div className="flex w-1/2 flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-[1.2px] text-slate-500">
            Term Duration
          </span>
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <DurationButton
                key={d}
                label={d}
                isSelected={d === selectedDuration}
                onClick={() => setSelectedDuration(d)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { CoverageTermPanel };
