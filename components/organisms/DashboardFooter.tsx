import { KeyboardShortcut } from "@/components/atoms/KeyboardShortcut";

function DashboardFooter() {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-2 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
      {/* Left: Keyboard Shortcuts */}
      <div className="flex items-start gap-4">
        <KeyboardShortcut keys="ESC" label="Clear All" />
        <KeyboardShortcut keys="ALT+S" label="Sync CRM" />
        <KeyboardShortcut keys="ALT+Q" label="New Quote" />
      </div>

      {/* Right: Carrier Cloud Status */}
      <div className="flex items-center gap-2">
        <div className="relative flex size-2 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-green-400 opacity-75" />
          <div className="size-2 rounded-full bg-green-500" />
        </div>
        <span className="font-mono text-[10px] font-bold text-green-700">
          CARRIER CLOUD CONNECTED
        </span>
      </div>
    </div>
  );
}

export { DashboardFooter };
