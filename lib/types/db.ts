// Hand-written types mirroring supabase/schema.sql.
// If the schema changes, regenerate with:
//   npx supabase gen types typescript --project-id <id> > lib/types/db.ts
// and re-merge the domain helper types below.

export type ReferenceType = "front" | "side" | "back" | "face" | "other";
export type BodySessionStatus =
  | "draft"
  | "submitted"
  | "generating"
  | "completed"
  | "failed";
export type GenerationStatus = "queued" | "processing" | "completed" | "failed";

export interface BodySettings {
  overallDirection: string;
  waist: string;
  hips: string;
  thighs: string;
  bust: string;
  glutes: string;
  stomach: string;
  proportionBalance: string;
  realismLevel: string;
  customNotes: string;
}

export interface LockedTraits {
  face: boolean;
  skinTone: boolean;
  hairstyle: boolean;
  makeup: boolean;
  tattoos: boolean;
  outfit: boolean;
  jewelry: boolean;
  nails: boolean;
  accessories: boolean;
}

export interface GenerationSettings {
  outputCount: 1 | 2 | 4;
  framing: string;
  background: string;
  wardrobe: string;
  aspectRatio: "9:16" | "4:5" | "1:1";
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      characters: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          primary_reference_url: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["characters"]["Row"]> & {
          user_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["characters"]["Row"]>;
        Relationships: [];
      };
      character_references: {
        Row: {
          id: string;
          character_id: string;
          image_url: string;
          position: number;
          reference_type: ReferenceType;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["character_references"]["Row"]
        > & {
          character_id: string;
          image_url: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["character_references"]["Row"]
        >;
        Relationships: [];
      };
      body_sessions: {
        Row: {
          id: string;
          user_id: string;
          character_id: string | null;
          body_settings_json: BodySettings;
          locked_traits_json: LockedTraits;
          status: BodySessionStatus;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["body_sessions"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["body_sessions"]["Row"]>;
        Relationships: [];
      };
      generations: {
        Row: {
          id: string;
          user_id: string;
          character_id: string | null;
          body_session_id: string | null;
          source_image_url: string;
          generated_image_url: string | null;
          generation_provider: string;
          status: GenerationStatus;
          favorite: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["generations"]["Row"]> & {
          user_id: string;
          source_image_url: string;
        };
        Update: Partial<Database["public"]["Tables"]["generations"]["Row"]>;
        Relationships: [];
      };
      credits: {
        Row: {
          id: string;
          user_id: string;
          balance: number;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["credits"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["credits"]["Row"]>;
        Relationships: [];
      };
      generation_events: {
        Row: {
          id: string;
          generation_id: string;
          event_type: string;
          metadata_json: Record<string, unknown>;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["generation_events"]["Row"]
        > & {
          generation_id: string;
          event_type: string;
        };
        Update: Partial<Database["public"]["Tables"]["generation_events"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type CharacterRow = Database["public"]["Tables"]["characters"]["Row"];
export type CharacterReferenceRow =
  Database["public"]["Tables"]["character_references"]["Row"];
export type BodySessionRow = Database["public"]["Tables"]["body_sessions"]["Row"];
export type GenerationRow = Database["public"]["Tables"]["generations"]["Row"];
export type CreditsRow = Database["public"]["Tables"]["credits"]["Row"];
