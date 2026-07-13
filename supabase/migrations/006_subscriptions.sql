-- Subscriptions table (Lemon Squeezy)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lemon_squeezy_id TEXT UNIQUE,
  status TEXT DEFAULT 'incomplete' CHECK (status IN ('incomplete', 'active', 'past_due', 'canceled', 'expired', 'trialing')),
  plan TEXT DEFAULT 'monthly' CHECK (plan IN ('monthly', 'yearly')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Function to check if user is premium
CREATE OR REPLACE FUNCTION public.is_premium(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  has_active BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = p_user_id AND status = 'active'
    AND (current_period_end IS NULL OR current_period_end > NOW())
  ) INTO has_active;

  -- Also check the users.premium flag
  IF NOT has_active THEN
    SELECT premium INTO has_active FROM public.users WHERE id = p_user_id;
  END IF;

  RETURN has_active;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
