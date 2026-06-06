import Link from "next/link";
import { Sparkles, Lock, Zap, Shield, Star, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-hero bg-grid overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgba(255,0,128,0.06)] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[rgba(245,210,138,0.04)] rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-[#FF0080] to-[#CC0066] rounded-xl flex items-center justify-center glow-pink">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gradient-luxury">BaddieFactory</span>
          <span className="text-[#F5D28A] text-sm font-medium">AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="btn-glass text-sm px-4 py-2">
            Dashboard
          </Link>
          <Link href="/create" className="btn-pink text-sm px-5 py-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-4 pt-16 pb-24 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm mb-8 border-[rgba(255,0,128,0.3)]">
          <span className="w-2 h-2 bg-[#FF0080] rounded-full animate-pulse" />
          <span className="text-white/70">AI-Powered Identity Consistency</span>
          <span className="text-[#FF0080] font-semibold">New</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-tight">
          <span className="text-white">Build Your</span>
          <br />
          <span className="text-gradient-luxury">AI Baddie</span>
          <br />
          <span className="text-white">Empire</span>
        </h1>

        <p className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Create stunningly realistic AI influencer models that look like the{" "}
          <span className="text-[#FF0080] font-medium">same person</span> every
          time. Identity lock technology ensures your model is always consistent.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/create"
            className="btn-pink px-8 py-4 text-lg flex items-center gap-3 glow-pink animate-pulse-glow"
          >
            <Sparkles className="w-5 h-5" />
            Create Your Model
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/dashboard" className="btn-glass px-8 py-4 text-lg">
            View Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { label: "Models Created", value: "10K+" },
            { label: "Images Generated", value: "500K+" },
            { label: "Content Packs", value: "11" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-black text-gradient-pink">{stat.value}</div>
              <div className="text-white/40 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-4 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            <span className="text-white">Everything you need to</span>
            <br />
            <span className="text-gradient-pink">build & monetize</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            From creation to content generation — all in one luxury studio.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass p-6 rounded-2xl group hover:glow-pink transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF0080]/20 to-[#CC0066]/10 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Content Packs */}
      <section className="relative z-10 px-4 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-3">
            11 Content Pack Types
          </h2>
          <p className="text-white/40">Generate exactly the content your audience wants</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {packs.map((pack) => (
            <div
              key={pack}
              className="glass px-4 py-2 rounded-full text-sm text-white/70 hover:text-[#FF0080] hover:border-[rgba(255,0,128,0.4)] transition-all cursor-pointer"
            >
              {pack}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-20 max-w-3xl mx-auto text-center">
        <div className="glass-gold p-10 rounded-3xl">
          <div className="text-5xl mb-4 animate-float">👑</div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            <span className="text-gradient-gold">Ready to build your</span>
            <br />
            <span className="text-white">AI empire?</span>
          </h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">
            Create your first AI influencer model in under 2 minutes. Identity
            consistency guaranteed.
          </p>
          <Link
            href="/create"
            className="btn-gold inline-flex items-center gap-3 px-8 py-4 text-lg glow-gold"
          >
            <Star className="w-5 h-5" />
            Start Creating Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-white/20 text-sm">
        <p>© 2025 BaddieFactory AI — All models are AI-generated adults 21+</p>
        <p className="mt-1 text-xs">
          <Shield className="w-3 h-3 inline mr-1" />
          Adult content platform — 18+ only
        </p>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: "🔒",
    title: "Identity Lock",
    description:
      "Your model looks like the same person in every single generation. No more inconsistency.",
  },
  {
    icon: "✨",
    title: "11 Content Packs",
    description:
      "Selfie, gym, cosplay, boudoir, vacation, rich lifestyle — every content type covered.",
  },
  {
    icon: "🎨",
    title: "Prompt Builder",
    description:
      "Combine outfit, location, pose, camera style, and mood for pixel-perfect results.",
  },
  {
    icon: "🎭",
    title: "Full Customization",
    description:
      "Choose skin tone, body type, hair, eyes, and aesthetic to build your perfect model.",
  },
  {
    icon: "⚡",
    title: "Fast Generation",
    description:
      "Powered by Nano Banana Pro for high-quality, photorealistic image generation.",
  },
  {
    icon: "📊",
    title: "Prompt History",
    description:
      "Every prompt saved. Reuse, remix, and iterate on what works best for your audience.",
  },
];

const packs = [
  "📸 Selfie Pack",
  "🛏️ Bed Selfie Pack",
  "💪 Gym Pack",
  "🎭 Cosplay Pack",
  "🪞 Mirror Selfie Pack",
  "🌴 Vacation Pack",
  "💎 Rich Girl Lifestyle",
  "💕 Girlfriend Tease",
  "🔥 Fanvue Tease",
  "📱 TikTok Viral",
  "✨ Custom Pack",
];
