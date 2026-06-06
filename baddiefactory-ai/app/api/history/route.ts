import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const influencerId = searchParams.get("influencer");

  const supabase = createServiceClient();

  let query = supabase
    .from("generated_prompts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (influencerId) {
    query = query.eq("influencer_id", influencerId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}
