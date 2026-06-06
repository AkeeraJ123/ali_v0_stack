"use client";

import Link from "next/link";
import Image from "next/image";
import { InfluencerProfile } from "@/types";
import { Sparkles, Camera, Lock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface InfluencerCardProps {
  influencer: InfluencerProfile;
}

const aestheticLabels: Record<string, string> = {
  "soft-girl": "Soft Girl",
  "gym-baddie": "Gym Baddie",
  "cosplay-girl": "Cosplay Girl",
  "rich-girl": "Rich Girl",
  "gamer-girl": "Gamer Girl",
  girlfriend: "Girlfriend",
  "college-girl": "College Girl",
  custom: "Custom",
};

const aestheticColors: Record<string, string> = {
  "soft-girl": "#FF69B4",
  "gym-baddie": "#FF0080",
  "cosplay-girl": "#9B59B6",
  "rich-girl": "#F5D28A",
  "gamer-girl": "#00FF88",
  girlfriend: "#FF4D6D",
  "college-girl": "#4FC3F7",
  custom: "#FF0080",
};

export function InfluencerCard({ influencer }: InfluencerCardProps) {
  const color = aestheticColors[influencer.aesthetic] || "#FF0080";

  return (
    <div className="glass rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 hover:glow-pink">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-[#1a0010] to-[#0a0a0a] overflow-hidden">
        {influencer.avatar_url ? (
          <Image
            src={influencer.avatar_url}
            alt={influencer.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${color}20`, border: `2px solid ${color}40` }}
            >
              ✨
            </div>
            <p className="text-white/30 text-xs">No preview yet</p>
          </div>
        )}

        {/* Aesthetic badge */}
        <div
          className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: `${color}20`,
            border: `1px solid ${color}50`,
            color: color,
          }}
        >
          {aestheticLabels[influencer.aesthetic] || influencer.aesthetic}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-white text-lg">{influencer.name}</h3>
            <p className="text-white/40 text-xs">{formatDate(influencer.created_at)}</p>
          </div>
          <div className="flex items-center gap-1 text-[#F5D28A] text-xs font-medium bg-[rgba(245,210,138,0.1)] px-2 py-1 rounded-full">
            <Camera className="w-3 h-3" />
            {influencer.total_generations || 0}
          </div>
        </div>

        {/* Traits */}
        <div className="flex flex-wrap gap-1 mb-4">
          {[
            influencer.skin_tone,
            influencer.body_type,
            influencer.hair_color,
          ].map((trait) => (
            <span
              key={trait}
              className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10 capitalize"
            >
              {trait}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/generate/${influencer.id}`}
            className="flex-1 btn-pink text-center text-sm py-2 px-3 flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            Generate
          </Link>
          <Link
            href={`/influencer/${influencer.id}`}
            className="btn-glass text-sm py-2 px-3 flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
