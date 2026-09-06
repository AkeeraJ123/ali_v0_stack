import "server-only";
import type {
  GenerateBodyTransformationInput,
  GenerateBodyTransformationResult,
  ImageGenerationProvider,
} from "../types";

const REPLICATE_API_URL = "https://api.replicate.com/v1/predictions";

/**
 * Production provider stub for a reference-conditioned image-editing model
 * hosted on Replicate (e.g. a Flux Kontext / image-to-image edit model that
 * accepts one or more input images plus an instruction string). Wire this up
 * by:
 *
 *   1. Setting REPLICATE_API_TOKEN and REPLICATE_MODEL_VERSION in the server
 *      environment (never exposed to the client).
 *   2. Confirming the chosen model's actual input schema (image field names,
 *      whether it accepts multiple reference images, aspect ratio param
 *      names, etc.) and adjusting `buildInput` below to match.
 *   3. Setting IMAGE_GENERATION_PROVIDER=replicate.
 *
 * The rest of the app (UI, API routes, DB writes) never changes — it only
 * talks to the ImageGenerationProvider interface.
 */
export class ReplicateImageGenerationProvider implements ImageGenerationProvider {
  readonly name = "replicate";

  private get apiToken() {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      throw new Error(
        "REPLICATE_API_TOKEN is not set. Configure it before using the replicate provider."
      );
    }
    return token;
  }

  private get modelVersion() {
    const version = process.env.REPLICATE_MODEL_VERSION;
    if (!version) {
      throw new Error(
        "REPLICATE_MODEL_VERSION is not set. Configure it before using the replicate provider."
      );
    }
    return version;
  }

  private buildInput(input: GenerateBodyTransformationInput) {
    const primaryImage =
      input.refinementOf?.generatedImageUrl ?? input.referenceImages[0]?.url;
    const instructions = input.refinementOf
      ? input.refinementOf.adjustmentInstructions
      : input.instructions;

    return {
      input_image: primaryImage,
      reference_images: input.referenceImages.map((r) => r.url),
      prompt: instructions,
      aspect_ratio: input.generationSettings.aspectRatio,
      num_outputs: input.outputCount,
    };
  }

  async generateBodyTransformation(
    input: GenerateBodyTransformationInput
  ): Promise<GenerateBodyTransformationResult> {
    const response = await fetch(REPLICATE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Token ${this.apiToken}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        version: this.modelVersion,
        input: this.buildInput(input),
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Replicate request failed (${response.status}): ${body}`);
    }

    const prediction = (await response.json()) as {
      id: string;
      status: string;
      output: string[] | string | null;
    };

    if (prediction.status === "failed" || prediction.status === "canceled") {
      throw new Error(`Replicate prediction ${prediction.status}: ${prediction.id}`);
    }

    const output = prediction.output;
    const urls = Array.isArray(output) ? output : output ? [output] : [];

    if (urls.length === 0) {
      throw new Error("Replicate prediction returned no output images.");
    }

    return {
      images: urls.map((url) => ({ url })),
      provider: this.name,
      providerRequestId: prediction.id,
    };
  }
}
