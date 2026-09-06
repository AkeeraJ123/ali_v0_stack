import { NextResponse } from "next/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const { userId, unauthorized } = await getRequestUser();
  if (unauthorized || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ generations: [], demo: true });
  }

  const { data, error } = await supabase
    .from("generations")
    .select("id, character_id, source_image_url, generated_image_url, status, favorite, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ generations: data });
}
