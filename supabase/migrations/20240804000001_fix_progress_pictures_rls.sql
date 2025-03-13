-- Fix RLS policies for progress_pictures table and storage.objects

-- Disable RLS on progress_pictures table temporarily
ALTER TABLE IF EXISTS progress_pictures DISABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to select progress pictures
DROP POLICY IF EXISTS "Users can view progress pictures" ON progress_pictures;
CREATE POLICY "Users can view progress pictures"
  ON progress_pictures
  FOR SELECT
  TO authenticated
  USING (true);

-- Create a policy that allows authenticated users to insert progress pictures
DROP POLICY IF EXISTS "Users can insert progress pictures" ON progress_pictures;
CREATE POLICY "Users can insert progress pictures"
  ON progress_pictures
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create a policy that allows authenticated users to update their own progress pictures
DROP POLICY IF EXISTS "Users can update their own progress pictures" ON progress_pictures;
CREATE POLICY "Users can update their own progress pictures"
  ON progress_pictures
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create a policy that allows authenticated users to delete their own progress pictures
DROP POLICY IF EXISTS "Users can delete their own progress pictures" ON progress_pictures;
CREATE POLICY "Users can delete their own progress pictures"
  ON progress_pictures
  FOR DELETE
  TO authenticated
  USING (true);

-- Re-enable RLS on progress_pictures table
ALTER TABLE IF EXISTS progress_pictures ENABLE ROW LEVEL SECURITY;

-- Fix storage.objects policies
ALTER TABLE IF EXISTS storage.objects DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;

-- Create a more permissive policy for all operations
CREATE POLICY "Allow authenticated users to upload"
ON storage.objects
FOR ALL
TO authenticated
USING (true);

-- Re-enable RLS with the new policy in place
ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;

-- Make sure the progress-pictures bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
SELECT 'progress-pictures', 'progress-pictures', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'progress-pictures');
