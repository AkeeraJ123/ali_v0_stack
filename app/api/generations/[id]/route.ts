import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId, unauthorized } = await getRequestUser();
  if (unauthorized || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, demo: true });
  }

  // RLS scopes this delete to rows owned by the current user.
  const { error } = await supabase.from("generations").delete().eq("id", params.id).eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
