import "server-only";
import type { BodySettings, GenerationSettings, LockedTraits } from "@/lib/types/db";
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

function labelFor(options: { value: string; label: string }[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}

/**
 * Builds the hidden, backend-only instruction set passed to the image
 * generation provider. This is internal system logic — it is never returned
 * to the client and never rendered in the UI as a "prompt". The user only
 * ever sees generated images, not this text.
 */
export function buildTransformationInstructions(
  bodySettings: BodySettings,
  lockedTraits: LockedTraits,
  generationSettings: Pick<
    GenerationSettings,
    "framing" | "background" | "wardrobe" | "aspectRatio"
  >
): string {
  const lines: string[] = [];

  lines.push(
    "Use the uploaded reference image(s) as the identity anchor for this person. Do not replace her with a different woman."
  );
  lines.push("Preserve facial identity and bone structure exactly as shown in the references.");
  lines.push(
    "Preserve the subject's complexion, skin undertones, and melanin depth exactly. Never lighten, brighten, grey-wash, or desaturate her skin. Keep face-to-body skin tone fully consistent."
  );
  lines.push("Preserve natural, visible skin texture. Avoid plastic, waxy, or over-smoothed skin.");

  const lockLines: string[] = [];
  if (lockedTraits.face) lockLines.push("face");
  if (lockedTraits.skinTone) lockLines.push("skin tone");
  if (lockedTraits.hairstyle) lockLines.push("hairstyle");
  if (lockedTraits.makeup) lockLines.push("makeup");
  if (lockedTraits.tattoos) lockLines.push("tattoos");
  if (lockedTraits.outfit) lockLines.push("outfit/clothing");
  if (lockedTraits.jewelry) lockLines.push("jewelry");
  if (lockedTraits.nails) lockLines.push("nails");
  if (lockedTraits.accessories) lockLines.push("accessories");
  if (lockLines.length) {
    lines.push(`Keep these visual traits unchanged from the reference: ${lockLines.join(", ")}.`);
  }

  lines.push(
    `Apply only the following body direction: ${labelFor(
      OVERALL_BODY_DIRECTIONS,
      bodySettings.overallDirection
    )}.`
  );
  lines.push(`Waist: ${labelFor(WAIST_OPTIONS, bodySettings.waist)}.`);
  lines.push(`Hips: ${labelFor(HIPS_OPTIONS, bodySettings.hips)}.`);
  lines.push(`Thighs: ${labelFor(THIGHS_OPTIONS, bodySettings.thighs)}.`);
  lines.push(`Bust: ${labelFor(BUST_OPTIONS, bodySettings.bust)}.`);
  lines.push(`Glutes: ${labelFor(GLUTES_OPTIONS, bodySettings.glutes)}.`);
  lines.push(`Stomach: ${labelFor(STOMACH_OPTIONS, bodySettings.stomach)}.`);
  lines.push(
    `Overall proportion balance: ${labelFor(
      PROPORTION_BALANCE_OPTIONS,
      bodySettings.proportionBalance
    )}.`
  );
  lines.push(`Realism level: ${labelFor(REALISM_LEVEL_OPTIONS, bodySettings.realismLevel)}.`);

  if (bodySettings.customNotes?.trim()) {
    lines.push(`Additional creator notes to incorporate carefully: "${bodySettings.customNotes.trim()}".`);
  }

  lines.push(
    "Change only the requested body characteristics. Do not alter facial identity or any locked trait beyond what is explicitly requested."
  );
  lines.push(
    "Maintain realistic human anatomy: correct proportions, natural hand anatomy, no duplicated or fused limbs, no floating accessories, no broken or warped clothing."
  );
  lines.push("Maintain realistic fabric behavior and correct, natural lighting consistent with the source image.");

  if (generationSettings.wardrobe === "preserve-outfit" || generationSettings.wardrobe === "keep-outfit-locked") {
    lines.push("Preserve the original outfit exactly rather than inventing new wardrobe.");
  }
  if (generationSettings.background === "preserve-original") {
    lines.push("Preserve the original background from the reference image.");
  } else if (generationSettings.background === "clean-studio") {
    lines.push("Replace the background with a clean, neutral studio backdrop; do not let it affect skin tone rendering.");
  } else if (generationSettings.background === "transparent-neutral") {
    lines.push("Render against a transparent or minimal neutral background if supported.");
  }

  lines.push(`Framing: ${generationSettings.framing.replace(/-/g, " ")}.`);
  lines.push(`Target aspect ratio: ${generationSettings.aspectRatio}.`);
  lines.push("Produce a polished, photographic result suitable for a premium beauty/lifestyle brand.");

  return lines.join(" ");
}

export function buildAdjustmentInstructions(baseInstructions: string, adjustmentText: string): string {
  return `${baseInstructions} Refine the most recent result with this additional adjustment while preserving everything else already locked: "${adjustmentText.trim()}".`;
}
