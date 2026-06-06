"use client";

import { cn } from "@/lib/utils";

interface OptionChipProps {
  label: string;
  emoji?: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionChip({ label, emoji, selected, onClick }: OptionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "option-chip",
        selected && "selected"
      )}
    >
      {emoji && <span className="mr-1">{emoji}</span>}
      {label}
    </button>
  );
}
