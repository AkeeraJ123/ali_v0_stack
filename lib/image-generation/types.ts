import type { BodySettings, LockedTraits, GenerationSettings } from "@/lib/types/db";

export interface ReferenceImageInput {
  url: string;
  referenceType: "front" | "side" | "back" | "face" | "other";
  position: number;
}

/**
 * Everything the provider layer needs to produce a body transformation.
 * `instructions` is the hidden, server-built system instruction set — it is
 * never sent to the browser and never rendered as a user-facing "prompt".
 */
export interface GenerateBodyTransformationInput {
  referenceImages: ReferenceImageInput[];
  bodySettings: BodySettings;
  lockedTraits: LockedTraits;
  generationSettings: Pick<
    GenerationSettings,
    "framing" | "background" | "wardrobe" | "aspectRatio"
  >;
  outputCount: 1 | 2 | 4;
  instructions: string;
  /** Present when this call is a Page 8 refinement of a prior result. */
  refinementOf?: {
    generatedImageUrl: string;
    adjustmentInstructions: string;
  };
}

export interface GeneratedImageResult {
  url: string;
  width?: number;
  height?: number;
}

export interface GenerateBodyTransformationResult {
  images: GeneratedImageResult[];
  provider: string;
  /** Opaque provider-side job/request id, useful for support debugging. */
  providerRequestId?: string;
}

export interface ImageGenerationProvider {
  /** Machine name stored on `generations.generation_provider`. */
  readonly name: string;
  generateBodyTransformation(
    input: GenerateBodyTransformationInput
  ): Promise<GenerateBodyTransformationResult>;
}
