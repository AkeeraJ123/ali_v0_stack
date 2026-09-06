"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { WizardStepper } from "@/components/layout/WizardStepper";
import { SelectableCard } from "@/components/ui/SelectableCard";
import { PillGroup } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { useWizardStore } from "@/lib/wizard/store";
import {
  BUST_OPTIONS,
  GLUTES_OPTIONS,
  HIPS_OPTIONS,
  OVERALL_BODY_DIRECTIONS,
  PROPORTION_BALANCE_OPTIONS,
  REALISM_LEVEL_OPTIONS,
  STOMACH_OPTIONS,
  THIGHS_OPTIONS,
  WAIST_OPTIONS,
} from "@/lib/constants/bodyOptions";

function ConsultationSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-card p-6">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-nude-blush/50">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function ConsultationPage() {
  const router = useRouter();
  const bodySettings = useWizardStore((s) => s.bodySettings);
  const updateBodySettings = useWizardStore((s) => s.updateBodySettings);

  return (
    <main className="min-h-screen bg-black-cherry-900">
      <Navbar />
      <WizardStepper currentHref="/consultation" />

      <section className="mx-auto max-w-4xl px-6 py-14">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-semibold text-nude-blush">
            What Are We Changing?
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-nude-blush/55">
            A private body consultation with Coach Akeera&apos;s studio. Choose an overall
            direction, then fine-tune each area.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          <ConsultationSection title="Overall Body Direction">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {OVERALL_BODY_DIRECTIONS.map((option) => (
                <SelectableCard
                  key={option.value}
                  label={option.label}
                  selected={bodySettings.overallDirection === option.value}
                  onSelect={() => updateBodySettings({ overallDirection: option.value })}
                />
              ))}
            </div>
          </ConsultationSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <ConsultationSection title="Waist">
              <PillGroup
                options={WAIST_OPTIONS}
                value={bodySettings.waist}
                onChange={(v) => updateBodySettings({ waist: v })}
              />
            </ConsultationSection>
            <ConsultationSection title="Hips">
              <PillGroup
                options={HIPS_OPTIONS}
                value={bodySettings.hips}
                onChange={(v) => updateBodySettings({ hips: v })}
              />
            </ConsultationSection>
            <ConsultationSection title="Thighs">
              <PillGroup
                options={THIGHS_OPTIONS}
                value={bodySettings.thighs}
                onChange={(v) => updateBodySettings({ thighs: v })}
              />
            </ConsultationSection>
            <ConsultationSection title="Bust">
              <PillGroup
                options={BUST_OPTIONS}
                value={bodySettings.bust}
                onChange={(v) => updateBodySettings({ bust: v })}
              />
            </ConsultationSection>
            <ConsultationSection title="Glutes">
              <PillGroup
                options={GLUTES_OPTIONS}
                value={bodySettings.glutes}
                onChange={(v) => updateBodySettings({ glutes: v })}
              />
            </ConsultationSection>
            <ConsultationSection title="Stomach">
              <PillGroup
                options={STOMACH_OPTIONS}
                value={bodySettings.stomach}
                onChange={(v) => updateBodySettings({ stomach: v })}
              />
            </ConsultationSection>
            <ConsultationSection title="Proportion Balance">
              <PillGroup
                options={PROPORTION_BALANCE_OPTIONS}
                value={bodySettings.proportionBalance}
                onChange={(v) => updateBodySettings({ proportionBalance: v })}
              />
            </ConsultationSection>
            <ConsultationSection title="Realism Level">
              <PillGroup
                options={REALISM_LEVEL_OPTIONS}
                value={bodySettings.realismLevel}
                onChange={(v) => updateBodySettings({ realismLevel: v })}
              />
            </ConsultationSection>
          </div>

          <ConsultationSection title="Custom Notes">
            <label className="mb-2 block text-sm text-nude-blush/70">
              Tell Coach Akeera exactly what you want adjusted.
            </label>
            <textarea
              value={bodySettings.customNotes}
              onChange={(e) => updateBodySettings({ customNotes: e.target.value })}
              rows={4}
              maxLength={600}
              placeholder="e.g. Keep her waist natural but add more roundness to her hips…"
              className="w-full rounded-xl border border-nude-blush/20 bg-black-cherry-800/60 px-4 py-3 text-sm text-nude-blush outline-none focus:border-nude-blush"
            />
          </ConsultationSection>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3">
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => router.push("/upload")}>
              Back
            </Button>
            <Button variant="primary" onClick={() => router.push("/lock-traits")}>
              CONTINUE TO LOCK TRAITS
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
