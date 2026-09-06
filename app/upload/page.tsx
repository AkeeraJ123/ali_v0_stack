"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { WizardStepper } from "@/components/layout/WizardStepper";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { ReferenceImageCard } from "@/components/upload/ReferenceImageCard";
import { Button } from "@/components/ui/Button";
import { useWizardStore } from "@/lib/wizard/store";
import { validateReferenceCount } from "@/lib/utils/validation";

export default function UploadPage() {
  const router = useRouter();
  const references = useWizardStore((s) => s.references);
  const addReferences = useWizardStore((s) => s.addReferences);
  const removeReference = useWizardStore((s) => s.removeReference);
  const reorderReferences = useWizardStore((s) => s.reorderReferences);
  const setPrimary = useWizardStore((s) => s.setPrimary);
  const [error, setError] = useState<string | null>(null);

  const sorted = [...references].sort((a, b) => a.position - b.position);

  function handleContinue() {
    const result = validateReferenceCount(references.length);
    if (!result.valid) {
      setError(result.error ?? "Please upload at least one image.");
      return;
    }
    router.push("/consultation");
  }

  return (
    <main className="min-h-screen bg-black-cherry-900">
      <Navbar />
      <WizardStepper currentHref="/upload" />

      <section className="mx-auto max-w-4xl px-6 py-14">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-semibold text-nude-blush">Upload Your Girl</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-nude-blush/55">
            Start with the character you already created. Your uploaded references become the
            identity anchor for the transformation.
          </p>
        </div>

        <div className="mt-10">
          <UploadDropzone
            disabled={references.length >= 5}
            onFilesAccepted={(files) => {
              setError(null);
              addReferences(files);
            }}
            onError={(msg) => setError(msg)}
          />
          {error && <p className="mt-3 text-center text-xs text-red-300">{error}</p>}
          <p className="mt-4 text-center text-xs text-nude-blush/40">
            Recommended: front view, side view, back view, and a close-up face reference.
            Upload 1–5 images.
          </p>
        </div>

        {sorted.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {sorted.map((ref, i) => (
              <ReferenceImageCard
                key={ref.id}
                reference={ref}
                index={i}
                total={sorted.length}
                onRemove={() => removeReference(ref.id)}
                onMoveLeft={() => i > 0 && reorderReferences(i, i - 1)}
                onMoveRight={() => i < sorted.length - 1 && reorderReferences(i, i + 1)}
                onSetPrimary={() => setPrimary(ref.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-14 flex flex-col items-center gap-3">
          <Button variant="primary" onClick={handleContinue}>
            CONTINUE TO CONSULTATION
          </Button>
          <p className="max-w-md text-center text-[11px] leading-relaxed text-nude-blush/35">
            Your reference images are used to create your requested results and remain private
            to your account.
          </p>
        </div>
      </section>
    </main>
  );
}
