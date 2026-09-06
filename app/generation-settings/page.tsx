"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { WizardStepper } from "@/components/layout/WizardStepper";
import { SelectableCard } from "@/components/ui/SelectableCard";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Button } from "@/components/ui/Button";
import { useWizardStore } from "@/lib/wizard/store";
import {
  ASPECT_RATIO_OPTIONS,
  BACKGROUND_OPTIONS,
  FRAMING_OPTIONS,
  OUTPUT_COUNT_OPTIONS,
  WARDROBE_OPTIONS,
} from "@/lib/constants/bodyOptions";

export default function GenerationSettingsPage() {
  const router = useRouter();
  const references = useWizardStore((s) => s.references);
  const generationSettings = useWizardStore((s) => s.generationSettings);
  const updateGenerationSettings = useWizardStore((s) => s.updateGenerationSettings);
  const characterName = useWizardStore((s) => s.characterName);
  const setCharacterName = useWizardStore((s) => s.setCharacterName);

  function handleGenerate() {
    if (references.length === 0) {
      router.push("/upload");
      return;
    }
    router.push("/generating");
  }

  return (
    <main className="min-h-screen bg-black-cherry-900">
      <Navbar />
      <WizardStepper currentHref="/generation-settings" />

      <section className="mx-auto max-w-3xl px-6 py-14">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-semibold text-nude-blush">Choose Your Results</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-nude-blush/55">
            Set how many versions to generate and how they should be framed.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          <div className="surface-card p-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-nude-blush/50">
              Name This Girl (optional)
            </h3>
            <input
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="e.g. My Main Girl"
              className="w-full rounded-xl border border-nude-blush/20 bg-black-cherry-800/60 px-4 py-3 text-sm text-nude-blush outline-none focus:border-nude-blush"
            />
            <p className="mt-2 text-xs text-nude-blush/40">
              Naming her saves this character to My Girls so you can generate more later.
            </p>
          </div>

          <div className="surface-card p-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-nude-blush/50">
              Number Of Outputs
            </h3>
            <SegmentedControl
              options={OUTPUT_COUNT_OPTIONS.map((n) => ({ value: n, label: String(n) }))}
              value={generationSettings.outputCount}
              onChange={(v) => updateGenerationSettings({ outputCount: v })}
            />
          </div>

          <div className="surface-card p-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-nude-blush/50">
              Framing
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {FRAMING_OPTIONS.map((option) => (
                <SelectableCard
                  key={option.value}
                  label={option.label}
                  selected={generationSettings.framing === option.value}
                  onSelect={() => updateGenerationSettings({ framing: option.value })}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="surface-card p-6">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-nude-blush/50">
                Background
              </h3>
              <div className="space-y-3">
                {BACKGROUND_OPTIONS.map((option) => (
                  <SelectableCard
                    key={option.value}
                    label={option.label}
                    selected={generationSettings.background === option.value}
                    onSelect={() => updateGenerationSettings({ background: option.value })}
                  />
                ))}
              </div>
            </div>
            <div className="surface-card p-6">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-nude-blush/50">
                Wardrobe
              </h3>
              <div className="space-y-3">
                {WARDROBE_OPTIONS.map((option) => (
                  <SelectableCard
                    key={option.value}
                    label={option.label}
                    selected={generationSettings.wardrobe === option.value}
                    onSelect={() => updateGenerationSettings({ wardrobe: option.value })}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="surface-card p-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-nude-blush/50">
              Image Aspect Ratio
            </h3>
            <SegmentedControl
              options={ASPECT_RATIO_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              value={generationSettings.aspectRatio}
              onChange={(v) =>
                updateGenerationSettings({ aspectRatio: v as typeof generationSettings.aspectRatio })
              }
            />
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3">
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => router.push("/lock-traits")}>
              Back
            </Button>
            <Button variant="primary" onClick={handleGenerate}>
              GENERATE HER RESULTS
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
