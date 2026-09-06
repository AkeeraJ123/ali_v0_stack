"use client";

import { cn } from "@/lib/utils/cn";
import type { WizardReferenceImage } from "@/lib/wizard/store";

interface ReferenceImageCardProps {
  reference: WizardReferenceImage;
  index: number;
  total: number;
  onRemove: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onSetPrimary: () => void;
}

export function ReferenceImageCard({
  reference,
  index,
  total,
  onRemove,
  onMoveLeft,
  onMoveRight,
  onSetPrimary,
}: ReferenceImageCardProps) {
  return (
    <div className="surface-card group relative overflow-hidden">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-3xl bg-black-cherry-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={reference.previewUrl}
          alt={`Image ${index + 1}`}
          className="h-full w-full object-cover"
        />
        {reference.isPrimary && (
          <span className="absolute left-3 top-3 rounded-full bg-nude-blush px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-black-cherry-900">
            Primary
          </span>
        )}
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove image"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black-cherry-900/80 text-nude-blush transition-colors hover:bg-black-cherry-900"
        >
          ×
        </button>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-xs font-medium text-nude-blush/70">Image {index + 1}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveLeft}
            aria-label="Move earlier"
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full text-nude-blush/60 transition-colors hover:text-nude-blush",
              index === 0 && "opacity-20 hover:text-nude-blush/60"
            )}
          >
            ‹
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={onMoveRight}
            aria-label="Move later"
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full text-nude-blush/60 transition-colors hover:text-nude-blush",
              index === total - 1 && "opacity-20 hover:text-nude-blush/60"
            )}
          >
            ›
          </button>
        </div>
      </div>
      {!reference.isPrimary && (
        <button
          type="button"
          onClick={onSetPrimary}
          className="w-full border-t border-nude-blush/10 py-2 text-[11px] font-medium uppercase tracking-wide text-nude-blush/50 transition-colors hover:bg-nude-blush/5 hover:text-nude-blush"
        >
          Mark as primary
        </button>
      )}
    </div>
  );
}
