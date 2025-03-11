-- Add access_token column to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS access_token UUID DEFAULT gen_random_uuid();
ALTER TABLE clients ADD COLUMN IF NOT EXISTS access_token_expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_access_token ON clients(access_token);
