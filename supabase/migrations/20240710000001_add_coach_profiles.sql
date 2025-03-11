-- Create coach_profiles table
CREATE TABLE IF NOT EXISTS coach_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  specialties TEXT,
  certifications TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_coach_profiles_user_id ON coach_profiles(user_id);

-- Enable RLS
ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Coaches can view their own profiles"
  ON coach_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Coaches can update their own profiles"
  ON coach_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Coaches can insert their own profiles"
  ON coach_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for coach avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('coach-avatars', 'coach-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy to allow authenticated users to upload their own avatars
CREATE POLICY "Anyone can view coach avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'coach-avatars');

CREATE POLICY "Authenticated users can upload coach avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'coach-avatars');

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'coach-avatars');
