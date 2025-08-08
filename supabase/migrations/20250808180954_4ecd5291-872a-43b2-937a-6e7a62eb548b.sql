-- Step 1: Add 'investor' enum value in its own transaction so it can be referenced later
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_type t 
    JOIN pg_enum e ON t.oid = e.enumtypid 
    WHERE t.typname = 'subscription_tier' 
      AND e.enumlabel = 'investor'
  ) THEN
    ALTER TYPE public.subscription_tier ADD VALUE 'investor';
  END IF;
END
$$;