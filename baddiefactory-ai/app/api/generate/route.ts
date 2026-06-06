import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseServer";
import { buildFullPrompt, CONTENT_PACK_CONFIGS, getSeedFromIdentity } from "@/lib/promptBuilder";
import { generateImage } from "@/lib/nanoBanana";
import { v4 as uuidv4 } from "uuid";
import type { PromptBuilderState } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: PromptBuilderState = await req.json();

    const {
      influencer_id,
      content_pack,
      outfit,
      location,
      pose,
      camera_style,
      mood,
      custom_pack_name,
      custom_prompt_additions,
    } = body;

    if (!influencer_id) {
      return NextResponse.json({ error: "influencer_id is required" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Fetch influencer
    const { data: influencer, error: infError } = await supabase
      .from("influencers")
      .select("*")
      .eq("id", influencer_id)
      .single();

    if (infError) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    // Fetch identity lock
    const { data: identity, error: identError } = await supabase
      .from("identity_locks")
      .select("*")
      .eq("influencer_id", influencer_id)
      .single();

    if (identError || !identity) {
      return NextResponse.json(
        { error: "Identity lock not found. Please re-create this model." },
        { status: 404 }
      );
    }

    const packConfig = CONTENT_PACK_CONFIGS[content_pack];

    // Build the full prompt using identity lock
    let fullPrompt = buildFullPrompt(body, identity, packConfig);

    // Append custom additions if provided
    if (custom_prompt_additions?.trim()) {
      fullPrompt += `, ${custom_prompt_additions}`;
    }

    // Generate image via Nano Banana Pro
    const seed = getSeedFromIdentity(identity);
    const generationResult = await generateImage({
      prompt: fullPrompt,
      negative_prompt:
        "cartoon, anime, 3d render, blurry, low quality, watermark, text overlay, deformed, ugly, bad anatomy, minors, underage, childlike, young-looking, teenager",
      width: 768,
      height: 1024,
      steps: 30,
      guidance_scale: 7.5,
      seed,
    });

    const demoUserId = "00000000-0000-0000-0000-000000000001";
    const promptId = uuidv4();

    // Save the generated prompt record
    const { data: savedPrompt, error: saveError } = await supabase
      .from("generated_prompts")
      .insert({
        id: promptId,
        influencer_id,
        user_id: influencer.user_id || demoUserId,
        content_pack,
        custom_pack_name,
        outfit: outfit || packConfig.defaultOutfit,
        location: location || packConfig.defaultLocation,
        pose: pose || packConfig.defaultPose,
        camera_style,
        mood: mood || packConfig.defaultMood,
        custom_prompt_additions,
        full_prompt: fullPrompt,
        image_url: generationResult.image_url || null,
        generation_id: generationResult.id,
        status: generationResult.status === "complete" ? "complete" : "pending",
      })
      .select()
      .single();

    if (saveError) {
      console.error("Failed to save prompt:", saveError);
    }

    // Update identity lock with the first reference image if not set
    if (generationResult.image_url && !identity.reference_image_url) {
      await supabase
        .from("identity_locks")
        .update({ reference_image_url: generationResult.image_url })
        .eq("influencer_id", influencer_id);

      // Also update influencer avatar
      await supabase
        .from("influencers")
        .update({ avatar_url: generationResult.image_url })
        .eq("id", influencer_id);
    }

    return NextResponse.json(savedPrompt || {
      id: promptId,
      influencer_id,
      content_pack,
      outfit,
      location,
      pose,
      camera_style,
      mood,
      full_prompt: fullPrompt,
      image_url: generationResult.image_url,
      status: generationResult.status,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
