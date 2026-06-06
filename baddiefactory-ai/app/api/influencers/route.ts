import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseServer";
import { buildIdentityLockFromProfile } from "@/lib/promptBuilder";
import { v4 as uuidv4 } from "uuid";

// GET /api/influencers — list all influencers (dev: no auth required)
export async function GET() {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("influencers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// POST /api/influencers — create a new influencer
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      skin_tone,
      skin_tone_custom,
      body_type,
      body_type_custom,
      hair_style,
      hair_style_custom,
      hair_color,
      hair_color_custom,
      eye_color,
      eye_color_custom,
      aesthetic,
      aesthetic_custom,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Use a demo user ID for development (no auth required)
    const demoUserId = "00000000-0000-0000-0000-000000000001";

    // Ensure demo user exists
    const { error: userError } = await supabase
      .from("users")
      .upsert({ id: demoUserId, email: "demo@baddiefactory.ai" }, { onConflict: "id" });

    if (userError && !userError.message.includes("duplicate")) {
      console.error("User upsert error:", userError);
    }

    const influencerId = uuidv4();

    const { data: influencer, error: infError } = await supabase
      .from("influencers")
      .insert({
        id: influencerId,
        user_id: demoUserId,
        name: name.trim(),
        skin_tone,
        skin_tone_custom,
        body_type,
        body_type_custom,
        hair_style,
        hair_style_custom,
        hair_color,
        hair_color_custom,
        eye_color,
        eye_color_custom,
        aesthetic,
        aesthetic_custom,
      })
      .select()
      .single();

    if (infError) {
      return NextResponse.json({ error: infError.message }, { status: 500 });
    }

    // Auto-create the identity lock
    const identityLock = buildIdentityLockFromProfile(influencer);

    const { error: lockError } = await supabase.from("identity_locks").insert({
      influencer_id: influencerId,
      ...identityLock,
    });

    if (lockError) {
      console.error("Identity lock creation error:", lockError);
    }

    return NextResponse.json(influencer, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
