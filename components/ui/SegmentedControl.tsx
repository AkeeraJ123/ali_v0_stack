"use client";

import { cn } from "@/lib/utils/cn";

interface SegmentedControlProps<T extends string | number> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="inline-flex rounded-full border border-nude-blush/20 bg-black-cherry-800/60 p-1">
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-colors duration-150",
            value === option.value
              ? "bg-nude-blush text-black-cherry-900"
              : "text-nude-blush/60 hover:text-nude-blush"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
