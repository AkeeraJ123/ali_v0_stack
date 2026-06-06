-- BaddieFactory AI - Supabase Schema
-- Run this in the Supabase SQL editor to set up all tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- Extends Supabase auth.users with app-specific data
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'elite')),
  credits INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- INFLUENCERS TABLE
-- Core influencer profiles created by users
-- ============================================================
CREATE TABLE IF NOT EXISTS public.influencers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  skin_tone TEXT NOT NULL CHECK (skin_tone IN ('fair', 'light', 'medium', 'olive', 'tan', 'caramel', 'brown', 'deep', 'ebony', 'custom')),
  skin_tone_custom TEXT,
  body_type TEXT NOT NULL CHECK (body_type IN ('slim', 'athletic', 'curvy', 'thick', 'hourglass', 'bbl-style', 'custom')),
  body_type_custom TEXT,
  hair_style TEXT NOT NULL CHECK (hair_style IN ('bustdown', 'curly', 'bob', 'braids', 'ponytail', 'pixie', 'waves', 'custom')),
  hair_style_custom TEXT,
  hair_color TEXT NOT NULL CHECK (hair_color IN ('black', 'blonde', 'brown', 'red', 'blue', 'pink', 'custom')),
  hair_color_custom TEXT,
  eye_color TEXT NOT NULL CHECK (eye_color IN ('brown', 'hazel', 'green', 'blue', 'grey', 'custom')),
  eye_color_custom TEXT,
  aesthetic TEXT NOT NULL CHECK (aesthetic IN ('soft-girl', 'gym-baddie', 'cosplay-girl', 'rich-girl', 'gamer-girl', 'girlfriend', 'college-girl', 'custom')),
  aesthetic_custom TEXT,
  avatar_url TEXT,
  total_generations INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own influencers" ON public.influencers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create influencers" ON public.influencers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own influencers" ON public.influencers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own influencers" ON public.influencers
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- IDENTITY LOCKS TABLE
-- Locks the visual identity for each influencer
-- ============================================================
CREATE TABLE IF NOT EXISTS public.identity_locks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID NOT NULL REFERENCES public.influencers(id) ON DELETE CASCADE,
  face_description TEXT NOT NULL,
  body_description TEXT NOT NULL,
  skin_tone_description TEXT NOT NULL,
  hair_description TEXT NOT NULL,
  eye_description TEXT NOT NULL,
  style_dna TEXT NOT NULL,
  prompt_seed TEXT NOT NULL,
  reference_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(influencer_id)
);

ALTER TABLE public.identity_locks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own identity locks" ON public.identity_locks
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.influencers WHERE id = influencer_id)
  );

CREATE POLICY "Users can create identity locks" ON public.identity_locks
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.influencers WHERE id = influencer_id)
  );

CREATE POLICY "Users can update identity locks" ON public.identity_locks
  FOR UPDATE USING (
    auth.uid() = (SELECT user_id FROM public.influencers WHERE id = influencer_id)
  );

-- ============================================================
-- CONTENT PACKS TABLE
-- Predefined content pack configurations
-- ============================================================
CREATE TABLE IF NOT EXISTS public.content_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE,
  pack_type TEXT NOT NULL CHECK (pack_type IN (
    'selfie', 'bed-selfie', 'gym', 'cosplay', 'mirror-selfie',
    'vacation', 'rich-girl-lifestyle', 'girlfriend-tease',
    'fanvue-tease', 'tiktok-viral', 'custom'
  )),
  custom_name TEXT,
  images_generated INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.content_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own content packs" ON public.content_packs
  FOR SELECT USING (
    influencer_id IS NULL OR
    auth.uid() = (SELECT user_id FROM public.influencers WHERE id = influencer_id)
  );

-- ============================================================
-- GENERATED PROMPTS TABLE
-- Stores all prompt history and generated image URLs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.generated_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID NOT NULL REFERENCES public.influencers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content_pack TEXT NOT NULL,
  custom_pack_name TEXT,
  outfit TEXT NOT NULL,
  location TEXT NOT NULL,
  pose TEXT NOT NULL,
  camera_style TEXT NOT NULL,
  mood TEXT NOT NULL,
  custom_prompt_additions TEXT,
  full_prompt TEXT NOT NULL,
  image_url TEXT,
  generation_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'complete', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.generated_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prompts" ON public.generated_prompts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create prompts" ON public.generated_prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts" ON public.generated_prompts
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_influencers_user_id ON public.influencers(user_id);
CREATE INDEX IF NOT EXISTS idx_identity_locks_influencer_id ON public.identity_locks(influencer_id);
CREATE INDEX IF NOT EXISTS idx_generated_prompts_influencer_id ON public.generated_prompts(influencer_id);
CREATE INDEX IF NOT EXISTS idx_generated_prompts_user_id ON public.generated_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_prompts_status ON public.generated_prompts(status);
CREATE INDEX IF NOT EXISTS idx_generated_prompts_created_at ON public.generated_prompts(created_at DESC);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_influencers_updated_at
  BEFORE UPDATE ON public.influencers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Increment total_generations counter when a new prompt is created
CREATE OR REPLACE FUNCTION increment_influencer_generations()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.influencers
  SET total_generations = total_generations + 1
  WHERE id = NEW.influencer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_prompt_created
  AFTER INSERT ON public.generated_prompts
  FOR EACH ROW EXECUTE FUNCTION increment_influencer_generations();
