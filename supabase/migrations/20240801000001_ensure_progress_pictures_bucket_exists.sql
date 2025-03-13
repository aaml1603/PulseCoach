-- Create progress-pictures bucket if it doesn't exist
-- This is a more direct approach using SQL

DO $$
BEGIN
    -- Check if the bucket exists
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE name = 'progress-pictures'
    ) THEN
        -- Create the bucket
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('progress-pictures', 'progress-pictures', true);
        
        -- Create policies for the bucket
        -- Read policy
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Public Read Access',
            'progress-pictures',
            'SELECT',
            '(bucket_id = ''progress-pictures''::text)'::jsonb
        );
        
        -- Insert policy
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Authenticated Users Can Insert',
            'progress-pictures',
            'INSERT',
            '(bucket_id = ''progress-pictures''::text AND auth.role() = ''authenticated''::text)'::jsonb
        );
        
        -- Update policy
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Authenticated Users Can Update',
            'progress-pictures',
            'UPDATE',
            '(bucket_id = ''progress-pictures''::text AND auth.role() = ''authenticated''::text)'::jsonb
        );
        
        -- Delete policy
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Authenticated Users Can Delete',
            'progress-pictures',
            'DELETE',
            '(bucket_id = ''progress-pictures''::text AND auth.role() = ''authenticated''::text)'::jsonb
        );
        
        RAISE NOTICE 'Created progress-pictures bucket with policies';
    ELSE
        RAISE NOTICE 'progress-pictures bucket already exists';
    END IF;
END
$$;