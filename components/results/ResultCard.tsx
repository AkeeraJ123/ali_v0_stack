"use client";

import { cn } from "@/lib/utils/cn";

interface ResultCardProps {
  imageUrl: string;
  index: number;
  selected: boolean;
  favorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

export function ResultCard({
  imageUrl,
  index,
  selected,
  favorite,
  onSelect,
  onToggleFavorite,
}: ResultCardProps) {
  return (
    <div
      className={cn(
        "surface-card relative cursor-pointer overflow-hidden transition-all",
        selected ? "ring-2 ring-nude-blush" : "hover:border-nude-blush/30"
      )}
      onClick={onSelect}
    >
      <div className="relative aspect-[3/4] w-full bg-black-cherry-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={`Result ${index + 1}`} className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          aria-label="Favorite"
          className={cn(
            "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black-cherry-900/70 transition-colors",
            favorite ? "text-nude-blush" : "text-nude-blush/50 hover:text-nude-blush"
          )}
        >
          {favorite ? "♥" : "♡"}
        </button>
        <span className="absolute bottom-3 left-3 rounded-full bg-black-cherry-900/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-nude-blush/80">
          Version {index + 1}
        </span>
      </div>
    </div>
  );
}
