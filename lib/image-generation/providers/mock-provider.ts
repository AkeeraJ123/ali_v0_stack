import "server-only";
import type {
  GenerateBodyTransformationInput,
  GenerateBodyTransformationResult,
  ImageGenerationProvider,
} from "../types";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Demo/development provider. No real image editing model is wired up yet, so
 * this echoes back the identity-anchor reference image(s) instead of
 * fabricating a stock photo — it never invents a different woman. Swap in a
 * real provider (see providers/replicate-provider.ts) by setting
 * IMAGE_GENERATION_PROVIDER in the environment.
 */
export class MockImageGenerationProvider implements ImageGenerationProvider {
  readonly name = "mock";

  async generateBodyTransformation(
    input: GenerateBodyTransformationInput
  ): Promise<GenerateBodyTransformationResult> {
    await wait(400);

    const source =
      input.refinementOf?.generatedImageUrl ??
      input.referenceImages[0]?.url ??
      "";

    const images = Array.from({ length: input.outputCount }, () => ({
      url: source,
    }));

    return {
      images,
      provider: this.name,
      providerRequestId: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    };
  }
}
