-- Create storage schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS storage;

-- Create storage.buckets table if it doesn't exist
CREATE TABLE IF NOT EXISTS storage.buckets (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  owner UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  public BOOLEAN DEFAULT FALSE
);

-- Create storage.objects table if it doesn't exist
CREATE TABLE IF NOT EXISTS storage.objects (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id TEXT NOT NULL REFERENCES storage.buckets(id),
  name TEXT NOT NULL,
  owner UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  path_tokens TEXT[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED,
  UNIQUE (bucket_id, name)
);

-- Create storage.policies table if it doesn't exist
CREATE TABLE IF NOT EXISTS storage.policies (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bucket_id TEXT NOT NULL REFERENCES storage.buckets(id),
  operation TEXT NOT NULL,
  definition JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (bucket_id, name)
);

-- Create progress-pictures bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'progress-pictures', 'progress-pictures', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'progress-pictures');

-- Create read policy if it doesn't exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'policies') THEN
    INSERT INTO storage.policies (name, bucket_id, operation, definition)
    SELECT 'Public Read Access', 'progress-pictures', 'SELECT', '{"bucket_id": "progress-pictures"}'::jsonb
    WHERE NOT EXISTS (SELECT 1 FROM storage.policies WHERE bucket_id = 'progress-pictures' AND operation = 'SELECT');
  END IF;
END
$$;

-- Create insert policy if it doesn't exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'policies') THEN
    INSERT INTO storage.policies (name, bucket_id, operation, definition)
    SELECT 'Authenticated Users Can Insert', 'progress-pictures', 'INSERT', '{"bucket_id": "progress-pictures", "auth.role()": "authenticated"}'::jsonb
    WHERE NOT EXISTS (SELECT 1 FROM storage.policies WHERE bucket_id = 'progress-pictures' AND operation = 'INSERT');
  END IF;
END
$$;
