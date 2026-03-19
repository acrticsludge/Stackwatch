import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/queries/user";
import { METRIC_LABELS, SERVICE_LABELS, relativeTime } from "@/lib/utils";
import { Badge } from "@/app/components/ui/badge";
import { TIER_LIMITS } from "@/lib/tiers";

export const metadata: Metadata = { title: "Alert History" };

export default async function AlertsPage() {
  const supabase = await createClient();

  // subscription served from cache — no extra DB round-trip
  const subscription = await getSubscription();

  const tier = (subscription?.tier as keyof typeof TIER_LIMITS) ?? "free";
  const historyDays = TIER_LIMITS[tier]?.historyDays ?? TIER_LIMITS.free.historyDays;
  const since = new Date(Date.now() - historyDays * 24 * 60 * 60 * 1000).toISOString();

  // Single query with join — eliminates the sequential integrations waterfall
  const { data: history } = await supabase
    .from("alert_history")
    .select(
      "id, metric_name, percent_used, channel, sent_at, integration_id, integration:integrations(id, service, account_label)",
    )
    .gte("sent_at", since)
    .order("sent_at", { ascending: false })
    .limit(200);

  const rows = history ?? [];

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Alert History
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {rows.length > 0
              ? `${rows.length} alert${rows.length !== 1 ? "s" : ""} in the last ${historyDays} days`
              : `A log of alerts from the last ${historyDays} days`}
          </p>
        </div>
        {tier === "free" && (
          <a
            href="/settings?tab=billing"
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            7-day history · <span className="underline underline-offset-2">Upgrade for 30 days</span>
          </a>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-14 w-14 rounded-xl bg-white/4 border border-white/6 flex items-center justify-center mb-4">
            <svg
              className="h-7 w-7 text-zinc-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-white mb-1">
            No alerts yet
          </h2>
          <p className="text-zinc-600 text-sm max-w-xs">
            Alerts will appear here when your usage crosses a threshold.
          </p>
        </div>
      ) : (
        <div className="bg-[#111] border border-white/6 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/6 bg-white/2">
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-600 uppercase tracking-wide">
                  Service
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-600 uppercase tracking-wide">
                  Metric
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-600 uppercase tracking-wide">
                  Usage
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-600 uppercase tracking-wide">
                  Channel
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-600 uppercase tracking-wide">
                  When
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {rows.map((row) => {
                const intg = Array.isArray(row.integration)
                  ? row.integration[0]
                  : row.integration;
                const pct = Math.round(row.percent_used);
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-white/2 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-zinc-200">
                        {intg
                          ? (SERVICE_LABELS[intg.service] ?? intg.service)
                          : "—"}
                      </p>
                      {intg && (
                        <p className="text-xs text-zinc-600">
                          {intg.account_label}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-zinc-400">
                      {METRIC_LABELS[row.metric_name] ?? row.metric_name}
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        variant={
                          pct >= 80
                            ? "danger"
                            : pct >= 60
                              ? "warning"
                              : "success"
                        }
                      >
                        {pct}%
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-zinc-500 capitalize">
                      {row.channel}
                    </td>
                    <td className="px-5 py-3 text-zinc-700 text-xs">
                      {relativeTime(row.sent_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
