-- Insert a test subscription for the current user
-- Replace 'YOUR_USER_ID' with the actual user ID you want to give a subscription to
INSERT INTO subscriptions (
  user_id,
  status,
  price_id,
  stripe_price_id,
  interval,
  currency,
  amount,
  current_period_start,
  current_period_end,
  created_at,
  updated_at
) VALUES (
  'YOUR_USER_ID', -- Replace with your actual user ID
  'active',
  'coach_pro_plan',
  'price_test',
  'month',
  'usd',
  2000,
  extract(epoch from now()),
  extract(epoch from (now() + interval '1 month')),
  now(),
  now()
);
