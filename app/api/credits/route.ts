import { NextResponse } from "next/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const { userId, unauthorized, isDemo } = await getRequestUser();
  if (unauthorized || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isDemo) {
    return NextResponse.json({ balance: 5, plan: "Demo", demo: true });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ balance: 0, plan: "Free", demo: true });
  }

  const { data, error } = await supabase
    .from("credits")
    .select("balance, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ balance: data?.balance ?? 0, plan: "Free" });
}
