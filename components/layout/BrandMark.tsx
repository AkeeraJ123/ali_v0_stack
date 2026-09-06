import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function BrandMark({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex flex-col leading-none", className)}>
      <span className="font-serif text-lg font-semibold tracking-[0.08em] text-nude-blush">
        RICH GIRL BODIED
      </span>
      <span className="mt-0.5 text-[10px] uppercase tracking-[0.35em] text-nude-blush/50">
        by Coach Akeera
      </span>
    </Link>
  );
}
