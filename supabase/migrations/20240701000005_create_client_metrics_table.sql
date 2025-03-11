-- Create client_metrics table to track client progress metrics
CREATE TABLE IF NOT EXISTS client_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  weight NUMERIC,
  body_fat_percentage NUMERIC,
  chest_measurement NUMERIC,
  waist_measurement NUMERIC,
  hip_measurement NUMERIC,
  arm_measurement NUMERIC,
  thigh_measurement NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_goals table
CREATE TABLE IF NOT EXISTS client_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC,
  current_value NUMERIC,
  metric_type TEXT, -- weight, body_fat, strength, etc.
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  target_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'in_progress',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE client_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for client_metrics
DROP POLICY IF EXISTS "Coaches can view their client metrics" ON client_metrics;
CREATE POLICY "Coaches can view their client metrics"
ON client_metrics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_metrics.client_id
    AND clients.coach_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Coaches can insert their client metrics" ON client_metrics;
CREATE POLICY "Coaches can insert their client metrics"
ON client_metrics FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_metrics.client_id
    AND clients.coach_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Coaches can update their client metrics" ON client_metrics;
CREATE POLICY "Coaches can update their client metrics"
ON client_metrics FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_metrics.client_id
    AND clients.coach_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Coaches can delete their client metrics" ON client_metrics;
CREATE POLICY "Coaches can delete their client metrics"
ON client_metrics FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_metrics.client_id
    AND clients.coach_id = auth.uid()
  )
);

-- Create policies for client_goals
DROP POLICY IF EXISTS "Coaches can view their client goals" ON client_goals;
CREATE POLICY "Coaches can view their client goals"
ON client_goals FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_goals.client_id
    AND clients.coach_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Coaches can insert their client goals" ON client_goals;
CREATE POLICY "Coaches can insert their client goals"
ON client_goals FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_goals.client_id
    AND clients.coach_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Coaches can update their client goals" ON client_goals;
CREATE POLICY "Coaches can update their client goals"
ON client_goals FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_goals.client_id
    AND clients.coach_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Coaches can delete their client goals" ON client_goals;
CREATE POLICY "Coaches can delete their client goals"
ON client_goals FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_goals.client_id
    AND clients.coach_id = auth.uid()
  )
);

-- Enable realtime
alter publication supabase_realtime add table client_metrics;
alter publication supabase_realtime add table client_goals;
