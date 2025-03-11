-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow coaches to see only their workouts
DROP POLICY IF EXISTS "Coaches can view their own workouts" ON workouts;
CREATE POLICY "Coaches can view their own workouts"
ON workouts FOR SELECT
USING (coach_id = auth.uid());

-- Create policy to allow coaches to insert their own workouts
DROP POLICY IF EXISTS "Coaches can insert their own workouts" ON workouts;
CREATE POLICY "Coaches can insert their own workouts"
ON workouts FOR INSERT
WITH CHECK (coach_id = auth.uid());

-- Create policy to allow coaches to update their own workouts
DROP POLICY IF EXISTS "Coaches can update their own workouts" ON workouts;
CREATE POLICY "Coaches can update their own workouts"
ON workouts FOR UPDATE
USING (coach_id = auth.uid());

-- Create policy to allow coaches to delete their own workouts
DROP POLICY IF EXISTS "Coaches can delete their own workouts" ON workouts;
CREATE POLICY "Coaches can delete their own workouts"
ON workouts FOR DELETE
USING (coach_id = auth.uid());

-- Enable realtime
alter publication supabase_realtime add table workouts;
