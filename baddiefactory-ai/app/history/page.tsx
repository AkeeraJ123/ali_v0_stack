"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { GeneratedPrompt } from "@/types";
import toast from "react-hot-toast";
import {
  History,
  Loader2,
  Copy,
  Download,
  Filter,
  Search,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending: "badge-pending",
  generating: "badge-generating",
  complete: "badge-complete",
  failed: "badge-failed",
};

function HistoryPage() {
  const searchParams = useSearchParams();
  const influencerFilter = searchParams.get("influencer");

  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [packFilter, setPackFilter] = useState("all");
  const [selected, setSelected] = useState<GeneratedPrompt | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [influencerFilter]);

  async function fetchHistory() {
    try {
      const url = influencerFilter
        ? `/api/history?influencer=${influencerFilter}`
        : "/api/history";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setPrompts(data);
      }
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  }

  function copyPrompt(prompt: string) {
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied!");
  }

  const filtered = prompts.filter((p) => {
    const matchesSearch =
      !search ||
      p.full_prompt.toLowerCase().includes(search.toLowerCase()) ||
      p.content_pack.toLowerCase().includes(search.toLowerCase());
    const matchesPack = packFilter === "all" || p.content_pack === packFilter;
    return matchesSearch && matchesPack;
  });

  const packs = Array.from(new Set(prompts.map((p) => p.content_pack)));

  return (
    <div className="min-h-screen bg-hero bg-grid">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <History className="w-6 h-6 text-[#FF0080]" />
          <div>
            <h1 className="text-3xl font-black text-white">Prompt History</h1>
            <p className="text-white/40 text-sm">{prompts.length} generations total</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts..."
              className="input-luxury pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <select
              value={packFilter}
              onChange={(e) => setPackFilter(e.target.value)}
              className="select-luxury pl-9 min-w-[160px]"
            >
              <option value="all">All Packs</option>
              {packs.map((pack) => (
                <option key={pack} value={pack}>
                  {pack.replace("-", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 text-[#FF0080] animate-spin" />
            <span className="text-white/40">Loading history...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4 animate-float">📜</div>
            <p className="text-white/40 text-lg mb-2">No generations yet</p>
            <p className="text-white/25 text-sm">
              Generate your first image to see history here.
            </p>
            <Link href="/dashboard" className="inline-block mt-6 btn-pink px-6 py-3">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-2 space-y-3">
              {filtered.map((prompt) => (
                <div
                  key={prompt.id}
                  onClick={() => setSelected(prompt)}
                  className={`glass rounded-xl p-4 cursor-pointer transition-all hover:glow-pink ${
                    selected?.id === prompt.id ? "border-[#FF0080] glow-pink" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-white/5">
                      {prompt.image_url ? (
                        <Image
                          src={prompt.image_url}
                          alt=""
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                          🖼️
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#FF0080] font-semibold text-sm capitalize">
                          {prompt.content_pack.replace("-", " ")}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${statusColors[prompt.status]}`}
                        >
                          {prompt.status}
                        </span>
                      </div>
                      <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
                        {prompt.full_prompt}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-white/30 text-xs">
                        <span>{formatDate(prompt.created_at)}</span>
                        <span>•</span>
                        <span className="capitalize">{prompt.mood}</span>
                        <span>•</span>
                        <span className="capitalize">{prompt.camera_style}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyPrompt(prompt.full_prompt);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-[#FF0080] hover:bg-[rgba(255,0,128,0.1)] transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {prompt.image_url && (
                        <a
                          href={prompt.image_url}
                          download
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-[#F5D28A] hover:bg-[rgba(245,210,138,0.1)] transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-1">
              {selected ? (
                <div className="space-y-4 sticky top-24">
                  {selected.image_url && (
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                      <Image
                        src={selected.image_url}
                        alt="Generated"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <GlassCard className="!p-4">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
                      Full Prompt
                    </p>
                    <p className="text-white/70 text-xs leading-relaxed">
                      {selected.full_prompt}
                    </p>
                    <button
                      onClick={() => copyPrompt(selected.full_prompt)}
                      className="flex items-center gap-2 text-[#FF0080] text-xs mt-3 hover:text-[#FF69B4] transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      Copy Prompt
                    </button>
                  </GlassCard>

                  <GlassCard className="!p-4 space-y-2">
                    {[
                      { label: "Pack", value: selected.content_pack },
                      { label: "Outfit", value: selected.outfit },
                      { label: "Location", value: selected.location },
                      { label: "Pose", value: selected.pose },
                      { label: "Camera", value: selected.camera_style },
                      { label: "Mood", value: selected.mood },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between text-xs">
                        <span className="text-white/30">{item.label}</span>
                        <span className="text-white capitalize max-w-[60%] text-right">
                          {item.value.replace(/-/g, " ")}
                        </span>
                      </div>
                    ))}
                  </GlassCard>
                </div>
              ) : (
                <GlassCard className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-4xl mb-3">👆</div>
                  <p className="text-white/30 text-sm">Select a generation to view details</p>
                </GlassCard>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HistoryPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-hero flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#FF0080] animate-spin" />
      </div>
    }>
      <HistoryPage />
    </Suspense>
  );
}
