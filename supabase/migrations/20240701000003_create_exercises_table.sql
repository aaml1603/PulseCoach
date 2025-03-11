-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  muscle_group TEXT,
  equipment TEXT,
  difficulty TEXT,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout_exercises junction table
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  sets INTEGER DEFAULT 3,
  reps INTEGER DEFAULT 10,
  rest_time INTEGER DEFAULT 60,
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security on exercises
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to view exercises
DROP POLICY IF EXISTS "All users can view exercises" ON exercises;
CREATE POLICY "All users can view exercises"
ON exercises FOR SELECT
TO authenticated
USING (true);

-- Enable row level security on workout_exercises
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

-- Create policy to allow coaches to see workout exercises for their workouts
DROP POLICY IF EXISTS "Coaches can view their workout exercises" ON workout_exercises;
CREATE POLICY "Coaches can view their workout exercises"
ON workout_exercises FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = workout_exercises.workout_id
    AND workouts.coach_id = auth.uid()
  )
);

-- Create policy to allow coaches to insert workout exercises for their workouts
DROP POLICY IF EXISTS "Coaches can insert their workout exercises" ON workout_exercises;
CREATE POLICY "Coaches can insert their workout exercises"
ON workout_exercises FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = workout_exercises.workout_id
    AND workouts.coach_id = auth.uid()
  )
);

-- Create policy to allow coaches to update workout exercises for their workouts
DROP POLICY IF EXISTS "Coaches can update their workout exercises" ON workout_exercises;
CREATE POLICY "Coaches can update their workout exercises"
ON workout_exercises FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = workout_exercises.workout_id
    AND workouts.coach_id = auth.uid()
  )
);

-- Create policy to allow coaches to delete workout exercises for their workouts
DROP POLICY IF EXISTS "Coaches can delete their workout exercises" ON workout_exercises;
CREATE POLICY "Coaches can delete their workout exercises"
ON workout_exercises FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = workout_exercises.workout_id
    AND workouts.coach_id = auth.uid()
  )
);

-- Enable realtime
alter publication supabase_realtime add table exercises;
alter publication supabase_realtime add table workout_exercises;
