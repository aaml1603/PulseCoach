-- Create storage bucket for progress pictures if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-pictures', 'progress-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Set up public access policy for the bucket
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT
USING (bucket_id = 'progress-pictures');

-- Allow authenticated users to upload to this bucket
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'progress-pictures');

-- Allow users to update and delete their own objects
CREATE POLICY "Users can update their own objects" ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'progress-pictures' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own objects" ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'progress-pictures' AND auth.uid() = owner);
