"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { PromptBuilder } from "@/components/generator/PromptBuilder";
import { GlassCard } from "@/components/ui/GlassCard";
import { InfluencerProfile, PromptBuilderState, GeneratedPrompt } from "@/types";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Download, Share2, Copy, Sparkles } from "lucide-react";

export default function GeneratePage() {
  const { id } = useParams();
  const [influencer, setInfluencer] = useState<InfluencerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedPrompt | null>(null);
  const [recentResults, setRecentResults] = useState<GeneratedPrompt[]>([]);

  useEffect(() => {
    if (id) fetchInfluencer();
  }, [id]);

  async function fetchInfluencer() {
    try {
      const res = await fetch(`/api/influencers/${id}`);
      const data = await res.json();
      if (res.ok) {
        setInfluencer(data.influencer);
      } else {
        toast.error("Influencer not found");
      }
    } catch {
      toast.error("Failed to load influencer");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate(state: PromptBuilderState) {
    setGenerating(true);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setResult(data);
      setRecentResults((prev) => [data, ...prev.slice(0, 5)]);
      toast.success("Image generated! 🔥");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  function copyPrompt() {
    if (result?.full_prompt) {
      navigator.clipboard.writeText(result.full_prompt);
      toast.success("Prompt copied!");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-hero flex items-center justify-center">
        <Navbar />
        <Loader2 className="w-10 h-10 text-[#FF0080] animate-spin" />
      </div>
    );
  }

  if (!influencer) return null;

  return (
    <div className="min-h-screen bg-hero bg-grid">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/influencer/${influencer.id}`}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
          <div className="text-white/20">|</div>
          <div>
            <span className="text-white/40 text-sm">Generating for </span>
            <span className="text-[#FF0080] font-semibold">{influencer.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Prompt Builder */}
          <div>
            <h2 className="text-2xl font-black text-white mb-6">
              <Sparkles className="w-5 h-5 text-[#FF0080] inline mr-2" />
              Build Your Prompt
            </h2>
            <PromptBuilder
              influencer={influencer}
              onGenerate={handleGenerate}
              generating={generating}
            />
          </div>

          {/* Right: Result */}
          <div>
            <h2 className="text-2xl font-black text-white mb-6">Result</h2>

            {/* Loading State */}
            {generating && (
              <GlassCard className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 relative">
                  <div className="w-16 h-16 rounded-full border-4 border-[rgba(255,0,128,0.2)] border-t-[#FF0080] animate-spin" />
                  <Sparkles className="w-6 h-6 text-[#FF0080] absolute inset-0 m-auto" />
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold">Generating your baddie...</p>
                  <p className="text-white/40 text-sm mt-1">
                    Using Nano Banana Pro
                  </p>
                </div>
              </GlassCard>
            )}

            {/* Result Display */}
            {!generating && result && (
              <div className="space-y-4">
                {/* Image */}
                <GlassCard className="!p-0 overflow-hidden">
                  {result.image_url ? (
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={result.image_url}
                        alt="Generated influencer"
                        fill
                        className="object-cover"
                      />
                      {/* Overlay actions */}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <a
                          href={result.image_url}
                          download
                          target="_blank"
                          className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => {
                            navigator.share?.({ url: result.image_url });
                          }}
                          className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[3/4] flex items-center justify-center text-white/30">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🖼️</div>
                        <p className="text-sm">Image processing...</p>
                      </div>
                    </div>
                  )}
                </GlassCard>

                {/* Prompt used */}
                <GlassCard className="!p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/50 text-xs uppercase tracking-wider font-semibold">
                      Prompt Used
                    </span>
                    <button
                      onClick={copyPrompt}
                      className="flex items-center gap-1 text-[#FF0080] text-xs hover:text-[#FF69B4] transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed line-clamp-4">
                    {result.full_prompt}
                  </p>
                </GlassCard>

                {/* Metadata */}
                <GlassCard className="!p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Pack", value: result.content_pack },
                      { label: "Mood", value: result.mood },
                      { label: "Pose", value: result.pose },
                      { label: "Camera", value: result.camera_style },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-white/30 text-xs">{item.label}</p>
                        <p className="text-white text-sm capitalize">{item.value.replace("-", " ")}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Empty State */}
            {!generating && !result && (
              <GlassCard className="flex flex-col items-center justify-center py-20 text-center gap-3">
                <div className="text-5xl animate-float">🔮</div>
                <p className="text-white/50 font-medium">
                  Your generated image will appear here
                </p>
                <p className="text-white/25 text-sm">
                  Configure the prompt builder and hit generate
                </p>
              </GlassCard>
            )}

            {/* Recent Results */}
            {recentResults.length > 1 && (
              <div className="mt-6">
                <h3 className="text-white/60 text-sm font-semibold mb-3">Recent Generations</h3>
                <div className="grid grid-cols-3 gap-2">
                  {recentResults.slice(1).map((r) => (
                    <div
                      key={r.id}
                      className="relative aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setResult(r)}
                    >
                      {r.image_url ? (
                        <Image
                          src={r.image_url}
                          alt="Generated"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 text-xs">
                          {r.content_pack}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
