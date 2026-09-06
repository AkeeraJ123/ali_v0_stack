import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const DEMO_USER_ID = "demo-user";

export interface RequestUserResult {
  userId: string | null;
  isDemo: boolean;
  unauthorized: boolean;
}

/**
 * Resolves the acting user for an API route. When Supabase is configured,
 * a real session is required — no session means unauthorized. When Supabase
 * is not configured (local/demo environments with no env vars set), requests
 * fall back to a single demo identity so the product can still be exercised
 * end-to-end without a database.
 */
export async function getRequestUser(): Promise<RequestUserResult> {
  if (!isSupabaseConfigured) {
    return { userId: DEMO_USER_ID, isDemo: true, unauthorized: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) {
    return { userId: null, isDemo: false, unauthorized: true };
  }

  return { userId: user.id, isDemo: false, unauthorized: false };
}
