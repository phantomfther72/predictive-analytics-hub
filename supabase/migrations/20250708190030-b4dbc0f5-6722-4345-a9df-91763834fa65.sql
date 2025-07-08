-- Update profiles table to include pro role and payment tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'guest',
ADD COLUMN IF NOT EXISTS paystack_customer_code text,
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS next_billing_date timestamp with time zone;

-- Create index for role queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Update RLS policies for role-based access
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can read their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create payments table for Paystack transactions
CREATE TABLE IF NOT EXISTS public.paystack_payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    paystack_reference text UNIQUE NOT NULL,
    amount integer NOT NULL,
    currency text DEFAULT 'NGN',
    status text DEFAULT 'pending',
    customer_email text NOT NULL,
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on paystack_payments
ALTER TABLE public.paystack_payments ENABLE ROW LEVEL SECURITY;

-- RLS policy for paystack_payments
CREATE POLICY "Users can view their own payments"
ON public.paystack_payments FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments"
ON public.paystack_payments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_paystack_payments_user_id ON public.paystack_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_paystack_payments_reference ON public.paystack_payments(paystack_reference);