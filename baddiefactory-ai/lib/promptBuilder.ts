import type {
  IdentityLock,
  InfluencerProfile,
  PromptBuilderState,
  ContentPackConfig,
  ContentPack,
} from "@/types";

export const CONTENT_PACK_CONFIGS: Record<ContentPack, ContentPackConfig> = {
  selfie: {
    id: "selfie",
    label: "Selfie Pack",
    description: "Casual selfies for social media",
    icon: "📸",
    defaultOutfit: "trendy casual streetwear, crop top, high-waisted jeans",
    defaultLocation: "bedroom with ring light, modern apartment",
    defaultPose: "posing" as const,
    defaultMood: "confident",
  },
  "bed-selfie": {
    id: "bed-selfie",
    label: "Bed Selfie Pack",
    description: "Cozy morning and night vibes",
    icon: "🛏️",
    defaultOutfit: "silk pajamas, oversized t-shirt, lingerie set",
    defaultLocation: "luxury bedroom with white sheets, dimly lit boudoir",
    defaultPose: "laying" as const,
    defaultMood: "soft",
  },
  gym: {
    id: "gym",
    label: "Gym Pack",
    description: "Fitness and workout content",
    icon: "💪",
    defaultOutfit: "matching gym set, sports bra and leggings, compression shorts",
    defaultLocation: "modern gym, outdoor fitness area, home gym setup",
    defaultPose: "posing" as const,
    defaultMood: "fierce",
  },
  cosplay: {
    id: "cosplay",
    label: "Cosplay Pack",
    description: "Character and costume content",
    icon: "🎭",
    defaultOutfit: "anime-inspired costume, fantasy character outfit",
    defaultLocation: "studio with themed backdrop, fantasy setting",
    defaultPose: "posing" as const,
    defaultMood: "playful",
  },
  "mirror-selfie": {
    id: "mirror-selfie",
    label: "Mirror Selfie Pack",
    description: "Full-body mirror shots",
    icon: "🪞",
    defaultOutfit: "stylish OOTD, designer pieces, fitted dress",
    defaultLocation: "full-length mirror, boutique dressing room, luxury bathroom",
    defaultPose: "mirror" as const,
    defaultMood: "confident",
  },
  vacation: {
    id: "vacation",
    label: "Vacation Pack",
    description: "Travel and exotic location content",
    icon: "🌴",
    defaultOutfit: "bikini, sundress, resort wear, beach cover-up",
    defaultLocation: "tropical beach, luxury resort pool, Caribbean ocean",
    defaultPose: "candid" as const,
    defaultMood: "playful",
  },
  "rich-girl-lifestyle": {
    id: "rich-girl-lifestyle",
    label: "Rich Girl Lifestyle Pack",
    description: "Luxury and high-end lifestyle content",
    icon: "💎",
    defaultOutfit: "designer outfit, Hermes bag, Louboutin heels, luxury accessories",
    defaultLocation: "private jet, penthouse, luxury car, high-end restaurant",
    defaultPose: "posing" as const,
    defaultMood: "mysterious",
  },
  "girlfriend-tease": {
    id: "girlfriend-tease",
    label: "Girlfriend Tease Pack",
    description: "Intimate girlfriend aesthetic content",
    icon: "💕",
    defaultOutfit: "cute matching set, oversized hoodie, silk slip dress",
    defaultLocation: "cozy apartment, candlelit room, kitchen",
    defaultPose: "candid" as const,
    defaultMood: "soft",
  },
  "fanvue-tease": {
    id: "fanvue-tease",
    label: "Fanvue Tease Pack",
    description: "Premium subscription-style tease content",
    icon: "🔥",
    defaultOutfit: "lingerie set, bodysuit, bralette with high waisted bottoms",
    defaultLocation: "boudoir setup, luxury hotel room, dark studio",
    defaultPose: "posing" as const,
    defaultMood: "sultry",
  },
  "tiktok-viral": {
    id: "tiktok-viral",
    label: "TikTok Viral Pack",
    description: "Trendy, high-energy social media content",
    icon: "📱",
    defaultOutfit: "trendy outfit, Y2K fashion, athleisure, streetwear",
    defaultLocation: "urban street, coffee shop, trendy restaurant, rooftop",
    defaultPose: "candid" as const,
    defaultMood: "playful",
  },
  custom: {
    id: "custom",
    label: "Custom Pack",
    description: "Your own custom content pack",
    icon: "✨",
    defaultOutfit: "stylish outfit",
    defaultLocation: "photogenic location",
    defaultPose: "posing" as const,
    defaultMood: "confident",
  },
};

export function buildIdentityLockFromProfile(
  profile: InfluencerProfile
): Omit<IdentityLock, "id" | "influencer_id" | "created_at"> {
  const skinTone =
    profile.skin_tone === "custom"
      ? profile.skin_tone_custom || "medium brown"
      : profile.skin_tone;

  const bodyType =
    profile.body_type === "custom"
      ? profile.body_type_custom || "curvy"
      : profile.body_type;

  const hairStyle =
    profile.hair_style === "custom"
      ? profile.hair_style_custom || "flowing"
      : profile.hair_style;

  const hairColor =
    profile.hair_color === "custom"
      ? profile.hair_color_custom || "dark"
      : profile.hair_color;

  const eyeColor =
    profile.eye_color === "custom"
      ? profile.eye_color_custom || "brown"
      : profile.eye_color;

  const aesthetic =
    profile.aesthetic === "custom"
      ? profile.aesthetic_custom || "stylish"
      : profile.aesthetic;

  const faceDescription = `beautiful adult woman, 21-30 years old, ${skinTone} skin, ${eyeColor} eyes, defined facial features, high cheekbones, full lips, symmetrical face`;

  const bodyDescription = `${bodyType} figure, ${skinTone} complexion, toned ${bodyType === "athletic" ? "muscular" : ""} body, adult female physique`;

  const hairDescription = `${hairColor} hair styled in ${hairStyle}`;

  const styleDescription = `${aesthetic} aesthetic, ${aesthetic.replace("-", " ")} fashion style`;

  const styleDNA = `${profile.name} - ${aesthetic} influencer, ${skinTone} skin, ${bodyType} body, ${hairColor} ${hairStyle} hair, ${eyeColor} eyes`;

  const promptSeed = `IDENTITY:${profile.name.toLowerCase().replace(/\s+/g, "_")}_${skinTone}_${bodyType}_${hairColor}_${hairStyle}`;

  return {
    face_description: faceDescription,
    body_description: bodyDescription,
    skin_tone_description: `${skinTone} skin tone, even complexion, natural glow`,
    hair_description: hairDescription,
    eye_description: `${eyeColor} eyes, defined lashes, expressive gaze`,
    style_dna: styleDNA,
    prompt_seed: promptSeed,
    reference_image_url: profile.avatar_url,
  };
}

export function buildFullPrompt(
  state: PromptBuilderState,
  identity: IdentityLock,
  packConfig: ContentPackConfig
): string {
  const outfit = state.outfit || packConfig.defaultOutfit;
  const location = state.location || packConfig.defaultLocation;
  const pose = state.pose || packConfig.defaultPose;
  const mood = state.mood || packConfig.defaultMood;
  const cameraStyle = state.camera_style;

  const identityBlock = [
    identity.face_description,
    identity.body_description,
    identity.hair_description,
    identity.eye_description,
    identity.skin_tone_description,
  ].join(", ");

  const cameraDescriptions: Record<string, string> = {
    candid: "candid shot, natural lighting",
    portrait: "professional portrait, studio lighting, bokeh background",
    "selfie-angle": "selfie angle, front camera, natural light",
    overhead: "overhead angle, aerial perspective",
    "low-angle": "low angle shot, dynamic perspective",
    "wide-shot": "wide angle shot, environmental portrait",
    "close-up": "close-up shot, detailed focus",
  };

  const moodDescriptions: Record<string, string> = {
    confident: "confident expression, direct eye contact, powerful stance",
    playful: "playful smile, fun energy, carefree expression",
    sultry: "sultry gaze, seductive expression, alluring pose",
    candid: "natural candid moment, authentic expression",
    fierce: "fierce look, strong energy, bold presence",
    soft: "soft expression, gentle smile, warm energy",
    mysterious: "mysterious gaze, enigmatic expression, aloof confidence",
  };

  const poseDescriptions: Record<string, string> = {
    standing: "standing pose, full body",
    sitting: "sitting pose, relaxed position",
    laying: "laying down, reclined position",
    mirror: "mirror selfie, phone in hand, full body reflection",
    walking: "walking confidently, motion shot",
    posing: "modeling pose, professional stance",
    candid: "caught in a candid moment, natural position",
  };

  const safetyPreamble =
    "photorealistic photo, professional photography, adult woman 21+, ";

  const negativePrompt =
    "IMPORTANT: adult woman only, 21 years or older, no minors, no underage appearance";

  const fullPrompt = [
    safetyPreamble,
    identityBlock,
    `wearing ${outfit}`,
    `at ${location}`,
    poseDescriptions[pose] || pose,
    cameraDescriptions[cameraStyle] || cameraStyle,
    moodDescriptions[mood] || mood,
    `${packConfig.label} style`,
    identity.style_dna,
    "8k quality, highly detailed, professional photography",
    negativePrompt,
  ]
    .filter(Boolean)
    .join(", ");

  return fullPrompt;
}

export function getSeedFromIdentity(identity: IdentityLock): number {
  let hash = 0;
  for (let i = 0; i < identity.prompt_seed.length; i++) {
    const char = identity.prompt_seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
