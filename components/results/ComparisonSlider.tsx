"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface ComparisonSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function ComparisonSlider({
  beforeUrl,
  afterUrl,
  beforeLabel = "Original",
  afterLabel = "Transformed",
}: ComparisonSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function updateFromClientX(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] w-full select-none overflow-hidden rounded-3xl border border-nude-blush/15 bg-black-cherry-800"
      onMouseDown={(e) => {
        dragging.current = true;
        updateFromClientX(e.clientX);
      }}
      onMouseMove={(e) => {
        if (dragging.current) updateFromClientX(e.clientX);
      }}
      onMouseUp={() => {
        dragging.current = false;
      }}
      onMouseLeave={() => {
        dragging.current = false;
      }}
      onTouchStart={(e) => updateFromClientX(e.touches[0].clientX)}
      onTouchMove={(e) => updateFromClientX(e.touches[0].clientX)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={afterUrl} alt={afterLabel} className="absolute inset-0 h-full w-full object-cover" />
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeUrl}
          alt={beforeLabel}
          className="h-full object-cover"
          style={{ width: containerRef.current?.clientWidth ?? "100vw", maxWidth: "none" }}
        />
      </div>
      <div
        className="absolute inset-y-0 z-10 w-0.5 bg-nude-blush"
        style={{ left: `${position}%` }}
      >
        <div
          className={cn(
            "absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-nude-blush bg-black-cherry-900 text-nude-blush shadow-glow"
          )}
        >
          <span className="text-xs">↔</span>
        </div>
      </div>
      <span className="absolute bottom-3 left-3 rounded-full bg-black-cherry-900/70 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-nude-blush/80">
        {beforeLabel}
      </span>
      <span className="absolute bottom-3 right-3 rounded-full bg-black-cherry-900/70 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-nude-blush/80">
        {afterLabel}
      </span>
    </div>
  );
}
