-- Create a storage bucket for coach avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('coach-avatars', 'coach-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up public access policy for the coach-avatars bucket
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT
USING (bucket_id = 'coach-avatars');

-- Allow authenticated users to upload to the coach-avatars bucket
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'coach-avatars');

-- Allow users to update their own avatars
CREATE POLICY "Users can update own avatars" ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'coach-avatars');

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete own avatars" ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'coach-avatars');
