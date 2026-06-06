"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { OptionChip } from "@/components/ui/OptionChip";
import toast from "react-hot-toast";
import {
  SkinTone,
  BodyType,
  HairStyle,
  HairColor,
  EyeColor,
  Aesthetic,
} from "@/types";
import { Sparkles, ChevronRight, ChevronLeft, Lock } from "lucide-react";

const STEPS = ["Identity", "Style", "Aesthetic", "Review"];

const skinTones: { value: SkinTone; label: string; emoji: string }[] = [
  { value: "fair", label: "Fair", emoji: "🏻" },
  { value: "light", label: "Light", emoji: "🏼" },
  { value: "medium", label: "Medium", emoji: "🏽" },
  { value: "olive", label: "Olive", emoji: "🫒" },
  { value: "tan", label: "Tan", emoji: "🌟" },
  { value: "caramel", label: "Caramel", emoji: "🍯" },
  { value: "brown", label: "Brown", emoji: "🤎" },
  { value: "deep", label: "Deep", emoji: "🌑" },
  { value: "ebony", label: "Ebony", emoji: "✨" },
  { value: "custom", label: "Custom", emoji: "🎨" },
];

const bodyTypes: { value: BodyType; label: string; emoji: string }[] = [
  { value: "slim", label: "Slim", emoji: "💃" },
  { value: "athletic", label: "Athletic", emoji: "💪" },
  { value: "curvy", label: "Curvy", emoji: "🌊" },
  { value: "thick", label: "Thick", emoji: "🍑" },
  { value: "hourglass", label: "Hourglass", emoji: "⏳" },
  { value: "bbl-style", label: "BBL-Style", emoji: "🔥" },
  { value: "custom", label: "Custom", emoji: "✨" },
];

const hairStyles: { value: HairStyle; label: string; emoji: string }[] = [
  { value: "bustdown", label: "Bustdown", emoji: "👸" },
  { value: "curly", label: "Curly", emoji: "🌀" },
  { value: "bob", label: "Bob", emoji: "✂️" },
  { value: "braids", label: "Braids", emoji: "🪡" },
  { value: "ponytail", label: "Ponytail", emoji: "🎀" },
  { value: "pixie", label: "Pixie", emoji: "🧚" },
  { value: "waves", label: "Waves", emoji: "🌊" },
  { value: "custom", label: "Custom", emoji: "🎨" },
];

const hairColors: { value: HairColor; label: string; color: string }[] = [
  { value: "black", label: "Black", color: "#1a1a1a" },
  { value: "blonde", label: "Blonde", color: "#F5D28A" },
  { value: "brown", label: "Brown", color: "#8B4513" },
  { value: "red", label: "Red", color: "#CC2200" },
  { value: "blue", label: "Blue", color: "#0044CC" },
  { value: "pink", label: "Pink", color: "#FF0080" },
  { value: "custom", label: "Custom", color: "linear-gradient(135deg,#FF0080,#F5D28A)" },
];

const eyeColors: { value: EyeColor; label: string; color: string }[] = [
  { value: "brown", label: "Brown", color: "#8B4513" },
  { value: "hazel", label: "Hazel", color: "#8B7355" },
  { value: "green", label: "Green", color: "#228B22" },
  { value: "blue", label: "Blue", color: "#4169E1" },
  { value: "grey", label: "Grey", color: "#808080" },
  { value: "custom", label: "Custom", color: "#FF0080" },
];

const aesthetics: { value: Aesthetic; label: string; emoji: string; desc: string }[] = [
  { value: "soft-girl", label: "Soft Girl", emoji: "🌸", desc: "Pastel, cute, feminine vibes" },
  { value: "gym-baddie", label: "Gym Baddie", emoji: "💪", desc: "Fit, athletic, powerful energy" },
  { value: "cosplay-girl", label: "Cosplay Girl", emoji: "🎭", desc: "Character, fantasy, creative" },
  { value: "rich-girl", label: "Rich Girl", emoji: "💎", desc: "Luxury, designer, elite lifestyle" },
  { value: "gamer-girl", label: "Gamer Girl", emoji: "🎮", desc: "Tech, gaming, neon vibes" },
  { value: "girlfriend", label: "Girlfriend", emoji: "💕", desc: "Intimate, warm, relationship content" },
  { value: "college-girl", label: "College Girl", emoji: "📚", desc: "Casual, fun, youthful energy" },
  { value: "custom", label: "Custom", emoji: "✨", desc: "Define your own unique aesthetic" },
];

interface FormState {
  name: string;
  skin_tone: SkinTone;
  skin_tone_custom: string;
  body_type: BodyType;
  body_type_custom: string;
  hair_style: HairStyle;
  hair_style_custom: string;
  hair_color: HairColor;
  hair_color_custom: string;
  eye_color: EyeColor;
  eye_color_custom: string;
  aesthetic: Aesthetic;
  aesthetic_custom: string;
}

const defaultForm: FormState = {
  name: "",
  skin_tone: "medium",
  skin_tone_custom: "",
  body_type: "curvy",
  body_type_custom: "",
  hair_style: "waves",
  hair_style_custom: "",
  hair_color: "black",
  hair_color_custom: "",
  eye_color: "brown",
  eye_color_custom: "",
  aesthetic: "soft-girl",
  aesthetic_custom: "",
};

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Give your model a name first!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/influencers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create influencer");
      }

      toast.success(`${form.name} has been created! 🔥`);
      router.push(`/influencer/${data.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero bg-grid">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm mb-4 border-[rgba(255,0,128,0.3)]">
            <Sparkles className="w-4 h-4 text-[#FF0080]" />
            <span className="text-white/60">Step {step + 1} of {STEPS.length}</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            Create Your <span className="text-gradient-pink">AI Model</span>
          </h1>
          <p className="text-white/40">
            Build a unique identity that stays consistent in every generation
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  i <= step
                    ? "bg-gradient-to-r from-[#FF0080] to-[#CC0066]"
                    : "bg-white/10"
                }`}
              />
              <p className={`text-xs mt-1 text-center ${i === step ? "text-[#FF0080]" : "text-white/30"}`}>
                {s}
              </p>
            </div>
          ))}
        </div>

        {/* Step 0: Identity */}
        {step === 0 && (
          <GlassCard className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">
                Model Name <span className="text-[#FF0080]">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Nova, Jade, Zara..."
                className="input-luxury"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/70 mb-3">
                Skin Tone
              </label>
              <div className="flex flex-wrap gap-2">
                {skinTones.map((s) => (
                  <OptionChip
                    key={s.value}
                    label={s.label}
                    emoji={s.emoji}
                    selected={form.skin_tone === s.value}
                    onClick={() => update("skin_tone", s.value)}
                  />
                ))}
              </div>
              {form.skin_tone === "custom" && (
                <input
                  type="text"
                  value={form.skin_tone_custom}
                  onChange={(e) => update("skin_tone_custom", e.target.value)}
                  placeholder="Describe the skin tone..."
                  className="input-luxury mt-3"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/70 mb-3">
                Body Type
              </label>
              <div className="flex flex-wrap gap-2">
                {bodyTypes.map((b) => (
                  <OptionChip
                    key={b.value}
                    label={b.label}
                    emoji={b.emoji}
                    selected={form.body_type === b.value}
                    onClick={() => update("body_type", b.value)}
                  />
                ))}
              </div>
              {form.body_type === "custom" && (
                <input
                  type="text"
                  value={form.body_type_custom}
                  onChange={(e) => update("body_type_custom", e.target.value)}
                  placeholder="Describe the body type..."
                  className="input-luxury mt-3"
                />
              )}
            </div>
          </GlassCard>
        )}

        {/* Step 1: Style */}
        {step === 1 && (
          <GlassCard className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-3">
                Hair Style
              </label>
              <div className="flex flex-wrap gap-2">
                {hairStyles.map((h) => (
                  <OptionChip
                    key={h.value}
                    label={h.label}
                    emoji={h.emoji}
                    selected={form.hair_style === h.value}
                    onClick={() => update("hair_style", h.value)}
                  />
                ))}
              </div>
              {form.hair_style === "custom" && (
                <input
                  type="text"
                  value={form.hair_style_custom}
                  onChange={(e) => update("hair_style_custom", e.target.value)}
                  placeholder="Describe the hair style..."
                  className="input-luxury mt-3"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/70 mb-3">
                Hair Color
              </label>
              <div className="flex flex-wrap gap-3">
                {hairColors.map((h) => (
                  <button
                    key={h.value}
                    type="button"
                    onClick={() => update("hair_color", h.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all text-sm ${
                      form.hair_color === h.value
                        ? "border-[#FF0080] text-[#FF0080] bg-[rgba(255,0,128,0.1)]"
                        : "border-white/10 text-white/60 hover:border-white/30"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ background: h.color }}
                    />
                    {h.label}
                  </button>
                ))}
              </div>
              {form.hair_color === "custom" && (
                <input
                  type="text"
                  value={form.hair_color_custom}
                  onChange={(e) => update("hair_color_custom", e.target.value)}
                  placeholder="Describe the hair color..."
                  className="input-luxury mt-3"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/70 mb-3">
                Eye Color
              </label>
              <div className="flex flex-wrap gap-3">
                {eyeColors.map((e) => (
                  <button
                    key={e.value}
                    type="button"
                    onClick={() => update("eye_color", e.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all text-sm ${
                      form.eye_color === e.value
                        ? "border-[#FF0080] text-[#FF0080] bg-[rgba(255,0,128,0.1)]"
                        : "border-white/10 text-white/60 hover:border-white/30"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ background: e.color }}
                    />
                    {e.label}
                  </button>
                ))}
              </div>
              {form.eye_color === "custom" && (
                <input
                  type="text"
                  value={form.eye_color_custom}
                  onChange={(e) => update("eye_color_custom", e.target.value)}
                  placeholder="Describe the eye color..."
                  className="input-luxury mt-3"
                />
              )}
            </div>
          </GlassCard>
        )}

        {/* Step 2: Aesthetic */}
        {step === 2 && (
          <GlassCard className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-4">
                Choose Your Model&apos;s Aesthetic
              </label>
              <div className="grid grid-cols-2 gap-3">
                {aesthetics.map((a) => (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => update("aesthetic", a.value)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      form.aesthetic === a.value
                        ? "border-[#FF0080] bg-[rgba(255,0,128,0.1)] glow-pink"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <div className="text-2xl mb-2">{a.emoji}</div>
                    <div className="font-semibold text-white text-sm">{a.label}</div>
                    <div className="text-white/40 text-xs mt-1">{a.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {form.aesthetic === "custom" && (
              <textarea
                value={form.aesthetic_custom}
                onChange={(e) => update("aesthetic_custom", e.target.value)}
                placeholder="Describe your model's unique aesthetic, style, and vibe..."
                className="input-luxury resize-none"
                rows={4}
              />
            )}
          </GlassCard>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-4">
            <GlassCard>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF0080] to-[#CC0066] rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg">Identity Review</h2>
                  <p className="text-white/40 text-sm">This will be locked after first generation</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Name", value: form.name || "—" },
                  { label: "Skin Tone", value: form.skin_tone === "custom" ? form.skin_tone_custom || "Custom" : form.skin_tone },
                  { label: "Body Type", value: form.body_type === "custom" ? form.body_type_custom || "Custom" : form.body_type },
                  { label: "Hair Style", value: form.hair_style === "custom" ? form.hair_style_custom || "Custom" : form.hair_style },
                  { label: "Hair Color", value: form.hair_color === "custom" ? form.hair_color_custom || "Custom" : form.hair_color },
                  { label: "Eye Color", value: form.eye_color === "custom" ? form.eye_color_custom || "Custom" : form.eye_color },
                  { label: "Aesthetic", value: form.aesthetic === "custom" ? form.aesthetic_custom || "Custom" : form.aesthetic },
                ].map((item) => (
                  <div key={item.label} className="bg-white/[0.03] rounded-xl p-3">
                    <p className="text-white/40 text-xs mb-1">{item.label}</p>
                    <p className="text-white font-medium capitalize text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="glass-gold p-4 rounded-xl flex items-start gap-3">
              <div className="text-2xl">🔒</div>
              <div>
                <p className="text-[#F5D28A] font-semibold text-sm">Identity Lock Enabled</p>
                <p className="text-white/50 text-xs mt-1">
                  After the first image is generated, this identity will be permanently locked
                  to ensure your model looks the same in every future generation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 0 ? (
            <Button variant="glass" onClick={() => setStep((s) => s - 1)}>
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => {
                if (step === 0 && !form.name.trim()) {
                  toast.error("Please enter a name for your model");
                  return;
                }
                setStep((s) => s + 1);
              }}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading} size="lg">
              <Sparkles className="w-5 h-5" />
              Create Model
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
