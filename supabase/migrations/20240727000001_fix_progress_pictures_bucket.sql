-- Create the progress_pictures bucket if it doesn't exist already
BEGIN;
  -- Check if the bucket exists
  DO $$
  DECLARE
    bucket_exists BOOLEAN;
  BEGIN
    SELECT EXISTS (
      SELECT 1 FROM storage.buckets WHERE name = 'progress_pictures'
    ) INTO bucket_exists;

    IF NOT bucket_exists THEN
      -- Create the bucket
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('progress_pictures', 'progress_pictures', true);

      -- Set up security policies for the bucket
      -- Allow coaches to read their clients' progress pictures
      INSERT INTO storage.policies (name, definition, bucket_id)
      VALUES (
        'Coaches can view their clients progress pictures',
        'bucket_id = ''progress_pictures'' AND (storage.foldername(name))[1] = auth.uid()::text',
        'progress_pictures'
      );

      -- Allow coaches to upload progress pictures for their clients
      INSERT INTO storage.policies (name, definition, bucket_id)
      VALUES (
        'Coaches can upload progress pictures',
        'bucket_id = ''progress_pictures'' AND (storage.foldername(name))[1] = auth.uid()::text',
        'progress_pictures'
      );

      -- Allow coaches to delete progress pictures for their clients
      INSERT INTO storage.policies (name, definition, bucket_id)
      VALUES (
        'Coaches can delete progress pictures',
        'bucket_id = ''progress_pictures'' AND (storage.foldername(name))[1] = auth.uid()::text',
        'progress_pictures'
      );
    END IF;
  END
  $$;
COMMIT;