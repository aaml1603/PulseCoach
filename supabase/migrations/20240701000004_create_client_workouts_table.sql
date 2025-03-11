-- Create client_workouts table to assign workouts to clients
CREATE TABLE IF NOT EXISTS client_workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'assigned',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id, workout_id, assigned_date)
);

-- Create client_workout_logs table to track client workout completion
CREATE TABLE IF NOT EXISTS client_workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_workout_id UUID NOT NULL REFERENCES client_workouts(id) ON DELETE CASCADE,
  completed_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration INTEGER, -- in minutes
  feedback TEXT,
  difficulty_rating INTEGER, -- 1-10 scale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_exercise_logs table to track individual exercise performance
CREATE TABLE IF NOT EXISTS client_exercise_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_workout_log_id UUID NOT NULL REFERENCES client_workout_logs(id) ON DELETE CASCADE,
  workout_exercise_id UUID NOT NULL REFERENCES workout_exercises(id),
  sets_completed INTEGER,
  reps_completed INTEGER,
  weight NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE client_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_exercise_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for client_workouts
DROP POLICY IF EXISTS "Coaches can view their client workouts" ON client_workouts;
CREATE POLICY "Coaches can view their client workouts"
ON client_workouts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_workouts.client_id
    AND clients.coach_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Coaches can insert their client workouts" ON client_workouts;
CREATE POLICY "Coaches can insert their client workouts"
ON client_workouts FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_workouts.client_id
    AND clients.coach_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Coaches can update their client workouts" ON client_workouts;
CREATE POLICY "Coaches can update their client workouts"
ON client_workouts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_workouts.client_id
    AND clients.coach_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Coaches can delete their client workouts" ON client_workouts;
CREATE POLICY "Coaches can delete their client workouts"
ON client_workouts FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_workouts.client_id
    AND clients.coach_id = auth.uid()
  )
);

-- Create policies for client_workout_logs
DROP POLICY IF EXISTS "Coaches can view their client workout logs" ON client_workout_logs;
CREATE POLICY "Coaches can view their client workout logs"
ON client_workout_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM client_workouts
    JOIN clients ON clients.id = client_workouts.client_id
    WHERE client_workouts.id = client_workout_logs.client_workout_id
    AND clients.coach_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Coaches can insert their client workout logs" ON client_workout_logs;
CREATE POLICY "Coaches can insert their client workout logs"
ON client_workout_logs FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM client_workouts
    JOIN clients ON clients.id = client_workouts.client_id
    WHERE client_workouts.id = client_workout_logs.client_workout_id
    AND clients.coach_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Coaches can update their client workout logs" ON client_workout_logs;
CREATE POLICY "Coaches can update their client workout logs"
ON client_workout_logs FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM client_workouts
    JOIN clients ON clients.id = client_workouts.client_id
    WHERE client_workouts.id = client_workout_logs.client_workout_id
    AND clients.coach_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Coaches can delete their client workout logs" ON client_workout_logs;
CREATE POLICY "Coaches can delete their client workout logs"
ON client_workout_logs FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM client_workouts
    JOIN clients ON clients.id = client_workouts.client_id
    WHERE client_workouts.id = client_workout_logs.client_workout_id
    AND clients.coach_id = auth.uid()
  )
);

-- Create policies for client_exercise_logs
DROP POLICY IF EXISTS "Coaches can view their client exercise logs" ON client_exercise_logs;
CREATE POLICY "Coaches can view their client exercise logs"
ON client_exercise_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM client_workout_logs
    JOIN client_workouts ON client_workouts.id = client_workout_logs.client_workout_id
    JOIN clients ON clients.id = client_workouts.client_id
    WHERE client_workout_logs.id = client_exercise_logs.client_workout_log_id
    AND clients.coach_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Coaches can insert their client exercise logs" ON client_exercise_logs;
CREATE POLICY "Coaches can insert their client exercise logs"
ON client_exercise_logs FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM client_workout_logs
    JOIN client_workouts ON client_workouts.id = client_workout_logs.client_workout_id
    JOIN clients ON clients.id = client_workouts.client_id
    WHERE client_workout_logs.id = client_exercise_logs.client_workout_log_id
    AND clients.coach_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Coaches can update their client exercise logs" ON client_exercise_logs;
CREATE POLICY "Coaches can update their client exercise logs"
ON client_exercise_logs FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM client_workout_logs
    JOIN client_workouts ON client_workouts.id = client_workout_logs.client_workout_id
    JOIN clients ON clients.id = client_workouts.client_id
    WHERE client_workout_logs.id = client_exercise_logs.client_workout_log_id
    AND clients.coach_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Coaches can delete their client exercise logs" ON client_exercise_logs;
CREATE POLICY "Coaches can delete their client exercise logs"
ON client_exercise_logs FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM client_workout_logs
    JOIN client_workouts ON client_workouts.id = client_workout_logs.client_workout_id
    JOIN clients ON clients.id = client_workouts.client_id
    WHERE client_workout_logs.id = client_exercise_logs.client_workout_log_id
    AND clients.coach_id = auth.uid()
  )
);

-- Enable realtime
alter publication supabase_realtime add table client_workouts;
alter publication supabase_realtime add table client_workout_logs;
alter publication supabase_realtime add table client_exercise_logs;
