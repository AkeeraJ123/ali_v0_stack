import type {
  BodySettings,
  GenerationSettings,
  LockedTraits,
  ReferenceType,
} from "@/lib/types/db";

export interface GenerateRequestBody {
  characterId?: string | null;
  characterName?: string;
  referenceImages: { url: string; referenceType: ReferenceType; position: number }[];
  bodySettings: BodySettings;
  lockedTraits: LockedTraits;
  generationSettings: GenerationSettings;
  refinementOf?: {
    generatedImageUrl: string;
    adjustmentInstructions: string;
  };
}

export interface GenerationResultItem {
  id: string;
  sourceUrl: string;
  generatedUrl: string;
  favorite: boolean;
}

export interface GenerateResponseBody {
  batchId: string;
  characterId: string | null;
  bodySessionId: string | null;
  provider: string;
  generations: GenerationResultItem[];
}
