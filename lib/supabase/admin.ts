import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "./env";
import type { Database } from "@/lib/types/db";

/**
 * Service-role Supabase client. Bypasses Row Level Security — never import
 * this from client components, and never expose SUPABASE_SERVICE_ROLE_KEY to
 * the browser. Used only inside server-only API routes that need to write
 * generation results on the user's behalf (e.g. after a webhook callback).
 */
export function createAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
