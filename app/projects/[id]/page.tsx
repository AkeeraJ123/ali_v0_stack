import { notFound, redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  if (!isSupabaseConfigured) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user || !supabase) {
    redirect("/login");
  }

  const { data: character } = await supabase
    .from("characters")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!character) {
    notFound();
  }

  const [{ data: references }, { data: generations }] = await Promise.all([
    supabase
      .from("character_references")
      .select("*")
      .eq("character_id", params.id)
      .order("position", { ascending: true }),
    supabase
      .from("generations")
      .select("*")
      .eq("character_id", params.id)
      .order("created_at", { ascending: false }),
  ]);

  const favorites = (generations ?? []).filter((g) => g.favorite);

  return (
    <main className="min-h-screen bg-black-cherry-900">
      <Navbar />
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-nude-blush">{character.name}</h1>
            <p className="mt-2 text-sm text-nude-blush/55">
              Created {new Date(character.created_at).toLocaleDateString()}
            </p>
          </div>
          <Button href="/upload" variant="primary">
            NEW GENERATION
          </Button>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-nude-blush/50">
            Reference Images
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {(references ?? []).map((ref) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={ref.id}
                src={ref.image_url}
                alt={ref.reference_type}
                className="aspect-[3/4] w-full rounded-2xl border border-nude-blush/10 object-cover"
              />
            ))}
            {!references?.length && (
              <p className="col-span-full text-sm text-nude-blush/40">No references saved.</p>
            )}
          </div>
        </div>

        {favorites.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-nude-blush/50">
              Favorite Results
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {favorites.map((g) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={g.id}
                  src={g.generated_image_url ?? undefined}
                  alt="Favorite result"
                  className="aspect-[3/4] w-full rounded-2xl border border-nude-blush/10 object-cover"
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-nude-blush/50">
            All Generations
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(generations ?? []).map((g) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={g.id}
                src={g.generated_image_url ?? undefined}
                alt="Generation"
                className="aspect-[3/4] w-full rounded-2xl border border-nude-blush/10 object-cover"
              />
            ))}
            {!generations?.length && (
              <p className="col-span-full text-sm text-nude-blush/40">
                No generations saved for this girl yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
