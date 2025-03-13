-- This migration updates the email configuration to use SendGrid
-- No database changes are needed, this is just for documentation purposes

COMMENT ON TABLE public.users IS 'User accounts with email sending now using SendGrid';
