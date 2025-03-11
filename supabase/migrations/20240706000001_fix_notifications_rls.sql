-- Disable RLS for notifications table
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- In case we need to create policies in the future, we'll set up a basic one
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR ALL
  USING (true);
