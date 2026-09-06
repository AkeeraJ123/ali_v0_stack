"use client";

import { create } from "zustand";
import type {
  BodySettings,
  GenerationSettings,
  LockedTraits,
  ReferenceType,
} from "@/lib/types/db";
import type { GenerationResultItem } from "@/lib/types/results";

export interface WizardReferenceImage {
  id: string;
  file?: File;
  previewUrl: string;
  storageUrl?: string;
  referenceType: ReferenceType;
  position: number;
  isPrimary: boolean;
}

const DEFAULT_BODY_SETTINGS: BodySettings = {
  overallDirection: "natural-hourglass",
  waist: "natural",
  hips: "natural",
  thighs: "natural",
  bust: "natural",
  glutes: "natural",
  stomach: "natural",
  proportionBalance: "natural",
  realismLevel: "polished-realistic",
  customNotes: "",
};

const DEFAULT_LOCKED_TRAITS: LockedTraits = {
  face: true,
  skinTone: true,
  hairstyle: true,
  makeup: true,
  tattoos: true,
  outfit: true,
  jewelry: true,
  nails: true,
  accessories: true,
};

const DEFAULT_GENERATION_SETTINGS: GenerationSettings = {
  outputCount: 2,
  framing: "full-body-front",
  background: "preserve-original",
  wardrobe: "preserve-outfit",
  aspectRatio: "9:16",
};

interface WizardState {
  characterId: string | null;
  characterName: string;
  references: WizardReferenceImage[];
  bodySettings: BodySettings;
  lockedTraits: LockedTraits;
  generationSettings: GenerationSettings;
  lastBatchId: string | null;
  lastGeneratedImageUrl: string | null;
  results: GenerationResultItem[];
  generationError: string | null;

  setCharacterName: (name: string) => void;
  addReferences: (files: File[]) => void;
  removeReference: (id: string) => void;
  reorderReferences: (fromIndex: number, toIndex: number) => void;
  setPrimary: (id: string) => void;
  setReferenceType: (id: string, type: ReferenceType) => void;
  setStorageUrl: (id: string, url: string) => void;
  updateBodySettings: (patch: Partial<BodySettings>) => void;
  updateLockedTraits: (patch: Partial<LockedTraits>) => void;
  updateGenerationSettings: (patch: Partial<GenerationSettings>) => void;
  setLastBatch: (batchId: string) => void;
  setLastGeneratedImageUrl: (url: string) => void;
  setResults: (results: GenerationResultItem[]) => void;
  toggleFavorite: (id: string) => void;
  setGenerationError: (message: string | null) => void;
  reset: () => void;
}

let refCounter = 0;
function nextId() {
  refCounter += 1;
  return `ref_${Date.now()}_${refCounter}`;
}

export const useWizardStore = create<WizardState>((set, get) => ({
  characterId: null,
  characterName: "",
  references: [],
  bodySettings: DEFAULT_BODY_SETTINGS,
  lockedTraits: DEFAULT_LOCKED_TRAITS,
  generationSettings: DEFAULT_GENERATION_SETTINGS,
  lastBatchId: null,
  lastGeneratedImageUrl: null,
  results: [],
  generationError: null,

  setCharacterName: (name) => set({ characterName: name }),

  addReferences: (files) => {
    const existing = get().references;
    const startPosition = existing.length;
    const additions: WizardReferenceImage[] = files.slice(0, 5 - existing.length).map((file, i) => ({
      id: nextId(),
      file,
      previewUrl: URL.createObjectURL(file),
      referenceType: (["front", "side", "back", "face", "other"] as ReferenceType[])[
        Math.min(startPosition + i, 4)
      ],
      position: startPosition + i,
      isPrimary: existing.length === 0 && i === 0,
    }));
    set({ references: [...existing, ...additions] });
  },

  removeReference: (id) => {
    const remaining = get()
      .references.filter((r) => r.id !== id)
      .map((r, i) => ({ ...r, position: i }));
    if (remaining.length > 0 && !remaining.some((r) => r.isPrimary)) {
      remaining[0].isPrimary = true;
    }
    set({ references: remaining });
  },

  reorderReferences: (fromIndex, toIndex) => {
    const list = [...get().references];
    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);
    set({ references: list.map((r, i) => ({ ...r, position: i })) });
  },

  setPrimary: (id) => {
    set({
      references: get().references.map((r) => ({ ...r, isPrimary: r.id === id })),
    });
  },

  setReferenceType: (id, type) => {
    set({
      references: get().references.map((r) =>
        r.id === id ? { ...r, referenceType: type } : r
      ),
    });
  },

  setStorageUrl: (id, url) => {
    set({
      references: get().references.map((r) =>
        r.id === id ? { ...r, storageUrl: url } : r
      ),
    });
  },

  updateBodySettings: (patch) =>
    set({ bodySettings: { ...get().bodySettings, ...patch } }),

  updateLockedTraits: (patch) =>
    set({ lockedTraits: { ...get().lockedTraits, ...patch, } }),

  updateGenerationSettings: (patch) =>
    set({ generationSettings: { ...get().generationSettings, ...patch } }),

  setLastBatch: (batchId) => set({ lastBatchId: batchId }),
  setLastGeneratedImageUrl: (url) => set({ lastGeneratedImageUrl: url }),
  setResults: (results) => set({ results }),
  toggleFavorite: (id) =>
    set({
      results: get().results.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)),
    }),
  setGenerationError: (message) => set({ generationError: message }),

  reset: () =>
    set({
      characterId: null,
      characterName: "",
      references: [],
      bodySettings: DEFAULT_BODY_SETTINGS,
      lockedTraits: DEFAULT_LOCKED_TRAITS,
      generationSettings: DEFAULT_GENERATION_SETTINGS,
      lastBatchId: null,
      lastGeneratedImageUrl: null,
      results: [],
      generationError: null,
    }),
}));
