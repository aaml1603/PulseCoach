-- Create progress-pictures bucket if it doesn't exist
DO $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  -- Check if the bucket exists
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'progress-pictures'
  ) INTO bucket_exists;

  -- Create the bucket if it doesn't exist
  IF NOT bucket_exists THEN
    INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
    VALUES ('progress-pictures', 'progress-pictures', false, false, 5242880, NULL);
    
    -- Add RLS policies for the bucket
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Allow authenticated users to read progress pictures',
      'progress-pictures',
      '{
        "statements": [{
          "effect": "allow",
          "principal": { "authenticated": true },
          "actions": ["select"],
          "resources": ["storage/progress-pictures/*"]
        }]
      }'
    );
    
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Allow authenticated users to upload progress pictures',
      'progress-pictures',
      '{
        "statements": [{
          "effect": "allow",
          "principal": { "authenticated": true },
          "actions": ["insert"],
          "resources": ["storage/progress-pictures/*"]
        }]
      }'
    );
    
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Allow authenticated users to delete progress pictures',
      'progress-pictures',
      '{
        "statements": [{
          "effect": "allow",
          "principal": { "authenticated": true },
          "actions": ["delete"],
          "resources": ["storage/progress-pictures/*"]
        }]
      }'
    );
    
    RAISE NOTICE 'Created progress-pictures bucket with policies';
  ELSE
    RAISE NOTICE 'progress-pictures bucket already exists';
  END IF;
END
$$;