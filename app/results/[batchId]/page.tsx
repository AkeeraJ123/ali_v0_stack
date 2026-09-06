"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { ComparisonSlider } from "@/components/results/ComparisonSlider";
import { ResultCard } from "@/components/results/ResultCard";
import { useWizardStore } from "@/lib/wizard/store";

export default function ResultsPage() {
  const params = useParams<{ batchId: string }>();
  const router = useRouter();
  const results = useWizardStore((s) => s.results);
  const lastBatchId = useWizardStore((s) => s.lastBatchId);
  const toggleFavorite = useWizardStore((s) => s.toggleFavorite);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [compareMode, setCompareMode] = useState(true);

  const isCurrentBatch = lastBatchId === params.batchId && results.length > 0;
  const selected = results[selectedIndex];

  if (!isCurrentBatch || !selected) {
    return (
      <main className="min-h-screen bg-black-cherry-900">
        <Navbar />
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-28 text-center">
          <h1 className="font-serif text-2xl font-semibold text-nude-blush">
            This session has expired
          </h1>
          <p className="text-sm text-nude-blush/55">
            We don&apos;t keep unsaved results in memory across page reloads yet. Start a new
            transformation to continue.
          </p>
          <Button href="/upload" variant="primary" className="mt-2">
            START A NEW TRANSFORMATION
          </Button>
        </div>
      </main>
    );
  }

  async function handleToggleFavorite(id: string) {
    toggleFavorite(id);
    try {
      const item = results.find((r) => r.id === id);
      await fetch(`/api/generations/${id}/favorite`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: !item?.favorite }),
      });
    } catch {
      // Non-fatal — favorite state still reflects locally.
    }
  }

  return (
    <main className="min-h-screen bg-black-cherry-900">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-14">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-semibold text-nude-blush">
            Your Rich Girl Bodied Results
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-nude-blush/55">
            Compare, favorite, and refine before you save or download.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setCompareMode((v) => !v)}
            className="btn-secondary !px-5 !py-2 text-xs"
          >
            {compareMode ? "VIEW RESULT ONLY" : "COMPARE ORIGINAL ↔ TRANSFORMED"}
          </button>
        </div>

        <div className="mx-auto mt-6 max-w-md">
          {compareMode ? (
            <ComparisonSlider beforeUrl={selected.sourceUrl} afterUrl={selected.generatedUrl} />
          ) : (
            <div className="surface-card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selected.generatedUrl}
                alt="Generated result"
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
          )}
        </div>

        {results.length > 1 && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {results.map((result, i) => (
              <ResultCard
                key={result.id}
                imageUrl={result.generatedUrl}
                index={i}
                selected={i === selectedIndex}
                favorite={result.favorite}
                onSelect={() => setSelectedIndex(i)}
                onToggleFavorite={() => handleToggleFavorite(result.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Button variant="secondary" onClick={() => router.push("/generating")}>
            REGENERATE
          </Button>
          <Button variant="secondary" onClick={() => router.push(`/adjust/${selected.id}`)}>
            ADJUST BODY
          </Button>
          <Button variant="secondary" onClick={() => handleToggleFavorite(selected.id)}>
            {selected.favorite ? "♥ FAVORITED" : "♡ SAVE AS FAVORITE"}
          </Button>
          <a
            href={selected.generatedUrl}
            download={`rich-girl-bodied-${selected.id}.png`}
            className="btn-secondary"
          >
            DOWNLOAD
          </a>
          <Button variant="primary" onClick={() => router.push("/consultation")}>
            GENERATE ANOTHER VARIATION
          </Button>
        </div>
      </section>
    </main>
  );
}
