"use client";

import { cn } from "@/lib/utils/cn";

interface SelectableCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}

export function SelectableCard({ label, description, selected, onSelect }: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative flex w-full flex-col gap-1 rounded-2xl border px-5 py-4 text-left transition-all duration-200",
        selected
          ? "border-nude-blush bg-nude-blush/10 shadow-glow"
          : "border-nude-blush/15 bg-black-cherry-700/40 hover:border-nude-blush/40 hover:bg-black-cherry-700/70"
      )}
    >
      <span
        className={cn(
          "text-sm font-semibold tracking-wide",
          selected ? "text-nude-blush" : "text-nude-blush/80"
        )}
      >
        {label}
      </span>
      {description && (
        <span className="text-xs text-nude-blush/50">{description}</span>
      )}
      <span
        className={cn(
          "absolute right-4 top-4 h-2.5 w-2.5 rounded-full border transition-colors",
          selected ? "border-nude-blush bg-nude-blush" : "border-nude-blush/30 bg-transparent"
        )}
      />
    </button>
  );
}
