// Consultation option lists — Page 3 (Body Consultation) and Page 5 (Generation Settings).
// Language is kept beauty-focused, neutral, and respectful per brand guidelines:
// no insulting or degrading body-type labels anywhere in this file.

export interface OptionDef {
  value: string;
  label: string;
  description?: string;
}

export const OVERALL_BODY_DIRECTIONS: OptionDef[] = [
  { value: "natural-hourglass", label: "Natural Hourglass" },
  { value: "slim-thick", label: "Slim Thick" },
  { value: "petite-curvy", label: "Petite Curvy" },
  { value: "soft-curvy", label: "Soft Curvy" },
  { value: "thick-toned", label: "Thick & Toned" },
  { value: "athletic-curvy", label: "Athletic Curvy" },
  { value: "full-glam-curves", label: "Full Glam Curves" },
  { value: "custom", label: "Custom" },
];

export const WAIST_OPTIONS: OptionDef[] = [
  { value: "natural", label: "Natural" },
  { value: "slightly-defined", label: "Slightly Defined" },
  { value: "snatched", label: "Snatched" },
  { value: "very-snatched", label: "Very Snatched" },
];

export const HIPS_OPTIONS: OptionDef[] = [
  { value: "natural", label: "Natural" },
  { value: "fuller", label: "Fuller" },
  { value: "wider", label: "Wider" },
  { value: "softer-curve", label: "Softer Curve" },
];

export const THIGHS_OPTIONS: OptionDef[] = [
  { value: "natural", label: "Natural" },
  { value: "fuller", label: "Fuller" },
  { value: "thicker", label: "Thicker" },
  { value: "more-defined", label: "More Defined" },
];

export const BUST_OPTIONS: OptionDef[] = [
  { value: "natural", label: "Natural" },
  { value: "fuller", label: "Fuller" },
  { value: "lifted", label: "Lifted" },
  { value: "more-proportional", label: "More Proportional" },
];

export const GLUTES_OPTIONS: OptionDef[] = [
  { value: "natural", label: "Natural" },
  { value: "fuller", label: "Fuller" },
  { value: "rounder", label: "Rounder" },
  { value: "more-projected", label: "More Projected" },
];

export const STOMACH_OPTIONS: OptionDef[] = [
  { value: "natural", label: "Natural" },
  { value: "flatter", label: "Flatter" },
  { value: "softly-toned", label: "Softly Toned" },
  { value: "more-defined", label: "More Defined" },
];

export const PROPORTION_BALANCE_OPTIONS: OptionDef[] = [
  { value: "natural", label: "Natural" },
  { value: "soft-glam", label: "Soft Glam" },
  { value: "sculpted", label: "Sculpted" },
  { value: "dramatic", label: "Dramatic" },
];

export const REALISM_LEVEL_OPTIONS: OptionDef[] = [
  { value: "natural-realistic", label: "Natural Realistic" },
  { value: "polished-realistic", label: "Polished Realistic" },
  { value: "glam-enhanced", label: "Glam Enhanced" },
];

export const OUTPUT_COUNT_OPTIONS = [1, 2, 4] as const;

export const FRAMING_OPTIONS: OptionDef[] = [
  { value: "full-body-front", label: "Full Body Front" },
  { value: "full-body-3-4", label: "Full Body 3/4" },
  { value: "full-body-side", label: "Full Body Side" },
  { value: "full-body-back", label: "Full Body Back" },
  { value: "seated", label: "Seated" },
  { value: "standing-portrait", label: "Standing Portrait" },
];

export const BACKGROUND_OPTIONS: OptionDef[] = [
  { value: "preserve-original", label: "Preserve Original Background" },
  { value: "clean-studio", label: "Clean Studio" },
  { value: "transparent-neutral", label: "Transparent / Neutral Background" },
];

export const WARDROBE_OPTIONS: OptionDef[] = [
  { value: "preserve-outfit", label: "Preserve Original Outfit" },
  { value: "keep-outfit-locked", label: "Keep Outfit Locked" },
];

export const ASPECT_RATIO_OPTIONS: OptionDef[] = [
  { value: "9:16", label: "9:16" },
  { value: "4:5", label: "4:5" },
  { value: "1:1", label: "1:1" },
];

export const REFERENCE_SLOT_LABELS = [
  "Front view",
  "Side view",
  "Back view",
  "Close-up face reference",
  "Additional reference",
];

export const ADJUSTMENT_OPTIONS: OptionDef[] = [
  { value: "more-waist-definition", label: "More waist definition" },
  { value: "less-waist-definition", label: "Less waist definition" },
  { value: "fuller-hips", label: "Fuller hips" },
  { value: "less-hip-volume", label: "Less hip volume" },
  { value: "fuller-thighs", label: "Fuller thighs" },
  { value: "less-thigh-volume", label: "Less thigh volume" },
  { value: "fuller-bust", label: "Fuller bust" },
  { value: "less-bust-volume", label: "Less bust volume" },
  { value: "fuller-glutes", label: "Fuller glutes" },
  { value: "less-glute-volume", label: "Less glute volume" },
  { value: "more-natural", label: "More natural" },
  { value: "more-sculpted", label: "More sculpted" },
];

export const LOCKABLE_TRAITS: { key: string; label: string; defaultOn: boolean; locked?: boolean }[] = [
  { key: "face", label: "Face", defaultOn: true },
  { key: "skinTone", label: "Skin Tone", defaultOn: true },
  { key: "hairstyle", label: "Hairstyle", defaultOn: true },
  { key: "makeup", label: "Makeup", defaultOn: true },
  { key: "tattoos", label: "Tattoos", defaultOn: true },
  { key: "outfit", label: "Outfit", defaultOn: true },
  { key: "jewelry", label: "Jewelry", defaultOn: true },
  { key: "nails", label: "Nails", defaultOn: true },
  { key: "accessories", label: "Accessories", defaultOn: true },
];

export const GENERATING_MESSAGES = [
  "Reading your references…",
  "Locking identity…",
  "Balancing proportions…",
  "Preserving complexion…",
  "Building your results…",
];
