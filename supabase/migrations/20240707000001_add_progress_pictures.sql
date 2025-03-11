-- Create progress_pictures table
CREATE TABLE IF NOT EXISTS progress_pictures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add realtime support
ALTER PUBLICATION supabase_realtime ADD TABLE progress_pictures;

-- Disable RLS for progress_pictures table
ALTER TABLE progress_pictures DISABLE ROW LEVEL SECURITY;
