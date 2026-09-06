"use client";

import { cn } from "@/lib/utils/cn";

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  lockedNote?: string;
}

export function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled,
  lockedNote,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-nude-blush/10 py-4 last:border-b-0">
      <div>
        <p className="text-sm font-medium text-nude-blush">{label}</p>
        {description && <p className="mt-0.5 text-xs text-nude-blush/45">{description}</p>}
        {disabled && lockedNote && (
          <p className="mt-0.5 text-xs uppercase tracking-wide text-nude-blush/40">{lockedNote}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-nude-blush" : "bg-black-cherry-800",
          disabled && "cursor-not-allowed opacity-70"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-black-cherry-900 shadow transition-transform duration-200",
            checked ? "translate-x-[22px] bg-white" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}
