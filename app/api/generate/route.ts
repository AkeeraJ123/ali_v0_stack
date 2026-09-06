import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { checkRateLimit } from "@/lib/utils/rateLimit";
import { generateBodyTransformation } from "@/lib/image-generation/provider";
import {
  buildAdjustmentInstructions,
  buildTransformationInstructions,
} from "@/lib/instructions/buildTransformationInstructions";
import type { GenerateRequestBody, GenerateResponseBody, GenerationResultItem } from "@/lib/types/results";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { userId, unauthorized } = await getRequestUser();
  if (unauthorized || !userId) {
    return NextResponse.json(
      { error: "You must be logged in to generate results." },
      { status: 401 }
    );
  }

  const rate = checkRateLimit(`generate:${userId}`, { limit: 12, windowMs: 60_000 });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "You're generating too quickly. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  let body: GenerateRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.referenceImages?.length && !body.refinementOf) {
    return NextResponse.json(
      { error: "At least one reference image is required." },
      { status: 400 }
    );
  }

  const outputCount = body.generationSettings?.outputCount ?? 1;
  const supabase = isSupabaseConfigured ? await createClient() : null;

  // --- Credit check (only enforced once real persistence is configured) ---
  if (supabase) {
    const { data: credits } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", userId)
      .maybeSingle();

    if (credits && credits.balance < outputCount) {
      return NextResponse.json(
        { error: "You don't have enough credits for this generation." },
        { status: 402 }
      );
    }
  }

  const instructions = body.refinementOf
    ? buildAdjustmentInstructions(
        buildTransformationInstructions(body.bodySettings, body.lockedTraits, body.generationSettings),
        body.refinementOf.adjustmentInstructions
      )
    : buildTransformationInstructions(body.bodySettings, body.lockedTraits, body.generationSettings);

  let providerResult;
  try {
    providerResult = await generateBodyTransformation({
      referenceImages: body.referenceImages,
      bodySettings: body.bodySettings,
      lockedTraits: body.lockedTraits,
      generationSettings: body.generationSettings,
      outputCount,
      instructions,
      refinementOf: body.refinementOf,
    });
  } catch (err) {
    console.error("Image generation failed", err);
    return NextResponse.json(
      { error: "We couldn't generate your results. Please try again in a moment." },
      { status: 502 }
    );
  }

  const sourceUrl =
    body.refinementOf?.generatedImageUrl ?? body.referenceImages[0]?.url ?? "";

  // --- Demo mode: no persistence, just hand back the generated images ---
  if (!supabase) {
    const generations: GenerationResultItem[] = providerResult.images.map((img) => ({
      id: randomUUID(),
      sourceUrl,
      generatedUrl: img.url,
      favorite: false,
    }));

    const response: GenerateResponseBody = {
      batchId: randomUUID(),
      characterId: null,
      bodySessionId: null,
      provider: providerResult.provider,
      generations,
    };
    return NextResponse.json(response);
  }

  // --- Persisted mode ---
  let characterId = body.characterId ?? null;

  if (!characterId && body.characterName) {
    const { data: character, error: characterError } = await supabase
      .from("characters")
      .insert({
        user_id: userId,
        name: body.characterName,
        primary_reference_url: body.referenceImages[0]?.url ?? null,
      })
      .select("id")
      .single();

    if (characterError) {
      console.error("Failed to create character", characterError);
    } else {
      characterId = character.id;
      const refRows = body.referenceImages.map((ref) => ({
        character_id: character.id,
        image_url: ref.url,
        position: ref.position,
        reference_type: ref.referenceType,
      }));
      await supabase.from("character_references").insert(refRows);
    }
  }

  const { data: bodySession, error: sessionError } = await supabase
    .from("body_sessions")
    .insert({
      user_id: userId,
      character_id: characterId,
      body_settings_json: body.bodySettings,
      locked_traits_json: body.lockedTraits,
      status: "completed",
    })
    .select("id")
    .single();

  if (sessionError) {
    console.error("Failed to create body session", sessionError);
  }

  const bodySessionId = bodySession?.id ?? null;

  const generationRows = providerResult.images.map((img) => ({
    id: randomUUID(),
    user_id: userId,
    character_id: characterId,
    body_session_id: bodySessionId,
    source_image_url: sourceUrl,
    generated_image_url: img.url,
    generation_provider: providerResult.provider,
    status: "completed" as const,
    favorite: false,
  }));

  const { data: insertedGenerations, error: generationsError } = await supabase
    .from("generations")
    .insert(generationRows)
    .select("id, source_image_url, generated_image_url, favorite");

  if (generationsError) {
    console.error("Failed to persist generations", generationsError);
    return NextResponse.json(
      { error: "Your images were generated but we couldn't save them. Please try again." },
      { status: 500 }
    );
  }

  await supabase.from("generation_events").insert(
    insertedGenerations.map((g) => ({
      generation_id: g.id,
      event_type: "generated",
      metadata_json: { provider: providerResult.provider, providerRequestId: providerResult.providerRequestId ?? null },
    }))
  );

  const { data: currentCredits } = await supabase
    .from("credits")
    .select("balance")
    .eq("user_id", userId)
    .maybeSingle();

  if (currentCredits) {
    await supabase
      .from("credits")
      .update({ balance: Math.max(0, currentCredits.balance - outputCount), updated_at: new Date().toISOString() })
      .eq("user_id", userId);
  }

  const response: GenerateResponseBody = {
    batchId: bodySessionId ?? randomUUID(),
    characterId,
    bodySessionId,
    provider: providerResult.provider,
    generations: insertedGenerations.map((g) => ({
      id: g.id,
      sourceUrl: g.source_image_url,
      generatedUrl: g.generated_image_url ?? "",
      favorite: g.favorite,
    })),
  };

  return NextResponse.json(response);
}
