import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SettingsContent } from "./SettingsContent";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();

  const [
    { data: user },
    { data: integrations },
    { data: alertConfigs },
    { data: alertChannels },
    { data: subscription },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("integrations")
      .select("id, service, account_label")
      .neq("status", "disconnected"),
    supabase.from("alert_configs").select("*"),
    supabase.from("alert_channels").select("id, type, config, enabled"),
    supabase.from("subscriptions").select("tier").eq("status", "active").maybeSingle(),
  ]);

  // Auto-provision email channel for users who signed up before this was added
  const userObj = user?.user;
  if (userObj) {
    const hasEmail = (alertChannels ?? []).some((c) => c.type === "email");
    if (!hasEmail) {
      await supabase.from("alert_channels").insert({
        user_id: userObj.id,
        type: "email",
        config: { email: userObj.email },
        enabled: true,
      });
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-zinc-500 text-sm mt-1">Configure alert thresholds and notification channels.</p>
      </div>
      <SettingsContent
        userEmail={user.user?.email ?? ""}
        integrations={integrations ?? []}
        alertConfigs={alertConfigs ?? []}
        alertChannels={alertChannels ?? []}
        tier={subscription?.tier ?? "free"}
      />
    </div>
  );
}
