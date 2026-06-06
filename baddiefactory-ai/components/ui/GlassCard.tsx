"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  gold?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  gold = false,
  glow = false,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        gold ? "glass-gold" : "glass",
        glow && "glow-pink",
        onClick && "cursor-pointer hover:scale-[1.01] transition-transform duration-200",
        "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
