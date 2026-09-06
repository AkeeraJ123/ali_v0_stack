/**
 * Central check for whether Supabase is actually configured. The app is built
 * to run (in a degraded, clearly-labeled demo mode) even before a Supabase
 * project is wired up, so every call site should branch on this instead of
 * assuming env vars exist.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
