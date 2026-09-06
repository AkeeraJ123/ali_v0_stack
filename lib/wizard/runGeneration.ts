"use client";

import type { GenerateRequestBody, GenerateResponseBody } from "@/lib/types/results";
import type { WizardReferenceImage } from "./store";

/**
 * Uploads any reference images that haven't already been persisted, then
 * returns the full ordered reference list (primary first) ready to send to
 * /api/generate.
 */
export async function uploadReferences(
  references: WizardReferenceImage[]
): Promise<{ url: string; referenceType: WizardReferenceImage["referenceType"]; position: number }[]> {
  const needUpload = references.filter((r) => !r.storageUrl && r.file);
  const uploadedMap = new Map<string, string>();

  if (needUpload.length) {
    const formData = new FormData();
    needUpload.forEach((r) => formData.append("files", r.file as File));

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "We couldn't upload your reference images.");
    }
    const data = (await res.json()) as { images: { url: string }[] };
    needUpload.forEach((r, i) => uploadedMap.set(r.id, data.images[i]?.url));
  }

  const ordered = [...references].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return a.position - b.position;
  });

  return ordered.map((r) => ({
    url: r.storageUrl ?? uploadedMap.get(r.id) ?? r.previewUrl,
    referenceType: r.referenceType,
    position: r.position,
  }));
}

export async function runGeneration(payload: GenerateRequestBody): Promise<GenerateResponseBody> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "We couldn't generate your results.");
  }

  return res.json();
}
