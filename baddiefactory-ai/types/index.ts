export type SkinTone =
  | "fair"
  | "light"
  | "medium"
  | "olive"
  | "tan"
  | "caramel"
  | "brown"
  | "deep"
  | "ebony"
  | "custom";

export type BodyType =
  | "slim"
  | "athletic"
  | "curvy"
  | "thick"
  | "hourglass"
  | "bbl-style"
  | "custom";

export type HairStyle =
  | "bustdown"
  | "curly"
  | "bob"
  | "braids"
  | "ponytail"
  | "pixie"
  | "waves"
  | "custom";

export type HairColor =
  | "black"
  | "blonde"
  | "brown"
  | "red"
  | "blue"
  | "pink"
  | "custom";

export type EyeColor =
  | "brown"
  | "hazel"
  | "green"
  | "blue"
  | "grey"
  | "custom";

export type Aesthetic =
  | "soft-girl"
  | "gym-baddie"
  | "cosplay-girl"
  | "rich-girl"
  | "gamer-girl"
  | "girlfriend"
  | "college-girl"
  | "custom";

export type ContentPack =
  | "selfie"
  | "bed-selfie"
  | "gym"
  | "cosplay"
  | "mirror-selfie"
  | "vacation"
  | "rich-girl-lifestyle"
  | "girlfriend-tease"
  | "fanvue-tease"
  | "tiktok-viral"
  | "custom";

export type CameraStyle =
  | "candid"
  | "portrait"
  | "selfie-angle"
  | "overhead"
  | "low-angle"
  | "wide-shot"
  | "close-up";

export type Mood =
  | "confident"
  | "playful"
  | "sultry"
  | "candid"
  | "fierce"
  | "soft"
  | "mysterious";

export type Pose =
  | "standing"
  | "sitting"
  | "laying"
  | "mirror"
  | "walking"
  | "posing"
  | "candid";

export interface InfluencerProfile {
  id: string;
  user_id: string;
  name: string;
  skin_tone: SkinTone;
  skin_tone_custom?: string;
  body_type: BodyType;
  body_type_custom?: string;
  hair_style: HairStyle;
  hair_style_custom?: string;
  hair_color: HairColor;
  hair_color_custom?: string;
  eye_color: EyeColor;
  eye_color_custom?: string;
  aesthetic: Aesthetic;
  aesthetic_custom?: string;
  avatar_url?: string;
  total_generations?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface IdentityLock {
  id: string;
  influencer_id: string;
  face_description: string;
  body_description: string;
  skin_tone_description: string;
  hair_description: string;
  eye_description: string;
  style_dna: string;
  prompt_seed: string;
  reference_image_url?: string;
  created_at: string;
}

export interface GeneratedPrompt {
  id: string;
  influencer_id: string;
  user_id: string;
  content_pack: ContentPack;
  outfit: string;
  location: string;
  pose: Pose;
  camera_style: CameraStyle;
  mood: Mood;
  custom_pack_name?: string;
  full_prompt: string;
  image_url?: string;
  status: "pending" | "generating" | "complete" | "failed";
  created_at: string;
}

export interface ContentPackConfig {
  id: ContentPack;
  label: string;
  description: string;
  icon: string;
  defaultOutfit: string;
  defaultLocation: string;
  defaultPose: Pose;
  defaultMood: Mood;
}

export interface PromptBuilderState {
  influencer_id: string;
  content_pack: ContentPack;
  outfit: string;
  location: string;
  pose: Pose;
  camera_style: CameraStyle;
  mood: Mood;
  custom_pack_name?: string;
  custom_prompt_additions?: string;
}

export interface NanoBananaRequest {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  guidance_scale?: number;
  seed?: number;
}

export interface NanoBananaResponse {
  id: string;
  status: "pending" | "processing" | "complete" | "failed";
  image_url?: string;
  error?: string;
}
