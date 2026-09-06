import "server-only";
import type {
  GenerateBodyTransformationInput,
  GenerateBodyTransformationResult,
  ImageGenerationProvider,
} from "./types";
import { MockImageGenerationProvider } from "./providers/mock-provider";
import { ReplicateImageGenerationProvider } from "./providers/replicate-provider";

/**
 * Single point of contact between the app and whichever image generation
 * backend is configured. Nothing outside this file (API routes, components,
 * pages) should ever import a concrete provider class or know how the
 * transformation is actually produced — that keeps provider logic out of the
 * UI entirely, so swapping models later is a one-line env change.
 */
function createProvider(): ImageGenerationProvider {
  const providerName = process.env.IMAGE_GENERATION_PROVIDER ?? "mock";

  switch (providerName) {
    case "replicate":
      return new ReplicateImageGenerationProvider();
    case "mock":
    default:
      return new MockImageGenerationProvider();
  }
}

let cachedProvider: ImageGenerationProvider | null = null;

export function getImageProvider(): ImageGenerationProvider {
  if (!cachedProvider) {
    cachedProvider = createProvider();
  }
  return cachedProvider;
}

export async function generateBodyTransformation(
  input: GenerateBodyTransformationInput
): Promise<GenerateBodyTransformationResult> {
  return getImageProvider().generateBodyTransformation(input);
}

export type {
  GenerateBodyTransformationInput,
  GenerateBodyTransformationResult,
  ImageGenerationProvider,
  ReferenceImageInput,
  GeneratedImageResult,
} from "./types";
