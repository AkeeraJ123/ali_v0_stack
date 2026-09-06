import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId, unauthorized } = await getRequestUser();
  if (unauthorized || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Not available in demo mode." }, { status: 404 });
  }

  const [{ data: character, error: characterError }, { data: references }, { data: generations }] =
    await Promise.all([
      supabase.from("characters").select("*").eq("id", params.id).eq("user_id", userId).single(),
      supabase
        .from("character_references")
        .select("*")
        .eq("character_id", params.id)
        .order("position", { ascending: true }),
      supabase
        .from("generations")
        .select("*")
        .eq("character_id", params.id)
        .order("created_at", { ascending: false }),
    ]);

  if (characterError || !character) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({ character, references: references ?? [], generations: generations ?? [] });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId, unauthorized } = await getRequestUser();
  if (unauthorized || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = (await req.json().catch(() => ({}))) as { name?: string };
  if (!name?.trim()) {
    return NextResponse.json({ error: "A project name is required." }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, demo: true });
  }

  const { error } = await supabase
    .from("characters")
    .update({ name: name.trim() })
    .eq("id", params.id)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId, unauthorized } = await getRequestUser();
  if (unauthorized || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, demo: true });
  }

  const { error } = await supabase.from("characters").delete().eq("id", params.id).eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
