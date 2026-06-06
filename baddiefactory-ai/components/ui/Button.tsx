"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "pink" | "gold" | "glass" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "pink",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variantClass = {
    pink: "btn-pink",
    gold: "btn-gold",
    glass: "btn-glass",
    outline:
      "border border-[rgba(255,0,128,0.4)] text-[#FF0080] hover:bg-[rgba(255,0,128,0.1)] rounded-xl transition-all",
  }[variant];

  const sizeClass = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-6 py-3",
    lg: "text-lg px-8 py-4",
  }[size];

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        variantClass,
        sizeClass,
        "flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
