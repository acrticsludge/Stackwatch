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

// Supabase free tier limits
const FREE_TIER_LIMITS = {
  db_size_mb: 500,
  storage_mb: 1_000,
  monthly_active_users: 50_000,
};

async function runQuery(
  projectRef: string,
  token: string,
  query: string
): Promise<Record<string, unknown>[]> {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );

  if (res.status === 401) throw new Error("Supabase: Invalid or expired Management API token.");
  if (res.status === 403) throw new Error("Supabase: Token lacks permission to query the database.");
  if (res.status === 404) throw new Error(`Supabase: Project '${projectRef}' not found or database query endpoint unavailable.`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Supabase database query error: ${res.status} — ${body}`);
  }

  return res.json() as Promise<Record<string, unknown>[]>;
}

export async function fetchSupabaseUsage(
  integration: Integration
): Promise<UsageMetric[]> {
  const token = decrypt(integration.api_key);
  // NEVER log token

  const projectRef = (integration.meta as { project_ref?: string } | null)
    ?.project_ref;

  if (!projectRef) {
    throw new Error("Supabase integration missing project_ref in meta.");
  }

  const metrics: UsageMetric[] = [];

  // ── DB size ──────────────────────────────────────────────────────────────
  const dbRows = await runQuery(
    projectRef,
    token,
    "SELECT pg_database_size(current_database()) AS db_bytes"
  );
  const dbBytes = Number(dbRows[0]?.db_bytes ?? 0);
  const dbMb = Math.round((dbBytes / (1024 * 1024)) * 100) / 100;
  metrics.push({
    metricName: "db_size_mb",
    currentValue: dbMb,
    limitValue: FREE_TIER_LIMITS.db_size_mb,
    percentUsed: Math.round((dbMb / FREE_TIER_LIMITS.db_size_mb) * 10000) / 100,
  });

  // ── Monthly active users ──────────────────────────────────────────────────
  const mauRows = await runQuery(
    projectRef,
    token,
    "SELECT COUNT(*)::int AS mau FROM auth.users WHERE last_sign_in_at >= date_trunc('month', now())"
  );
  const mau = Number(mauRows[0]?.mau ?? 0);
  metrics.push({
    metricName: "monthly_active_users",
    currentValue: mau,
    limitValue: FREE_TIER_LIMITS.monthly_active_users,
    percentUsed: Math.round((mau / FREE_TIER_LIMITS.monthly_active_users) * 10000) / 100,
  });

  // ── Storage ───────────────────────────────────────────────────────────────
  // Sum sizes across all storage buckets
  const bucketsRes = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/storage/buckets`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (bucketsRes.ok) {
    const buckets = await bucketsRes.json() as Array<{ size?: number }>;
    const totalBytes = buckets.reduce((sum, b) => sum + (b.size ?? 0), 0);
    const storageMb = Math.round((totalBytes / (1024 * 1024)) * 100) / 100;
    metrics.push({
      metricName: "storage_mb",
      currentValue: storageMb,
      limitValue: FREE_TIER_LIMITS.storage_mb,
      percentUsed: Math.round((storageMb / FREE_TIER_LIMITS.storage_mb) * 10000) / 100,
    });
  } else {
    console.warn(`[supabase] Could not fetch storage buckets for project '${projectRef}': ${bucketsRes.status}`);
  }

  return metrics;
}
