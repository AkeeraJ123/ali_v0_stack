"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const configured = Boolean(supabase);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError(
        "Supabase isn't configured yet in this environment. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable accounts."
      );
      return;
    }

    setLoading(true);
    const { error: authError } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    router.push("/upload");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card w-full max-w-sm px-8 py-10">
      <h1 className="font-serif text-2xl font-semibold text-nude-blush">
        {mode === "login" ? "Welcome Back" : "Create Your Account"}
      </h1>
      <p className="mt-2 text-sm text-nude-blush/50">
        {mode === "login"
          ? "Log in to continue your girl's transformation."
          : "Save your characters and generations to your own private account."}
      </p>

      <div className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-nude-blush/50">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-nude-blush/20 bg-black-cherry-800/60 px-4 py-3 text-sm text-nude-blush outline-none focus:border-nude-blush"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-nude-blush/50">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-nude-blush/20 bg-black-cherry-800/60 px-4 py-3 text-sm text-nude-blush outline-none focus:border-nude-blush"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && <p className="mt-4 text-xs text-red-300">{error}</p>}
      {!configured && (
        <p className="mt-4 text-xs text-nude-blush/40">
          Demo mode: authentication is disabled until Supabase env vars are set.
        </p>
      )}

      <Button type="submit" disabled={loading} className="mt-8 w-full">
        {loading ? "Please wait…" : mode === "login" ? "LOG IN" : "CREATE ACCOUNT"}
      </Button>
    </form>
  );
}
