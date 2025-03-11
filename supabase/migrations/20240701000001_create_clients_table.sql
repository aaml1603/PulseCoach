-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  goal TEXT,
  notes TEXT,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policy to allow coaches to see only their clients
DROP POLICY IF EXISTS "Coaches can view their own clients" ON clients;
CREATE POLICY "Coaches can view their own clients"
ON clients FOR SELECT
USING (coach_id = auth.uid());

-- Create policy to allow coaches to insert their own clients
DROP POLICY IF EXISTS "Coaches can insert their own clients" ON clients;
CREATE POLICY "Coaches can insert their own clients"
ON clients FOR INSERT
WITH CHECK (coach_id = auth.uid());

-- Create policy to allow coaches to update their own clients
DROP POLICY IF EXISTS "Coaches can update their own clients" ON clients;
CREATE POLICY "Coaches can update their own clients"
ON clients FOR UPDATE
USING (coach_id = auth.uid());

-- Create policy to allow coaches to delete their own clients
DROP POLICY IF EXISTS "Coaches can delete their own clients" ON clients;
CREATE POLICY "Coaches can delete their own clients"
ON clients FOR DELETE
USING (coach_id = auth.uid());

-- Enable realtime
alter publication supabase_realtime add table clients;
