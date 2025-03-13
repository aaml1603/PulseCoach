-- Create a function to create a storage bucket

CREATE OR REPLACE FUNCTION create_storage_bucket(bucket_name TEXT, is_public BOOLEAN DEFAULT TRUE)
RETURNS VOID
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the bucket exists
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE name = bucket_name
    ) THEN
        -- Create the bucket
        INSERT INTO storage.buckets (id, name, public)
        VALUES (bucket_name, bucket_name, is_public);
        
        -- Create policies for the bucket
        -- Read policy
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Public Read Access',
            bucket_name,
            'SELECT',
            format('(bucket_id = ''%s''::text)', bucket_name)::jsonb
        );
        
        -- Insert policy
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Authenticated Users Can Insert',
            bucket_name,
            'INSERT',
            format('(bucket_id = ''%s''::text AND auth.role() = ''authenticated''::text)', bucket_name)::jsonb
        );
        
        -- Update policy
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Authenticated Users Can Update',
            bucket_name,
            'UPDATE',
            format('(bucket_id = ''%s''::text AND auth.role() = ''authenticated''::text)', bucket_name)::jsonb
        );
        
        -- Delete policy
        INSERT INTO storage.policies (name, bucket_id, operation, definition)
        VALUES (
            'Authenticated Users Can Delete',
            bucket_name,
            'DELETE',
            format('(bucket_id = ''%s''::text AND auth.role() = ''authenticated''::text)', bucket_name)::jsonb
        );
        
        RAISE NOTICE 'Created bucket % with policies', bucket_name;
    ELSE
        RAISE NOTICE 'Bucket % already exists', bucket_name;
    END IF;
END
$$;