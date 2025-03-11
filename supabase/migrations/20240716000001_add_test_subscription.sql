-- Get the current user ID from the auth.users table
DO $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get the first user from auth.users table
  SELECT id INTO current_user_id FROM auth.users LIMIT 1;
  
  -- Insert a test subscription for the user
  IF current_user_id IS NOT NULL THEN
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
      current_user_id,
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
    
    RAISE NOTICE 'Added test subscription for user %', current_user_id;
  ELSE
    RAISE NOTICE 'No users found in auth.users table';
  END IF;
END
$$;