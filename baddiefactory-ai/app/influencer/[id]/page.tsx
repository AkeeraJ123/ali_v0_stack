"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { InfluencerProfile, IdentityLock } from "@/types";
import toast from "react-hot-toast";
import {
  Lock,
  Sparkles,
  Camera,
  ArrowLeft,
  Loader2,
  Shield,
  Dna,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function InfluencerProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [influencer, setInfluencer] = useState<InfluencerProfile | null>(null);
  const [identity, setIdentity] = useState<IdentityLock | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/influencers/${id}`);
      const data = await res.json();
      if (res.ok) {
        setInfluencer(data.influencer);
        setIdentity(data.identity);
      } else {
        toast.error("Influencer not found");
        router.push("/dashboard");
      }
    } catch {
      toast.error("Failed to load influencer");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete ${influencer?.name}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/influencers/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Model deleted");
        router.push("/dashboard");
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
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
      <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
        {/* Back */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-white/40 hover:text-white mb-6 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Profile Card */}
          <div className="lg:col-span-1 space-y-4">
            <GlassCard className="!p-0 overflow-hidden">
              {/* Avatar */}
              <div className="relative h-64 bg-gradient-to-br from-[#1a0010] to-[#0a0a0a]">
                {influencer.avatar_url ? (
                  <Image
                    src={influencer.avatar_url}
                    alt={influencer.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    ✨
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h1 className="text-2xl font-black text-white">{influencer.name}</h1>
                  <p className="text-white/50 text-sm capitalize">{influencer.aesthetic.replace("-", " ")}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 grid grid-cols-2 gap-3">
                <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                  <Camera className="w-4 h-4 text-[#FF0080] mx-auto mb-1" />
                  <p className="text-[#FF0080] font-bold text-lg">{influencer.total_generations || 0}</p>
                  <p className="text-white/40 text-xs">Generated</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                  <Lock className="w-4 h-4 text-[#F5D28A] mx-auto mb-1" />
                  <p className="text-[#F5D28A] font-bold text-lg">{identity ? "ON" : "OFF"}</p>
                  <p className="text-white/40 text-xs">ID Lock</p>
                </div>
              </div>

              {/* Info */}
              <div className="px-4 pb-4 space-y-2">
                {[
                  { label: "Created", value: formatDate(influencer.created_at) },
                  { label: "Skin Tone", value: influencer.skin_tone },
                  { label: "Body Type", value: influencer.body_type },
                  { label: "Hair", value: `${influencer.hair_color} ${influencer.hair_style}` },
                  { label: "Eyes", value: influencer.eye_color },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center text-sm">
                    <span className="text-white/40">{item.label}</span>
                    <span className="text-white capitalize">{item.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Actions */}
            <Link href={`/generate/${influencer.id}`} className="block">
              <Button className="w-full" size="lg">
                <Sparkles className="w-5 h-5" />
                Generate Content
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={handleDelete}
              loading={deleting}
            >
              Delete Model
            </Button>
          </div>

          {/* Right: Identity Lock */}
          <div className="lg:col-span-2 space-y-4">
            <GlassCard>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF0080] to-[#CC0066] rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg">Identity Lock</h2>
                  <p className="text-white/40 text-sm">
                    {identity
                      ? "Identity locked — all generations use this profile"
                      : "Identity will be locked after first generation"}
                  </p>
                </div>
                {identity && (
                  <div className="ml-auto flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1">
                    <Shield className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 text-xs font-medium">Active</span>
                  </div>
                )}
              </div>

              {identity ? (
                <div className="space-y-3">
                  {[
                    { label: "Face", value: identity.face_description, icon: "👤" },
                    { label: "Body", value: identity.body_description, icon: "💃" },
                    { label: "Skin", value: identity.skin_tone_description, icon: "✨" },
                    { label: "Hair", value: identity.hair_description, icon: "💇" },
                    { label: "Eyes", value: identity.eye_description, icon: "👁️" },
                    { label: "Style DNA", value: identity.style_dna, icon: "🧬" },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/[0.03] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{item.icon}</span>
                        <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">
                          {item.label}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed">{item.value}</p>
                    </div>
                  ))}

                  <div className="bg-[rgba(255,0,128,0.05)] rounded-xl p-4 border border-[rgba(255,0,128,0.15)]">
                    <div className="flex items-center gap-2 mb-2">
                      <Dna className="w-4 h-4 text-[#FF0080]" />
                      <span className="text-[#FF0080] text-xs font-semibold uppercase tracking-wider">
                        Prompt Seed
                      </span>
                    </div>
                    <p className="text-white/60 text-xs font-mono">{identity.prompt_seed}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3 animate-float">🔒</div>
                  <p className="text-white/40 mb-1">Identity not yet locked</p>
                  <p className="text-white/25 text-sm max-w-sm mx-auto">
                    Generate your first image to lock this model&apos;s identity permanently.
                  </p>
                  <Link href={`/generate/${influencer.id}`} className="inline-block mt-4">
                    <Button>
                      <Sparkles className="w-4 h-4" />
                      Generate First Image
                    </Button>
                  </Link>
                </div>
              )}
            </GlassCard>

            {/* Recent Generations */}
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Recent Generations</h3>
                <Link
                  href="/history"
                  className="text-[#FF0080] text-sm hover:text-[#FF69B4] transition-colors"
                >
                  View All
                </Link>
              </div>
              {(influencer.total_generations || 0) === 0 ? (
                <div className="text-center py-8 text-white/30 text-sm">
                  No generations yet
                </div>
              ) : (
                <div className="text-center py-8 text-white/30 text-sm">
                  <Link href={`/history?influencer=${influencer.id}`} className="text-[#FF0080] hover:underline">
                    View generation history
                  </Link>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
