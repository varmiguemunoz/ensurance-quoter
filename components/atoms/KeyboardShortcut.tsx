interface KeyboardShortcutProps {
  keys: string;
  label: string;
}

function KeyboardShortcut({ keys, label }: KeyboardShortcutProps) {
  return (
    <div className="flex items-center">
      <kbd className="rounded-sm border border-gray-300 bg-gray-100 px-[7px] py-px font-mono text-[10px] font-bold text-gray-600 shadow-sm">
        {keys}
      </kbd>
      <span className="ml-1 font-mono text-[10px] text-slate-500">{label}</span>
    </div>
  );
}

export { KeyboardShortcut };
