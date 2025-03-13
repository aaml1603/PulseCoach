-- Additional fix for notifications access control

-- Ensure notifications table has proper RLS policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can only view their own notifications" ON notifications;

-- Create comprehensive policies for notifications
CREATE POLICY "Users can only view their own notifications"
  ON notifications
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can only update their own notifications"
  ON notifications
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can only delete their own notifications"
  ON notifications
  FOR DELETE
  USING (user_id = auth.uid());

-- Ensure realtime is enabled for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
