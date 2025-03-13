-- Create progress_pictures bucket if it doesn't exist
BEGIN;

-- Create the bucket using SQL instead of the Supabase CLI
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress_pictures', 'progress_pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the bucket
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload progress pictures"
ON storage.objects
FOR INSERT
TO authenticated
USING (bucket_id = 'progress_pictures');

-- Allow users to view their own client's progress pictures
CREATE POLICY "Allow coaches to view their client progress pictures"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'progress_pictures' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.clients WHERE coach_id = auth.uid()
  )
);

-- Allow users to delete their own client's progress pictures
CREATE POLICY "Allow coaches to delete their client progress pictures"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'progress_pictures' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.clients WHERE coach_id = auth.uid()
  )
);

-- Enable RLS on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

COMMIT;