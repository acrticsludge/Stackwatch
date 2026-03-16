import { decrypt } from "../lib/encryption";
import type { UsageMetric } from "../pollCycle";

interface Integration {
  id: string;
  user_id: string;
  service: string;
  account_label: string;
  api_key: string;
  meta: Record<string, unknown> | null;
}

export async function fetchVercelUsage(
  integration: Integration
): Promise<UsageMetric[]> {
  const token = decrypt(integration.api_key);
  // NEVER log token

  const res = await fetch("https://api.vercel.com/v2/billing/usage", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  switch (res.status) {
    case 401:
      throw new Error("Vercel: Invalid or expired API token.");
    case 403:
      throw new Error("Vercel: Token lacks billing read permissions.");
    case 404:
      // Vercel does not expose a public billing/usage API for Hobby accounts.
      // Return empty so the integration stays connected but shows no data.
      console.warn(
        `[vercel] Billing API unavailable for integration ${integration.id} — Hobby plan accounts are not supported.`
      );
      return [];
    case 429:
      throw new Error("Vercel: Rate limited. Will retry next cycle.");
  }

  if (!res.ok) {
    throw new Error(`Vercel billing API error: ${res.status}`);
  }

  const data = await res.json() as {
    bandwidth?: { usage: number; limit: number };
    buildMinutes?: { usage: number; limit: number };
    functionInvocations?: { usage: number; limit: number };
  };

  const metrics: UsageMetric[] = [];

  if (data.bandwidth) {
    const { usage, limit } = data.bandwidth;
    metrics.push({
      metricName: "bandwidth_gb",
      currentValue: Math.round((usage / (1024 ** 3)) * 100) / 100,
      limitValue: Math.round((limit / (1024 ** 3)) * 100) / 100,
      percentUsed: limit > 0 ? Math.round((usage / limit) * 10000) / 100 : 0,
    });
  }

  if (data.buildMinutes) {
    const { usage, limit } = data.buildMinutes;
    metrics.push({
      metricName: "build_minutes",
      currentValue: usage,
      limitValue: limit,
      percentUsed: limit > 0 ? Math.round((usage / limit) * 10000) / 100 : 0,
    });
  }

  if (data.functionInvocations) {
    const { usage, limit } = data.functionInvocations;
    metrics.push({
      metricName: "function_invocations",
      currentValue: usage,
      limitValue: limit,
      percentUsed: limit > 0 ? Math.round((usage / limit) * 10000) / 100 : 0,
    });
  }

  return metrics;
}
