import type { NanoBananaRequest, NanoBananaResponse } from "@/types";

const NANO_BANANA_API_URL =
  process.env.NANO_BANANA_API_URL || "https://api.nanobanana.pro/v1";
const NANO_BANANA_API_KEY = process.env.NANO_BANANA_API_KEY;

export async function generateImage(
  request: NanoBananaRequest
): Promise<NanoBananaResponse> {
  if (!NANO_BANANA_API_KEY) {
    // Return a mock response when API key is not configured
    return {
      id: `mock-${Date.now()}`,
      status: "complete",
      image_url: `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/768/1024`,
    };
  }

  try {
    const response = await fetch(`${NANO_BANANA_API_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NANO_BANANA_API_KEY}`,
        "X-API-Key": NANO_BANANA_API_KEY,
      },
      body: JSON.stringify({
        prompt: request.prompt,
        negative_prompt: request.negative_prompt || "cartoon, anime, 3d render, blurry, low quality, watermark, text, deformed, ugly, minors, underage",
        width: request.width || 768,
        height: request.height || 1024,
        steps: request.steps || 30,
        guidance_scale: request.guidance_scale || 7.5,
        seed: request.seed,
        model: "realism",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Nano Banana API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return {
      id: data.id || data.job_id,
      status: data.status || "pending",
      image_url: data.image_url || data.output_url,
    };
  } catch (error) {
    console.error("Nano Banana generation error:", error);
    return {
      id: `error-${Date.now()}`,
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function checkGenerationStatus(
  jobId: string
): Promise<NanoBananaResponse> {
  if (!NANO_BANANA_API_KEY || jobId.startsWith("mock-")) {
    return {
      id: jobId,
      status: "complete",
      image_url: `https://picsum.photos/seed/${jobId.replace("mock-", "")}/768/1024`,
    };
  }

  try {
    const response = await fetch(`${NANO_BANANA_API_URL}/status/${jobId}`, {
      headers: {
        Authorization: `Bearer ${NANO_BANANA_API_KEY}`,
        "X-API-Key": NANO_BANANA_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return {
      id: jobId,
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
