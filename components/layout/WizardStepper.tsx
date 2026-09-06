import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const STEPS = [
  { href: "/upload", label: "Upload" },
  { href: "/consultation", label: "Consultation" },
  { href: "/lock-traits", label: "Lock Traits" },
  { href: "/generation-settings", label: "Settings" },
];

export function WizardStepper({ currentHref }: { currentHref: string }) {
  const currentIndex = STEPS.findIndex((s) => s.href === currentHref);

  return (
    <div className="mx-auto flex max-w-xl items-center justify-between gap-2 px-6 pt-8">
      {STEPS.map((step, i) => (
        <div key={step.href} className="flex flex-1 items-center gap-2">
          <Link
            href={i <= currentIndex ? step.href : "#"}
            className={cn(
              "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors",
              i < currentIndex && "border-nude-blush bg-nude-blush text-black-cherry-900",
              i === currentIndex && "border-nude-blush text-nude-blush",
              i > currentIndex && "border-nude-blush/20 text-nude-blush/30"
            )}
          >
            {i + 1}
          </Link>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "h-px flex-1",
                i < currentIndex ? "bg-nude-blush" : "bg-nude-blush/15"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
