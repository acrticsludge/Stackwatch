import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Cached per-request user fetch.
 * Uses getUser() (server-verified) instead of getSession() (cookie-only, unverified).
 * Called from layout + multiple pages — only one Auth round-trip per request.
 */
export const getSession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { user };
});

/**
 * Cached per-request subscription fetch.
 * RLS ensures only the current user's row is returned — no user_id filter needed.
 * Called from layout, dashboard, integrations, alerts, settings — deduplicated automatically.
 */
export const getSubscription = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("tier, status, trial_ends_at, next_billing_at, cancel_at_period_end, past_due_since")
    .in("status", ["active", "trialing", "past_due"])
    .maybeSingle();

  if (!data) return null;

  // Enforce 3-day grace period: past the window, treat as free (return null).
  if (data.status === "past_due") {
    const gracePeriodMs = 3 * 24 * 60 * 60 * 1000;
    const since = data.past_due_since ? new Date(data.past_due_since).getTime() : 0;
    if (Date.now() - since > gracePeriodMs) return null;
  }

  return data;
});
