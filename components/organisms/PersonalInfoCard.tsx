"use client";

import { User, Mail, Phone, MapPin } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { IconInput } from "@/components/atoms/IconInput";
import { ProfilePhotoUpload } from "@/components/molecules/ProfilePhotoUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function PersonalInfoCard() {
  return (
    <Card className="gap-0 overflow-hidden rounded-lg border border-slate-200 p-0 shadow-md">
      {/* Header */}
      <CardHeader className="border-b border-slate-200 px-6 py-6">
        <CardTitle className="text-lg font-semibold text-slate-900">
          Personal Information
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          This information will be displayed to your clients during quotes.
        </CardDescription>
      </CardHeader>

      {/* Body */}
      <CardContent className="flex flex-col gap-8 p-8">
        {/* Profile Photo */}
        <ProfilePhotoUpload
          imageUrl="/placeholder-profile.jpg"
          onChangePhoto={() => {}}
          onRemovePhoto={() => {}}
        />

        {/* Full Name — full width */}
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-slate-700">
            Full Name
          </Label>
          <IconInput
            icon={User}
            type="text"
            defaultValue="Sarah Jenkins"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email + Phone — 2-column grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-slate-700">
              Email Address
            </Label>
            <IconInput
              icon={Mail}
              type="email"
              defaultValue="sarah.jenkins@insurancequoter.com"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-slate-700">
              Phone Number
            </Label>
            <IconInput
              icon={Phone}
              type="tel"
              defaultValue="(555) 123-4567"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Licensed State — select */}
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-slate-700">
            Licensed State
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
              <MapPin className="size-5 text-slate-400" />
            </div>
            <Select defaultValue="california">
              <SelectTrigger className="h-11 w-full rounded border-slate-300 pl-11 text-sm shadow-sm">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="california">California</SelectItem>
                <SelectItem value="texas">Texas</SelectItem>
                <SelectItem value="florida">Florida</SelectItem>
                <SelectItem value="new-york">New York</SelectItem>
                <SelectItem value="illinois">Illinois</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { PersonalInfoCard };
