"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";
import type { Database } from "@/lib/types/db";

/**
 * Browser-side Supabase client for use inside client components.
 * Returns null when Supabase env vars are absent so the UI can fall back to
 * demo mode instead of crashing.
 */
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
