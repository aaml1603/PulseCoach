-- Add gender and height columns to clients table
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS height NUMERIC;
