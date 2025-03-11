-- Add client_specific and client_id columns to workouts table
ALTER TABLE workouts
ADD COLUMN client_specific BOOLEAN DEFAULT FALSE,
ADD COLUMN client_id UUID NULL REFERENCES clients(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX idx_workouts_client_id ON workouts(client_id) WHERE client_id IS NOT NULL;
