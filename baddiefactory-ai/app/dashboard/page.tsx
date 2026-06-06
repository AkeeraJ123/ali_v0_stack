"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { InfluencerCard } from "@/components/dashboard/InfluencerCard";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { InfluencerProfile } from "@/types";
import { Sparkles, Plus, Loader2, LayoutDashboard, Camera, Zap } from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [influencers, setInfluencers] = useState<InfluencerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInfluencers();
  }, []);

  async function fetchInfluencers() {
    try {
      const res = await fetch("/api/influencers");
      const data = await res.json();
      if (res.ok) {
        setInfluencers(data);
      } else {
        toast.error("Failed to load influencers");
      }
    } catch {
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  }

  const totalGenerations = influencers.reduce(
    (sum, inf) => sum + (inf.total_generations || 0),
    0
  );

  return (
    <div className="min-h-screen bg-hero bg-grid">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="w-5 h-5 text-[#FF0080]" />
              <span className="text-white/40 text-sm uppercase tracking-wider font-medium">
                Creator Studio
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Your <span className="text-gradient-pink">Models</span>
            </h1>
          </div>
          <Link href="/create">
            <Button size="lg">
              <Plus className="w-5 h-5" />
              New Model
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Models",
              value: influencers.length,
              icon: <Sparkles className="w-4 h-4" />,
              color: "#FF0080",
            },
            {
              label: "Images Generated",
              value: totalGenerations,
              icon: <Camera className="w-4 h-4" />,
              color: "#F5D28A",
            },
            {
              label: "Content Packs",
              value: "11",
              icon: <Zap className="w-4 h-4" />,
              color: "#FF69B4",
            },
          ].map((stat) => (
            <GlassCard key={stat.label} className="!p-4">
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: stat.color }}>{stat.icon}</span>
                <span className="text-white/40 text-xs">{stat.label}</span>
              </div>
              <div
                className="text-2xl font-black"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 text-[#FF0080] animate-spin" />
            <p className="text-white/40">Loading your models...</p>
          </div>
        ) : influencers.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4 animate-float">✨</div>
            <h2 className="text-2xl font-bold text-white mb-2">No models yet</h2>
            <p className="text-white/40 mb-8 max-w-sm mx-auto">
              Create your first AI influencer model and start generating content.
            </p>
            <Link href="/create">
              <Button size="lg">
                <Plus className="w-5 h-5" />
                Create Your First Model
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {influencers.map((influencer) => (
              <InfluencerCard key={influencer.id} influencer={influencer} />
            ))}

            {/* Add New Card */}
            <Link href="/create" className="block">
              <div className="glass rounded-2xl h-full min-h-[300px] flex flex-col items-center justify-center gap-3 border-dashed border-[rgba(255,0,128,0.2)] hover:border-[rgba(255,0,128,0.5)] transition-all cursor-pointer group">
                <div className="w-14 h-14 rounded-full bg-[rgba(255,0,128,0.1)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-[#FF0080]" />
                </div>
                <p className="text-white/40 font-medium group-hover:text-white/60 transition-colors">
                  Add New Model
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
