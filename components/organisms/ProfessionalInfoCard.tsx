"use client";

import { useState } from "react";
import { Building2, BadgeCheck, Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/atoms/IconInput";
import {
  SpecializationGrid,
  type Specialization,
} from "@/components/molecules/SpecializationGrid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialSpecializations: Specialization[] = [
  { id: "term-life", label: "Term Life", checked: true },
  { id: "whole-life", label: "Whole Life", checked: true },
  { id: "universal-life", label: "Universal Life", checked: false },
  { id: "final-expense", label: "Final Expense", checked: true },
  { id: "annuities", label: "Annuities", checked: false },
];

function ProfessionalInfoCard() {
  const [specializations, setSpecializations] = useState(
    initialSpecializations,
  );

  const handleToggle = (id: string) => {
    setSpecializations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)),
    );
  };

  return (
    <Card className="gap-0 overflow-hidden rounded-lg border border-slate-200 p-0 shadow-md">
      {/* Header */}
      <CardHeader className="border-b border-slate-200 px-6 py-6">
        <CardTitle className="text-lg font-semibold text-slate-900">
          Professional Information
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Manage your brokerage details and specializations.
        </CardDescription>
      </CardHeader>

      {/* Body */}
      <CardContent className="flex flex-col gap-8 p-8">
        {/* Brokerage Name + License Number — 2-column grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-slate-700">
              Brokerage Name
            </Label>
            <IconInput
              icon={Building2}
              type="text"
              defaultValue="Jenkins Insurance Group"
              placeholder="Enter brokerage name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-slate-700">
              License Number (NPN)
            </Label>
            <IconInput
              icon={BadgeCheck}
              type="text"
              defaultValue="18492033"
              placeholder="Enter license number"
            />
          </div>
        </div>

        {/* Years of Experience — select */}
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-slate-700">
            Years of Experience
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
              <Clock className="size-5 text-slate-400" />
            </div>
            <Select defaultValue="6-10">
              <SelectTrigger className="h-11 w-full rounded border-slate-300 pl-11 text-sm shadow-sm">
                <SelectValue placeholder="Select experience range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-2">0-2 Years</SelectItem>
                <SelectItem value="3-5">3-5 Years</SelectItem>
                <SelectItem value="6-10">6-10 Years</SelectItem>
                <SelectItem value="11-20">11-20 Years</SelectItem>
                <SelectItem value="20+">20+ Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Specializations */}
        <SpecializationGrid
          specializations={specializations}
          onToggle={handleToggle}
        />
      </CardContent>

      {/* Footer with action buttons */}
      <CardFooter className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
        <Button
          type="button"
          variant="outline"
          className="border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700"
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="bg-[#1773cf] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1565b8]"
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}

export { ProfessionalInfoCard };
