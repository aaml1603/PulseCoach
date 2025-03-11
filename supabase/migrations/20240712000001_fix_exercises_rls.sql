-- Disable RLS on exercises table to allow coaches to create custom exercises
ALTER TABLE exercises DISABLE ROW LEVEL SECURITY;

-- Note: We're not adding to realtime publication since it's already a member
