"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { WizardStepper } from "@/components/layout/WizardStepper";
import { ToggleRow } from "@/components/ui/ToggleRow";
import { Button } from "@/components/ui/Button";
import { useWizardStore } from "@/lib/wizard/store";
import { LOCKABLE_TRAITS } from "@/lib/constants/bodyOptions";
import type { LockedTraits } from "@/lib/types/db";

export default function LockTraitsPage() {
  const router = useRouter();
  const lockedTraits = useWizardStore((s) => s.lockedTraits);
  const updateLockedTraits = useWizardStore((s) => s.updateLockedTraits);

  return (
    <main className="min-h-screen bg-black-cherry-900">
      <Navbar />
      <WizardStepper currentHref="/lock-traits" />

      <section className="mx-auto max-w-2xl px-6 py-14">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-semibold text-nude-blush">Keep Her HER.</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-nude-blush/55">
            We&apos;re changing the body direction, not rebuilding your character.
          </p>
        </div>

        <div className="surface-card mt-10 p-6">
          <ToggleRow
            label="Identity"
            description="Facial identity and overall likeness are always preserved."
            checked
            disabled
            lockedNote="Always Locked"
            onChange={() => {}}
          />
          {LOCKABLE_TRAITS.map((trait) => (
            <ToggleRow
              key={trait.key}
              label={trait.label}
              checked={lockedTraits[trait.key as keyof LockedTraits]}
              onChange={(checked) =>
                updateLockedTraits({ [trait.key]: checked } as Partial<LockedTraits>)
              }
            />
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-3">
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => router.push("/consultation")}>
              Back
            </Button>
            <Button variant="primary" onClick={() => router.push("/generation-settings")}>
              CONTINUE TO SETTINGS
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
