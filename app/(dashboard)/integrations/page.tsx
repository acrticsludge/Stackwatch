import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { IntegrationsContent } from "./IntegrationsContent";

export const metadata: Metadata = { title: "Integrations" };

export default async function IntegrationsPage() {
  const supabase = await createClient();

  const { data: integrations } = await supabase
    .from("integrations")
    .select("id, service, account_label, status, created_at, last_synced_at")
    .neq("status", "disconnected")
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Integrations</h1>
      <p className="text-slate-500 mb-8">
        Connect your services to start monitoring usage.
      </p>
      <IntegrationsContent integrations={integrations ?? []} />
    </div>
  );
}
