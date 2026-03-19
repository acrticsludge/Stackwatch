import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Cached per-request session fetch.
 * Called from layout + multiple pages — only one DB round-trip per request.
 */
export const getSession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
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
    .select("tier")
    .eq("status", "active")
    .maybeSingle();
  return data;
});
