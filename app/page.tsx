import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";

const STEPS = [
  {
    title: "Upload Your Girl",
    copy: "Start with the AI character you already created. Her references become the identity anchor for every transformation.",
  },
  {
    title: "Choose Her Body Direction",
    copy: "Select an overall silhouette, then fine-tune waist, hips, thighs, bust, glutes, and stomach with a luxury consultation flow.",
  },
  {
    title: "Lock What Stays Her",
    copy: "Face and skin tone are locked by default. Choose what else stays untouched — hair, makeup, tattoos, outfit, jewelry.",
  },
  {
    title: "Generate & Compare",
    copy: "We generate her transformed images directly in-app. Swipe between versions and compare before and after.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-cherry-radial">
      <Navbar />

      <section className="relative overflow-hidden px-6 pb-28 pt-20 sm:pt-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-10 h-96 w-96 animate-floatSlow rounded-full bg-nude-blush/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-40 h-72 w-72 animate-floatSlow rounded-full bg-black-cherry-300/20 blur-3xl [animation-delay:2s]"
        />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="rounded-full border border-nude-blush/25 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-nude-blush/70">
            Beauty-Tech for AI Creators
          </span>

          <h1 className="mt-8 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-nude-blush sm:text-7xl">
            Rich Girl
            <br />
            Bodied
          </h1>

          <p className="mt-6 font-serif text-xl italic text-nude-blush/80 sm:text-2xl">
            Same Girl. Your Body Vision.
          </p>

          <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-nude-blush/60">
            Upload your AI girl, choose the body direction you want, and generate updated
            images while keeping her identity locked.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button href="/upload" variant="primary">
              GET HER BODIED
            </Button>
            <Button href="#how-it-works" variant="secondary">
              SEE HOW IT WORKS
            </Button>
          </div>
        </div>

        <div className="relative mx-auto mt-24 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            "Identity always locked",
            "Melanin-rich skin preserved",
            "No stock photography, ever",
          ].map((item) => (
            <div
              key={item}
              className="surface-card texture-grain px-6 py-5 text-center text-sm font-medium text-nude-blush/70"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="relative border-t border-nude-blush/10 bg-black-cherry-950/40 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-semibold text-nude-blush sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-nude-blush/55">
              A guided consultation, not a form. Four steps from upload to a finished result.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.title} className="surface-card p-6">
                <span className="font-serif text-3xl text-nude-blush/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-sm font-semibold text-nude-blush">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-nude-blush/50">{step.copy}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <Button href="/upload" variant="primary">
              GET HER BODIED
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-nude-blush/10 px-6 py-10 text-center text-xs text-nude-blush/35">
        Rich Girl Bodied by Coach Akeera. Your reference images are used to create your
        requested results and remain private to your account.
      </footer>
    </main>
  );
}
