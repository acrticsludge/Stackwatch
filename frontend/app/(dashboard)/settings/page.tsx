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
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("integrations")
      .select("id, service, account_label")
      .neq("status", "disconnected"),
    supabase.from("alert_configs").select("*"),
    supabase.from("alert_channels").select("id, type, config, enabled"),
  ]);

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
      />
    </div>
  );
}
