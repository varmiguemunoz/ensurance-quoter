"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ProfilePhotoUploadProps {
  imageUrl: string;
  onChangePhoto?: () => void;
  onRemovePhoto?: () => void;
}

function ProfilePhotoUpload({
  imageUrl,
  onChangePhoto,
  onRemovePhoto,
}: ProfilePhotoUploadProps) {
  return (
    <div className="flex items-start gap-6">
      {/* Avatar */}
      <div className="relative size-32 shrink-0 overflow-hidden rounded-xl border-4 border-slate-50 shadow-[0_0_0_1px_#e2e8f0,0_1px_2px_0_rgba(0,0,0,0.05)]">
        <Image
          src={imageUrl}
          alt="Profile photo"
          fill
          className="object-cover"
        />
      </div>

      {/* Info + Actions */}
      <div className="flex flex-col items-start pt-2">
        <h3 className="text-lg font-medium text-slate-900">Profile Photo</h3>
        <p className="max-w-xs text-sm leading-relaxed text-slate-500">
          Upload a professional photo. Accepts JPG, GIF or PNG. 1MB max.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Button
            type="button"
            onClick={onChangePhoto}
            className="bg-[#1773cf] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1565b8]"
          >
            Change Photo
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onRemovePhoto}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}

export { ProfilePhotoUpload };
