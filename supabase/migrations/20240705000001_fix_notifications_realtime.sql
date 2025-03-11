-- Check if notifications table is already in the publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'notifications'
  ) THEN
    -- Only add if not already present
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;
END
$$;
