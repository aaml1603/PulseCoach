-- Create progress-pictures bucket if it doesn't exist
DO $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  -- Check if the bucket already exists
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'progress-pictures'
  ) INTO bucket_exists;

  -- Create the bucket if it doesn't exist
  IF NOT bucket_exists THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('progress-pictures', 'progress-pictures', true);
    
    -- Set up RLS policies for the bucket
    -- Allow authenticated users to read from the bucket
    INSERT INTO storage.policies (name, definition, bucket_id)
    VALUES (
      'Progress Pictures Read Policy',
      'auth.role() = ''authenticated''',
      'progress-pictures'
    );
    
    -- Allow authenticated users to insert into the bucket
    INSERT INTO storage.policies (name, definition, bucket_id, operation)
    VALUES (
      'Progress Pictures Insert Policy',
      'auth.role() = ''authenticated''',
      'progress-pictures',
      'INSERT'
    );
    
    -- Allow authenticated users to update their own files
    INSERT INTO storage.policies (name, definition, bucket_id, operation)
    VALUES (
      'Progress Pictures Update Policy',
      'auth.role() = ''authenticated''',
      'progress-pictures',
      'UPDATE'
    );
    
    -- Allow authenticated users to delete their own files
    INSERT INTO storage.policies (name, definition, bucket_id, operation)
    VALUES (
      'Progress Pictures Delete Policy',
      'auth.role() = ''authenticated''',
      'progress-pictures',
      'DELETE'
    );
  END IF;
END
$$;