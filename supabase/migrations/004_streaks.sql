-- Study streaks per day
CREATE TABLE IF NOT EXISTS public.study_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Function to calculate current streak
CREATE OR REPLACE FUNCTION public.calculate_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  streak INTEGER := 0;
  current_date DATE := CURRENT_DATE;
  streak_date DATE;
  has_today BOOLEAN;
BEGIN
  -- Check if studied today (15+ min)
  SELECT EXISTS (
    SELECT 1 FROM public.study_streaks
    WHERE user_id = p_user_id AND date = current_date AND total_minutes >= 15
  ) INTO has_today;

  IF has_today THEN
    streak := 1;
    streak_date := current_date - 1;
  ELSE
    -- Check yesterday (to continue streak)
    SELECT EXISTS (
      SELECT 1 FROM public.study_streaks
      WHERE user_id = p_user_id AND date = current_date - 1 AND total_minutes >= 15
    ) INTO has_today;

    IF NOT has_today THEN
      RETURN 0;
    END IF;

    streak := 1;
    streak_date := current_date - 2;
  END IF;

  -- Count consecutive days backwards
  WHILE EXISTS (
    SELECT 1 FROM public.study_streaks
    WHERE user_id = p_user_id AND date = streak_date AND total_minutes >= 15
  ) LOOP
    streak := streak + 1;
    streak_date := streak_date - 1;
  END LOOP;

  RETURN streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update user streak count
CREATE OR REPLACE FUNCTION public.update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  new_streak INTEGER;
  current_longest INTEGER;
BEGIN
  new_streak := public.calculate_streak(NEW.user_id);

  SELECT longest_streak INTO current_longest FROM public.users WHERE id = NEW.user_id;

  UPDATE public.users
  SET
    streak_count = new_streak,
    longest_streak = GREATEST(current_longest, new_streak),
    total_focus_minutes = (
      SELECT COALESCE(SUM(total_minutes), 0) FROM public.study_streaks WHERE user_id = NEW.user_id
    )
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_study_streak_changed ON public.study_streaks;
CREATE TRIGGER on_study_streak_changed
  AFTER INSERT OR UPDATE ON public.study_streaks
  FOR EACH ROW EXECUTE FUNCTION public.update_user_streak();

-- Enable RLS
ALTER TABLE public.study_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own streaks"
  ON public.study_streaks FOR ALL
  USING (auth.uid() = user_id);
