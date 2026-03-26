-- Tracks which onboarding emails have been sent to each user.
-- Used to ensure each email type is sent exactly once per user.
CREATE TABLE IF NOT EXISTS public.onboarding_emails (
  id       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id  uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type     text        NOT NULL, -- 'welcome' | 'first_integration' | 'first_sync' | 'activation_nudge'
  sent_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, type)
);

ALTER TABLE public.onboarding_emails ENABLE ROW LEVEL SECURITY;
-- No user-facing policies: only the service role writes to this table.
