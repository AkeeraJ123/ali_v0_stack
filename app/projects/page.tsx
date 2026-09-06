import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function ProjectsPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="min-h-screen bg-black-cherry-900">
        <Navbar />
        <EmptyState
          title="My Girls isn't connected yet"
          copy="Connect Supabase (see the README) to save your AI characters, references, and generations across sessions."
        />
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

  const { data: characters } = await supabase
    .from("characters")
    .select("id, name, primary_reference_url, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black-cherry-900">
      <Navbar />
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-nude-blush">My Girls</h1>
            <p className="mt-2 text-sm text-nude-blush/55">
              Every AI character you&apos;ve saved, with her references and generations.
            </p>
          </div>
          <Button href="/upload" variant="primary">
            NEW GIRL
          </Button>
        </div>

        {!characters?.length ? (
          <EmptyState
            title="No saved girls yet"
            copy="Name a character during generation settings to save her here for next time."
          />
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {characters.map((c) => (
              <Link
                key={c.id}
                href={`/projects/${c.id}`}
                className="surface-card group overflow-hidden transition-colors hover:border-nude-blush/30"
              >
                <div className="relative aspect-[4/5] w-full bg-cherry-radial">
                  {c.primary_reference_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={c.primary_reference_url}
                      alt={c.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-serif text-4xl text-nude-blush/30">
                        {c.name.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-nude-blush">{c.name}</p>
                  <p className="mt-0.5 text-xs text-nude-blush/40">
                    {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="mx-auto mt-16 flex max-w-md flex-col items-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-nude-blush/25 bg-black-cherry-800">
        <span className="font-serif text-2xl text-nude-blush/50">✦</span>
      </div>
      <h2 className="font-serif text-xl font-semibold text-nude-blush">{title}</h2>
      <p className="text-sm text-nude-blush/55">{copy}</p>
      <Button href="/upload" variant="secondary" className="mt-2">
        START A TRANSFORMATION
      </Button>
    </div>
  );
}
