CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_from_client BOOLEAN NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Coaches can view their client messages"
ON messages
FOR SELECT
USING (coach_id = auth.uid());

CREATE POLICY "Coaches can insert messages to their clients"
ON messages
FOR INSERT
WITH CHECK (coach_id = auth.uid());

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
