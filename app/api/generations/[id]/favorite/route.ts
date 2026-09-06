import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId, unauthorized } = await getRequestUser();
  if (unauthorized || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { favorite } = (await req.json().catch(() => ({}))) as { favorite?: boolean };
  if (typeof favorite !== "boolean") {
    return NextResponse.json({ error: "`favorite` must be a boolean." }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, favorite, demo: true });
  }

  const { error } = await supabase
    .from("generations")
    .update({ favorite })
    .eq("id", params.id)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, favorite });
}
