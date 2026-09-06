import { NextRequest, NextResponse } from "next/server";
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
    return NextResponse.json({ characters: [], demo: true });
  }

  const { data, error } = await supabase
    .from("characters")
    .select("id, name, primary_reference_url, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ characters: data });
}

export async function POST(req: NextRequest) {
  const { userId, unauthorized } = await getRequestUser();
  if (unauthorized || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, primaryReferenceUrl } = (await req.json().catch(() => ({}))) as {
    name?: string;
    primaryReferenceUrl?: string;
  };

  if (!name?.trim()) {
    return NextResponse.json({ error: "A project name is required." }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({
      character: { id: "demo-character", name, primary_reference_url: primaryReferenceUrl ?? null },
      demo: true,
    });
  }

  const { data, error } = await supabase
    .from("characters")
    .insert({ user_id: userId, name: name.trim(), primary_reference_url: primaryReferenceUrl ?? null })
    .select("id, name, primary_reference_url, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ character: data });
}
