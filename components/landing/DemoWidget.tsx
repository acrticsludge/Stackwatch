"use client";

import { useState } from "react";
import { getProgressColorClass, getStatusColorClass } from "@/lib/utils";

interface DemoMetric {
  service: string;
  label: string;
  metric: string;
  current: number;
  limit: number;
  unit: string;
}

const SCENARIOS: DemoMetric[][] = [
  [
    { service: "GitHub Actions", label: "personal", metric: "Actions Minutes", current: 1560, limit: 2000, unit: "min" },
    { service: "Vercel", label: "my-app", metric: "Bandwidth", current: 45, limit: 100, unit: "GB" },
    { service: "Supabase", label: "prod", metric: "DB Size", current: 450, limit: 500, unit: "MB" },
  ],
  [
    { service: "GitHub Actions", label: "personal", metric: "Actions Minutes", current: 400, limit: 2000, unit: "min" },
    { service: "Vercel", label: "my-app", metric: "Bandwidth", current: 78, limit: 100, unit: "GB" },
    { service: "Supabase", label: "prod", metric: "DB Size", current: 210, limit: 500, unit: "MB" },
  ],
  [
    { service: "GitHub Actions", label: "personal", metric: "Actions Minutes", current: 1950, limit: 2000, unit: "min" },
    { service: "Vercel", label: "my-app", metric: "Bandwidth", current: 92, limit: 100, unit: "GB" },
    { service: "Supabase", label: "prod", metric: "DB Size", current: 120, limit: 500, unit: "MB" },
  ],
];

const SERVICE_COLORS: Record<string, string> = {
  "GitHub Actions": "bg-slate-900",
  Vercel: "bg-black",
  Supabase: "bg-emerald-600",
};

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "GitHub Actions": (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-white">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  Vercel: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-white">
      <path d="M24 22.525H0l12-21.05 12 21.05z" />
    </svg>
  ),
  Supabase: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-white">
      <path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C.01 13.21-.876 14.11 0 14.11h11.16l.085 8.54c.015.986 1.26 1.41 1.875.637l9.26-11.652c.755-1.162-.13-2.75-1.04-2.75H12.027l-.128-7.849z" />
    </svg>
  ),
};

export function DemoWidget() {
  const [scenario, setScenario] = useState(0);

  const metrics = SCENARIOS[scenario];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-w-3xl mx-auto">
      {/* Mock browser chrome */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-400 max-w-xs mx-auto text-center">
          stackwatch.app/dashboard
        </div>
      </div>

      {/* Dashboard content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Usage Dashboard</h3>
            <p className="text-xs text-slate-400 mt-0.5">Last synced 2 minutes ago</p>
          </div>
          <div className="flex gap-2">
            {SCENARIOS.map((_, i) => (
              <button
                key={i}
                onClick={() => setScenario(i)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  i === scenario
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {["Normal", "Warning", "Critical"][i]}
              </button>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {metrics.map((m) => {
            const pct = Math.round((m.current / m.limit) * 100);
            return (
              <div
                key={m.service}
                className="border border-slate-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`h-7 w-7 rounded-lg ${SERVICE_COLORS[m.service]} flex items-center justify-center flex-shrink-0`}
                  >
                    {SERVICE_ICONS[m.service]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-900 truncate">
                      {m.service}
                    </p>
                    <p className="text-xs text-slate-400">{m.label}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-2">{m.metric}</p>
                {/* Progress bar */}
                <div className="h-1.5 w-full rounded-full bg-slate-100 mb-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColorClass(pct)}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {m.current.toLocaleString()} / {m.limit.toLocaleString()} {m.unit}
                  </span>
                  <span
                    className={`text-xs font-semibold ${getStatusColorClass(pct)}`}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">
          This is demo data. <a href="/signup" className="text-blue-600 hover:underline">Sign up free</a> to connect your real services.
        </p>
      </div>
    </div>
  );
}
