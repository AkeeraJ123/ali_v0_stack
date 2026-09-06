import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function AccountPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="min-h-screen bg-black-cherry-900">
        <Navbar />
        <section className="mx-auto max-w-2xl px-6 py-14 text-center">
          <h1 className="font-serif text-4xl font-semibold text-nude-blush">Account</h1>
          <p className="mt-4 text-sm text-nude-blush/55">
            Accounts, credits, and saved history aren&apos;t connected yet. Add your Supabase
            project credentials (see the README) to enable sign-in and persistent usage
            tracking.
          </p>
        </section>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user || !supabase) {
    redirect("/login");
  }

  const [{ data: profile }, { data: credits }, { data: characters }, { data: recent }] =
    await Promise.all([
      supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle(),
      supabase.from("credits").select("balance, updated_at").eq("user_id", user.id).maybeSingle(),
      supabase.from("characters").select("id").eq("user_id", user.id),
      supabase
        .from("generations")
        .select("id, generated_image_url, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

  return (
    <main className="min-h-screen bg-black-cherry-900">
      <Navbar />
      <section className="mx-auto max-w-3xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-nude-blush">
              {profile?.display_name ? profile.display_name : "Your Account"}
            </h1>
            <p className="mt-2 text-sm text-nude-blush/55">{user.email}</p>
          </div>
          <SignOutButton />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard label="Credits Remaining" value={String(credits?.balance ?? 0)} />
          <StatCard label="Plan" value="Free" />
          <StatCard label="Saved Girls" value={String(characters?.length ?? 0)} />
        </div>

        <div className="mt-12">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-nude-blush/50">
            Recent Generations
          </h2>
          {recent?.length ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {recent.map((g) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={g.id}
                  src={g.generated_image_url ?? undefined}
                  alt="Recent generation"
                  className="aspect-[3/4] w-full rounded-2xl border border-nude-blush/10 object-cover"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-nude-blush/40">No generations yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card px-6 py-5 text-center">
      <p className="font-serif text-3xl text-nude-blush">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-nude-blush/45">{label}</p>
    </div>
  );
}
