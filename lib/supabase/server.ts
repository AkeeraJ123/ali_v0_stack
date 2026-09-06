import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";
import type { Database } from "@/lib/types/db";

/**
 * Server-side Supabase client for use inside Server Components, Route
 * Handlers, and Server Actions. Reads/writes the auth cookie so the logged-in
 * user's session is available to RLS-scoped queries.
 */
export async function createClient() {
  if (!isSupabaseConfigured) return null;
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component with no request/response to mutate.
          // Middleware refreshes the session cookie, so this is safe to ignore.
        }
      },
    },
  });
}
