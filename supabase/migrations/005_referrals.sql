-- Referral codes
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  uses_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral uses
CREATE TABLE IF NOT EXISTS public.referral_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code_id UUID NOT NULL REFERENCES public.referral_codes(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referral_code_id, referred_user_id)
);

-- User blocks
CREATE TABLE IF NOT EXISTS public.user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, blocked_user_id)
);

-- User reports
CREATE TABLE IF NOT EXISTS public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  message_id UUID REFERENCES public.room_messages(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parent view links (premium feature)
CREATE TABLE IF NOT EXISTS public.parent_view_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_uses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_view_links ENABLE ROW LEVEL SECURITY;

-- Referral policies
CREATE POLICY "Users manage own referral codes"
  ON public.referral_codes FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read referral codes by code"
  ON public.referral_codes FOR SELECT
  USING (TRUE);

CREATE POLICY "Users read own referral uses"
  ON public.referral_uses FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.referral_codes WHERE id = referral_code_id AND user_id = auth.uid())
  );

CREATE POLICY "System can insert referral uses"
  ON public.referral_uses FOR INSERT
  WITH CHECK (TRUE);

-- Block policies
CREATE POLICY "Users manage own blocks"
  ON public.user_blocks FOR ALL
  USING (auth.uid() = user_id);

-- Report policies
CREATE POLICY "Users can create reports"
  ON public.user_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can read reports"
  ON public.user_reports FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND email LIKE '%@cohort.app')
  );

-- Parent view policies
CREATE POLICY "Users manage own parent links"
  ON public.parent_view_links FOR ALL
  USING (auth.uid() = user_id);
