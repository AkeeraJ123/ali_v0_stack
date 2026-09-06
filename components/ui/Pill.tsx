"use client";

import { cn } from "@/lib/utils/cn";

interface PillProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export function Pill({ label, selected, onSelect }: PillProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition-colors duration-150",
        selected
          ? "border-nude-blush bg-nude-blush text-black-cherry-900"
          : "border-nude-blush/25 text-nude-blush/70 hover:border-nude-blush/60 hover:text-nude-blush"
      )}
    >
      {label}
    </button>
  );
}

export function PillGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Pill
          key={option.value}
          label={option.label}
          selected={value === option.value}
          onSelect={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}
