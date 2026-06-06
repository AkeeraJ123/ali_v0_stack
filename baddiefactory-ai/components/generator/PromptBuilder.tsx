"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { OptionChip } from "@/components/ui/OptionChip";
import {
  ContentPack,
  CameraStyle,
  Mood,
  Pose,
  PromptBuilderState,
  InfluencerProfile,
} from "@/types";
import { CONTENT_PACK_CONFIGS } from "@/lib/promptBuilder";
import { Sparkles, Wand2 } from "lucide-react";
import toast from "react-hot-toast";

const CAMERA_STYLES: { value: CameraStyle; label: string; emoji: string }[] = [
  { value: "candid", label: "Candid", emoji: "📷" },
  { value: "portrait", label: "Portrait", emoji: "🖼️" },
  { value: "selfie-angle", label: "Selfie", emoji: "🤳" },
  { value: "overhead", label: "Overhead", emoji: "⬇️" },
  { value: "low-angle", label: "Low Angle", emoji: "📐" },
  { value: "wide-shot", label: "Wide Shot", emoji: "🌅" },
  { value: "close-up", label: "Close-up", emoji: "🔍" },
];

const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: "confident", label: "Confident", emoji: "👑" },
  { value: "playful", label: "Playful", emoji: "😝" },
  { value: "sultry", label: "Sultry", emoji: "🔥" },
  { value: "candid", label: "Candid", emoji: "✨" },
  { value: "fierce", label: "Fierce", emoji: "💪" },
  { value: "soft", label: "Soft", emoji: "🌸" },
  { value: "mysterious", label: "Mysterious", emoji: "🌙" },
];

const POSES: { value: Pose; label: string; emoji: string }[] = [
  { value: "standing", label: "Standing", emoji: "🧍" },
  { value: "sitting", label: "Sitting", emoji: "🪑" },
  { value: "laying", label: "Laying Down", emoji: "😴" },
  { value: "mirror", label: "Mirror", emoji: "🪞" },
  { value: "walking", label: "Walking", emoji: "🚶" },
  { value: "posing", label: "Posing", emoji: "💃" },
  { value: "candid", label: "Candid", emoji: "📸" },
];

interface PromptBuilderProps {
  influencer: InfluencerProfile;
  onGenerate: (state: PromptBuilderState) => Promise<void>;
  generating: boolean;
}

export function PromptBuilder({ influencer, onGenerate, generating }: PromptBuilderProps) {
  const [selectedPack, setSelectedPack] = useState<ContentPack>("selfie");
  const [customPackName, setCustomPackName] = useState("");
  const packConfig = CONTENT_PACK_CONFIGS[selectedPack];

  const [outfit, setOutfit] = useState(packConfig.defaultOutfit);
  const [location, setLocation] = useState(packConfig.defaultLocation);
  const [pose, setPose] = useState<Pose>(packConfig.defaultPose);
  const [cameraStyle, setCameraStyle] = useState<CameraStyle>("portrait");
  const [mood, setMood] = useState<Mood>(packConfig.defaultMood);
  const [customAdditions, setCustomAdditions] = useState("");

  const handlePackChange = (pack: ContentPack) => {
    setSelectedPack(pack);
    const config = CONTENT_PACK_CONFIGS[pack];
    setOutfit(config.defaultOutfit);
    setLocation(config.defaultLocation);
    setPose(config.defaultPose);
    setMood(config.defaultMood);
  };

  const handleGenerate = async () => {
    if (selectedPack === "custom" && !customPackName.trim()) {
      toast.error("Give your custom pack a name!");
      return;
    }

    const state: PromptBuilderState = {
      influencer_id: influencer.id,
      content_pack: selectedPack,
      outfit,
      location,
      pose,
      camera_style: cameraStyle,
      mood,
      custom_pack_name: customPackName || undefined,
      custom_prompt_additions: customAdditions || undefined,
    };

    await onGenerate(state);
  };

  return (
    <div className="space-y-5">
      {/* Content Pack Selection */}
      <GlassCard className="!p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <span>🎬</span> Content Pack
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.values(CONTENT_PACK_CONFIGS).map((pack) => (
            <button
              key={pack.id}
              type="button"
              onClick={() => handlePackChange(pack.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedPack === pack.id
                  ? "border-[#FF0080] bg-[rgba(255,0,128,0.1)]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <div className="text-xl mb-1">{pack.icon}</div>
              <div className="text-white text-xs font-semibold">{pack.label}</div>
              <div className="text-white/30 text-xs mt-0.5 leading-tight">{pack.description}</div>
            </button>
          ))}
        </div>
        {selectedPack === "custom" && (
          <input
            type="text"
            value={customPackName}
            onChange={(e) => setCustomPackName(e.target.value)}
            placeholder="Name your custom pack..."
            className="input-luxury mt-3"
          />
        )}
      </GlassCard>

      {/* Outfit */}
      <GlassCard className="!p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <span>👗</span> Outfit
        </h3>
        <textarea
          value={outfit}
          onChange={(e) => setOutfit(e.target.value)}
          placeholder="Describe the outfit..."
          className="input-luxury resize-none"
          rows={2}
        />
      </GlassCard>

      {/* Location */}
      <GlassCard className="!p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <span>📍</span> Location / Background
        </h3>
        <textarea
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Describe the location or setting..."
          className="input-luxury resize-none"
          rows={2}
        />
      </GlassCard>

      {/* Pose */}
      <GlassCard className="!p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <span>💃</span> Pose
        </h3>
        <div className="flex flex-wrap gap-2">
          {POSES.map((p) => (
            <OptionChip
              key={p.value}
              label={p.label}
              emoji={p.emoji}
              selected={pose === p.value}
              onClick={() => setPose(p.value)}
            />
          ))}
        </div>
      </GlassCard>

      {/* Camera Style */}
      <GlassCard className="!p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <span>📷</span> Camera Style
        </h3>
        <div className="flex flex-wrap gap-2">
          {CAMERA_STYLES.map((c) => (
            <OptionChip
              key={c.value}
              label={c.label}
              emoji={c.emoji}
              selected={cameraStyle === c.value}
              onClick={() => setCameraStyle(c.value)}
            />
          ))}
        </div>
      </GlassCard>

      {/* Mood */}
      <GlassCard className="!p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <span>🎭</span> Mood & Expression
        </h3>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <OptionChip
              key={m.value}
              label={m.label}
              emoji={m.emoji}
              selected={mood === m.value}
              onClick={() => setMood(m.value)}
            />
          ))}
        </div>
      </GlassCard>

      {/* Custom Additions */}
      <GlassCard className="!p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-[#FF0080]" />
          Extra Details (Optional)
        </h3>
        <textarea
          value={customAdditions}
          onChange={(e) => setCustomAdditions(e.target.value)}
          placeholder="Add any extra details to the prompt..."
          className="input-luxury resize-none"
          rows={2}
        />
      </GlassCard>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        loading={generating}
        size="lg"
        className="w-full glow-pink animate-pulse-glow text-xl py-5"
      >
        <Sparkles className="w-6 h-6" />
        Generate Image
      </Button>
    </div>
  );
}
