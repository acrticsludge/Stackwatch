"use client";

import { motion } from "framer-motion";
import {
  getProgressColorClass,
  relativeTime,
  METRIC_LABELS,
  METRIC_UNITS,
  SERVICE_LABELS,
} from "@/lib/utils";
import { Badge } from "@/app/components/ui/badge";

interface UsageCardProps {
  service: string;
  accountLabel: string;
  metricName: string;
  currentValue: number;
  limitValue: number;
  percentUsed: number;
  lastSyncedAt: string | null;
  status: string;
}

const SERVICE_ICON_BG: Record<string, string> = {
  github: "bg-white/5",
  vercel: "bg-white/5",
  supabase: "bg-white/5",
};

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  github: (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 text-zinc-200"
    >
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  vercel: (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 text-zinc-200"
    >
      <path d="M24 22.525H0l12-21.05 12 21.05z" />
    </svg>
  ),
  supabase: (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 text-emerald-400"
    >
      <path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C.01 13.21-.876 14.11 0 14.11h11.16l.085 8.54c.015.986 1.26 1.41 1.875.637l9.26-11.652c.755-1.162-.13-2.75-1.04-2.75H12.027l-.128-7.849z" />
    </svg>
  ),
  railway: (
    <svg viewBox="0 0 1024 1024" fill="currentColor" className="h-4 w-4 text-zinc-200">
      <path d="M4.756 438.175A520.713 520.713 0 0 0 0 489.735h777.799c-2.716-5.306-6.365-10.09-10.045-14.772-132.97-171.791-204.498-156.896-306.819-161.26-34.114-1.403-57.249-1.967-193.037-1.967-72.677 0-151.688.185-228.628.39-9.96 26.884-19.566 52.942-24.243 74.14h398.571v51.909H4.756ZM783.93 541.696H.399c.82 13.851 2.112 27.517 3.978 40.999h723.39c32.248 0 50.299-18.297 56.162-40.999ZM45.017 724.306S164.941 1018.77 511.46 1024c207.112 0 385.071-123.006 465.907-299.694H45.017Z" />
      <path d="M511.454 0C319.953 0 153.311 105.16 65.31 260.612c68.771-.144 202.704-.226 202.704-.226h.031v-.051c158.309 0 164.193.707 195.118 1.998l19.149.706c66.7 2.224 148.683 9.384 213.19 58.19 35.015 26.471 85.571 84.896 115.708 126.52 27.861 38.499 35.876 82.756 16.933 125.158-17.436 38.97-54.952 62.215-100.383 62.215H16.69s4.233 17.944 10.58 37.751h970.632A510.385 510.385 0 0 0 1024 512.218C1024.01 229.355 794.532 0 511.454 0Z" />
    </svg>
  ),
};

function getStatusBadgeVariant(pct: number): "success" | "warning" | "danger" {
  if (pct >= 80) return "danger";
  if (pct >= 60) return "warning";
  return "success";
}

function getDarkProgressClass(pct: number) {
  if (pct >= 80) return "bg-red-500";
  if (pct >= 60) return "bg-amber-500";
  return "bg-blue-500";
}

export function UsageCard({
  service,
  accountLabel,
  metricName,
  currentValue,
  limitValue,
  percentUsed,
  lastSyncedAt,
  status,
}: UsageCardProps) {
  const pct = Math.round(percentUsed);
  const unit = METRIC_UNITS[metricName] ?? "";
  const label = METRIC_LABELS[metricName] ?? metricName;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="group bg-[#111] border border-white/6 rounded-xl p-5 hover:border-white/10 hover:shadow-lg hover:shadow-black/30 transition-[border-color,box-shadow] duration-300 cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`h-8 w-8 rounded-lg ${SERVICE_ICON_BG[service] ?? "bg-white/5"} border border-white/6 flex items-center justify-center shrink-0`}
          >
            {SERVICE_ICONS[service]}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-100">
              {SERVICE_LABELS[service] ?? service}
            </p>
            <p className="text-xs text-zinc-600">{accountLabel}</p>
          </div>
        </div>
        <Badge variant={getStatusBadgeVariant(pct)}>{pct}%</Badge>
      </div>

      <p className="text-xs text-zinc-600 mb-2">{label}</p>

      <div className="h-1.5 w-full rounded-full bg-white/6 mb-2 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getDarkProgressClass(pct)}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-600">
          {currentValue.toLocaleString()} / {limitValue.toLocaleString()} {unit}
        </span>
        <span className="text-xs text-zinc-600">{pct}% used</span>
      </div>

      <div className="mt-3 pt-3 border-t border-white/4 flex items-center justify-between">
        <span className="text-xs text-zinc-700">
          {lastSyncedAt
            ? `Synced ${relativeTime(lastSyncedAt)}`
            : "Never synced"}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 text-xs ${
            status === "connected"
              ? "text-green-500"
              : status === "error"
                ? "text-red-400"
                : "text-zinc-600"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              status === "connected"
                ? "bg-green-500"
                : status === "error"
                  ? "bg-red-500"
                  : "bg-zinc-600"
            }`}
          />
          {status}
        </span>
      </div>
    </motion.div>
  );
}
