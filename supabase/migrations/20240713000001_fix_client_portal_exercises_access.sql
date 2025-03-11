-- Create a policy to allow public access to exercises table for reading
-- This ensures clients can view exercises in the client portal
DROP POLICY IF EXISTS "Allow public read access" ON exercises;
CREATE POLICY "Allow public read access"
  ON exercises FOR SELECT
  USING (true);

-- Make sure exercises are included in realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE exercises;
