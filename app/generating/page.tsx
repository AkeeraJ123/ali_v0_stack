"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { GeneratingAnimation } from "@/components/results/GeneratingAnimation";
import { Button } from "@/components/ui/Button";
import { useWizardStore } from "@/lib/wizard/store";
import { runGeneration, uploadReferences } from "@/lib/wizard/runGeneration";

export default function GeneratingPage() {
  const router = useRouter();
  const references = useWizardStore((s) => s.references);
  const bodySettings = useWizardStore((s) => s.bodySettings);
  const lockedTraits = useWizardStore((s) => s.lockedTraits);
  const generationSettings = useWizardStore((s) => s.generationSettings);
  const characterName = useWizardStore((s) => s.characterName);
  const setResults = useWizardStore((s) => s.setResults);
  const setLastBatch = useWizardStore((s) => s.setLastBatch);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  async function runFlow() {
    setError(null);
    try {
      const referenceImages = await uploadReferences(references);
      const response = await runGeneration({
        characterName: characterName.trim() || undefined,
        referenceImages,
        bodySettings,
        lockedTraits,
        generationSettings,
      });
      setResults(response.generations);
      setLastBatch(response.batchId);
      router.replace(`/results/${response.batchId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  useEffect(() => {
    if (references.length === 0) {
      router.replace("/upload");
      return;
    }
    if (started.current) return;
    started.current = true;
    runFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-black-cherry-900">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-6 py-20">
        {error ? (
          <div className="surface-card flex max-w-sm flex-col items-center gap-4 px-8 py-10 text-center">
            <span className="text-3xl">✕</span>
            <h2 className="font-serif text-xl font-semibold text-nude-blush">
              We hit a snag
            </h2>
            <p className="text-sm text-nude-blush/60">{error}</p>
            <div className="mt-2 flex gap-3">
              <Button variant="ghost" onClick={() => router.push("/generation-settings")}>
                Adjust Settings
              </Button>
              <Button variant="primary" onClick={runFlow}>
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <GeneratingAnimation />
        )}
      </div>
    </main>
  );
}
