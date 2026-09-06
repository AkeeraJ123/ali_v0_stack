"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { useWizardStore } from "@/lib/wizard/store";
import { runGeneration, uploadReferences } from "@/lib/wizard/runGeneration";
import { ADJUSTMENT_OPTIONS } from "@/lib/constants/bodyOptions";

export default function AdjustResultPage() {
  const params = useParams<{ generationId: string }>();
  const router = useRouter();
  const results = useWizardStore((s) => s.results);
  const references = useWizardStore((s) => s.references);
  const bodySettings = useWizardStore((s) => s.bodySettings);
  const lockedTraits = useWizardStore((s) => s.lockedTraits);
  const generationSettings = useWizardStore((s) => s.generationSettings);
  const characterName = useWizardStore((s) => s.characterName);
  const setResults = useWizardStore((s) => s.setResults);
  const setLastBatch = useWizardStore((s) => s.setLastBatch);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const target = results.find((r) => r.id === params.generationId);

  if (!target) {
    return (
      <main className="min-h-screen bg-black-cherry-900">
        <Navbar />
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-28 text-center">
          <h1 className="font-serif text-2xl font-semibold text-nude-blush">
            We couldn&apos;t find that result
          </h1>
          <p className="text-sm text-nude-blush/55">
            Head back to your results to pick an image to refine.
          </p>
          <Button href="/upload" variant="primary" className="mt-2">
            START A NEW TRANSFORMATION
          </Button>
        </div>
      </main>
    );
  }

  function toggleTag(value: string) {
    setSelectedTags((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  }

  async function handleApply() {
    const tagLabels = ADJUSTMENT_OPTIONS.filter((o) => selectedTags.includes(o.value)).map(
      (o) => o.label
    );
    const combined = [...tagLabels, freeText.trim()].filter(Boolean).join("; ");

    if (!combined) {
      setError("Choose at least one adjustment or describe what to refine.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const referenceImages = await uploadReferences(references);
      const response = await runGeneration({
        characterName: characterName.trim() || undefined,
        referenceImages,
        bodySettings,
        lockedTraits,
        generationSettings: { ...generationSettings, outputCount: 1 },
        refinementOf: {
          generatedImageUrl: target!.generatedUrl,
          adjustmentInstructions: combined,
        },
      });
      setResults(response.generations);
      setLastBatch(response.batchId);
      router.push(`/results/${response.batchId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't apply that adjustment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black-cherry-900">
      <Navbar />

      <section className="mx-auto max-w-2xl px-6 py-14">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-semibold text-nude-blush">Adjust Result</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-nude-blush/55">
            Refine this result without starting over. We&apos;ll use it as the new reference
            while keeping her identity locked.
          </p>
        </div>

        <div className="surface-card mt-10 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={target.generatedUrl}
            alt="Current result"
            className="aspect-[3/4] w-full object-cover"
          />
        </div>

        <div className="surface-card mt-6 p-6">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-nude-blush/50">
            Quick Adjustments
          </h3>
          <div className="flex flex-wrap gap-2">
            {ADJUSTMENT_OPTIONS.map((option) => (
              <Pill
                key={option.value}
                label={option.label}
                selected={selectedTags.includes(option.value)}
                onSelect={() => toggleTag(option.value)}
              />
            ))}
          </div>
        </div>

        <div className="surface-card mt-6 p-6">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-nude-blush/50">
            Tell Coach Akeera Exactly What To Refine
          </h3>
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            rows={4}
            maxLength={400}
            placeholder="e.g. Soften the waist slightly and keep everything else the same…"
            className="w-full rounded-xl border border-nude-blush/20 bg-black-cherry-800/60 px-4 py-3 text-sm text-nude-blush outline-none focus:border-nude-blush"
          />
        </div>

        {error && <p className="mt-4 text-center text-xs text-red-300">{error}</p>}

        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => router.back()}>
              Back
            </Button>
            <Button variant="primary" onClick={handleApply} disabled={loading}>
              {loading ? "REFINING…" : "APPLY ADJUSTMENT"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
