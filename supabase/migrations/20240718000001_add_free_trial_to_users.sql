-- Add free trial fields to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMP WITH TIME ZONE;

-- Add function to calculate trial end date (7 days from start)
CREATE OR REPLACE FUNCTION calculate_trial_end_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.trial_start_date := CURRENT_TIMESTAMP;
  NEW.trial_end_date := CURRENT_TIMESTAMP + INTERVAL '7 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set trial dates for new users
DROP TRIGGER IF EXISTS set_trial_dates ON public.users;
CREATE TRIGGER set_trial_dates
BEFORE INSERT ON public.users
FOR EACH ROW
WHEN (NEW.trial_start_date IS NULL)
EXECUTE FUNCTION calculate_trial_end_date();
