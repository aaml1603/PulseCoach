-- Fix RLS policies for progress_pictures table and storage.objects again

-- Disable RLS on progress_pictures table temporarily
ALTER TABLE IF EXISTS progress_pictures DISABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to perform all operations on progress pictures
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON progress_pictures;
CREATE POLICY "Allow all operations for authenticated users"
  ON progress_pictures
  FOR ALL
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
