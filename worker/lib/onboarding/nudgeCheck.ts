import type { SupabaseClient } from "@supabase/supabase-js";
import { sendActivationNudgeEmail } from "./emails";

const NUDGE_DELAY_MS = 24 * 60 * 60 * 1000; // 24 hours after signup

export async function runActivationNudgeCheck(
  supabase: SupabaseClient
): Promise<void> {
  // Fetch all auth users (requires service role key)
  const { data, error: usersError } = await supabase.auth.admin.listUsers({
    perPage: 1000,
  });
  if (usersError || !data) {
    console.error("[nudgeCheck] Failed to fetch users:", usersError?.message);
    return;
  }

  // Users who signed up more than 24 hours ago and have an email
  const cutoff = Date.now() - NUDGE_DELAY_MS;
  const candidates = data.users.filter(
    (u) => u.email && new Date(u.created_at).getTime() < cutoff
  );

  if (candidates.length === 0) return;

  const candidateIds = candidates.map((u) => u.id);

  // Which of these already received the nudge?
  const { data: alreadySent } = await supabase
    .from("onboarding_emails")
    .select("user_id")
    .eq("type", "activation_nudge")
    .in("user_id", candidateIds);

  const sentSet = new Set((alreadySent ?? []).map((r: { user_id: string }) => r.user_id));

  // Which of these have at least one active integration?
  const { data: withIntegrations } = await supabase
    .from("integrations")
    .select("user_id")
    .in("user_id", candidateIds)
    .neq("status", "disconnected");

  const integratedSet = new Set(
    (withIntegrations ?? []).map((r: { user_id: string }) => r.user_id)
  );

  // Nudge users who: signed up > 24h ago + no integrations + not yet nudged
  const toNudge = candidates.filter(
    (u) => !sentSet.has(u.id) && !integratedSet.has(u.id)
  );

  if (toNudge.length === 0) return;

  console.log(`[nudgeCheck] Sending activation nudge to ${toNudge.length} user(s).`);

  await Promise.allSettled(
    toNudge.map(async (user) => {
      try {
        await sendActivationNudgeEmail(user.email!);
        // Record as sent — unique constraint prevents duplicates on retry
        const { error: insertError } = await supabase
          .from("onboarding_emails")
          .insert({ user_id: user.id, type: "activation_nudge" });
        if (insertError && insertError.code !== "23505") {
          console.error(`[nudgeCheck] DB insert failed for ${user.id}:`, insertError.message);
        } else {
          console.log(`[nudgeCheck] Nudge sent to user ${user.id}`);
        }
      } catch (err) {
        console.error(
          `[nudgeCheck] Failed for user ${user.id}:`,
          err instanceof Error ? err.message : String(err)
        );
      }
    })
  );
}
