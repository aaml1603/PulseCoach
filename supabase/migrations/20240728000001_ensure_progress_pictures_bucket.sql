-- Create progress pictures bucket if it doesn't exist
BEGIN;

-- Check if the bucket exists
DO $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'progress-pictures'
  ) INTO bucket_exists;

  -- Create the bucket if it doesn't exist
  IF NOT bucket_exists THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('progress-pictures', 'progress-pictures', true);
    
    -- Set up security policies for the bucket
    INSERT INTO storage.policies (name, definition, bucket_id)
    VALUES 
    ('Public Read Access', 'bucket_id = ''progress-pictures''::text', 'progress-pictures'),
    ('Coach Upload Access', '(bucket_id = ''progress-pictures''::text) AND (auth.role() = ''authenticated''::text)', 'progress-pictures');
  END IF;
END
$$;

COMMIT;
