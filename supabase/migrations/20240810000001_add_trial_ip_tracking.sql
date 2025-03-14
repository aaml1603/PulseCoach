-- Create a table to track IP addresses used for trial signups
CREATE TABLE IF NOT EXISTS trial_ip_tracking (
  ip_address TEXT PRIMARY KEY,
  count INTEGER DEFAULT 1,
  first_signup_at TIMESTAMPTZ DEFAULT NOW(),
  last_signup_at TIMESTAMPTZ DEFAULT NOW(),
  last_user_id UUID REFERENCES auth.users(id)
);

-- Add RLS policies
ALTER TABLE trial_ip_tracking ENABLE ROW LEVEL SECURITY;

-- Only allow service role to access this table
CREATE POLICY "Only service role can access trial_ip_tracking"
  ON trial_ip_tracking
  USING (auth.role() = 'service_role');

-- Create a function to increment the count for an IP address
CREATE OR REPLACE FUNCTION increment_ip_trial_count(ip TEXT, user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO trial_ip_tracking (ip_address, last_user_id)
  VALUES (ip, user_id)
  ON CONFLICT (ip_address) DO UPDATE
  SET 
    count = trial_ip_tracking.count + 1,
    last_signup_at = NOW(),
    last_user_id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a function to check if an email has been used for a trial before
CREATE OR REPLACE FUNCTION has_used_trial(check_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  trial_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE email = check_email
    AND trial_start_date IS NOT NULL
  ) INTO trial_exists;
  
  RETURN trial_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
