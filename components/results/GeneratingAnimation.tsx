"use client";

import { useEffect, useState } from "react";
import { GENERATING_MESSAGES } from "@/lib/constants/bodyOptions";

export function GeneratingAnimation() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % GENERATING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-10 text-center">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <div className="absolute inset-0 animate-pulseGlow rounded-full bg-nude-blush/20 blur-2xl" />
        <div className="absolute inset-0 rounded-full border border-nude-blush/20" />
        <div className="absolute inset-3 animate-[spin_3.5s_linear_infinite] rounded-full border-2 border-transparent border-t-nude-blush border-r-nude-blush/40" />
        <div className="absolute inset-8 rounded-full bg-cherry-radial" />
        <span className="relative font-serif text-2xl text-nude-blush">RGB</span>
      </div>
      <div className="h-6">
        <p key={messageIndex} className="animate-fadeIn text-sm tracking-wide text-nude-blush/80">
          {GENERATING_MESSAGES[messageIndex]}
        </p>
      </div>
      <div className="h-1 w-64 overflow-hidden rounded-full bg-black-cherry-800">
        <div className="h-full w-1/3 animate-shimmer rounded-full bg-gradient-to-r from-transparent via-nude-blush to-transparent bg-[length:200%_100%]" />
      </div>
      <p className="max-w-xs text-xs text-nude-blush/40">
        This can take a minute. We don&apos;t fake a percentage — we&apos;ll bring you straight to your results the moment they&apos;re ready.
      </p>
    </div>
  );
}
