-- Create coach feedback table
CREATE TABLE IF NOT EXISTS coach_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE coach_feedback ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting feedback (users can only insert their own feedback)
DROP POLICY IF EXISTS "Users can insert their own feedback" ON coach_feedback;
CREATE POLICY "Users can insert their own feedback"
  ON coach_feedback
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy for selecting feedback (users can only see their own feedback)
DROP POLICY IF EXISTS "Users can view their own feedback" ON coach_feedback;
CREATE POLICY "Users can view their own feedback"
  ON coach_feedback
  FOR SELECT
  USING (auth.uid() = user_id);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE coach_feedback;
