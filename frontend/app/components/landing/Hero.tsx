"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

// ─── Icons ────────────────────────────────────────────────────────────────────
const GH = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-zinc-200">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);
const VC = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-zinc-200">
    <path d="M24 22.525H0l12-21.05 12 21.05z" />
  </svg>
);
const SB = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-emerald-400">
    <path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C.01 13.21-.876 14.11 0 14.11h11.16l.085 8.54c.015.986 1.26 1.41 1.875.637l9.26-11.652c.755-1.162-.13-2.75-1.04-2.75H12.027l-.128-7.849z" />
  </svg>
);

// ─── Frame constants ───────────────────────────────────────────────────────────
const FRAME_W = 560;
const CHROME_H = 40;
const CONTENT_H = 422;
const FRAME_H = CHROME_H + CONTENT_H;
const SCALE = 0.75; // displayed: 420 × 347px

const SLIDE_URLS = ["/dashboard", "/integrations", "/settings"];

// ─── Slide 1: Dashboard ────────────────────────────────────────────────────────
interface DashMetric {
  name: string;
  current: number;
  limit: number;
  unit: string;
  pct: number;
}

function DashCard({
  icon,
  service,
  label,
  metrics,
}: {
  icon: React.ReactNode;
  service: string;
  label: string;
  metrics: DashMetric[];
}) {
  const worstPct = Math.max(...metrics.map((m) => m.pct));
  const badgeClass =
    worstPct >= 80
      ? "text-red-400 bg-red-500/10 border-red-500/20"
      : worstPct >= 60
        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
        : "text-green-400 bg-green-500/10 border-green-500/20";
  const barColor = (p: number) =>
    p >= 80 ? "bg-red-500" : p >= 60 ? "bg-amber-500" : "bg-blue-500";

  return (
    <div className="bg-[#111] border border-white/6 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/6 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-100 leading-tight">{service}</p>
            <p className="text-[10px] text-zinc-600">{label}</p>
          </div>
        </div>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badgeClass}`}>
          {worstPct}%
        </span>
      </div>
      <div className="space-y-2">
        {metrics.map((m) => (
          <div key={m.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-zinc-600 truncate">{m.name}</span>
              <span className="text-[10px] text-zinc-500 ml-1 shrink-0">{m.pct}%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-white/6 overflow-hidden">
              <div
                className={`h-full rounded-full ${barColor(m.pct)}`}
                style={{ width: `${Math.min(m.pct, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="pt-2 border-t border-white/4 flex items-center justify-between">
        <span className="text-[10px] text-zinc-700">Synced 2m ago</span>
        <span className="flex items-center gap-1 text-[10px] text-green-500">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          connected
        </span>
      </div>
    </div>
  );
}

function Slide1Dashboard() {
  return (
    <div className="px-7 py-5 overflow-hidden" style={{ height: CONTENT_H }}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-0.5">3 services connected</p>
        </div>
        <div className="h-8 px-3 rounded-lg bg-white/5 border border-white/6 flex items-center gap-2 shrink-0">
          <svg className="h-3.5 w-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-xs text-zinc-500">Refresh</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {[
          { label: "Healthy", val: 1, color: "text-green-400" },
          { label: "Warning", val: 1, color: "text-amber-400" },
          { label: "Critical", val: 1, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#111] border border-white/6 rounded-xl px-3 py-3">
            <p className="text-[11px] text-zinc-600 mb-1.5 font-medium">{s.label}</p>
            <p className={`text-2xl font-semibold tabular-nums leading-none ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-widest shrink-0">Usage</p>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <DashCard
          icon={GH}
          service="GitHub Actions"
          label="personal"
          metrics={[{ name: "Actions Minutes", current: 1880, limit: 2000, unit: "min", pct: 94 }]}
        />
        <DashCard
          icon={VC}
          service="Vercel"
          label="my-team"
          metrics={[
            { name: "Bandwidth", current: 72, limit: 100, unit: "GB", pct: 72 },
            { name: "Build Mins", current: 280, limit: 6000, unit: "min", pct: 5 },
          ]}
        />
        <DashCard
          icon={SB}
          service="Supabase"
          label="prod-db"
          metrics={[
            { name: "DB Size", current: 48, limit: 500, unit: "MB", pct: 10 },
            { name: "Storage", current: 120, limit: 1000, unit: "MB", pct: 12 },
          ]}
        />
      </div>
    </div>
  );
}

// ─── Slide 2: Integrations ─────────────────────────────────────────────────────
function Slide2Integrations() {
  const items = [
    { icon: GH, service: "GitHub Actions", label: "personal", synced: "2m ago" },
    { icon: VC, service: "Vercel", label: "my-team", synced: "2m ago" },
    { icon: SB, service: "Supabase", label: "prod-db", synced: "5m ago" },
  ];

  return (
    <div className="px-7 py-5 overflow-hidden" style={{ height: CONTENT_H }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Integrations</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Connected services</p>
        </div>
        <button className="h-8 px-3.5 rounded-lg bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 shrink-0">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add service
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="bg-[#111] border border-white/6 rounded-xl p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/6 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-medium text-zinc-100">{item.service}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-400 bg-green-500/10 border border-green-500/20 rounded px-1.5 py-px">
                  <span className="h-1 w-1 rounded-full bg-green-500" />
                  connected
                </span>
              </div>
              <p className="text-xs text-zinc-600">{item.label} · synced {item.synced}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="h-7 w-7 rounded-md bg-white/4 border border-white/6 flex items-center justify-center text-zinc-600">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button className="h-7 w-7 rounded-md bg-white/4 border border-white/6 flex items-center justify-center text-zinc-600">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-zinc-700 text-center">Free tier · 1 of 1 allowed per service</p>
    </div>
  );
}

// ─── Slide 3: Settings / Alerts ────────────────────────────────────────────────
function Slide3Settings() {
  const thresholds = [
    { service: "GitHub Actions", metric: "Actions Minutes", current: 94 },
    { service: "Vercel", metric: "Bandwidth", current: 72 },
    { service: "Supabase", metric: "DB Size", current: 10 },
  ];

  const channels: { label: string; desc: string; enabled: boolean; d: string }[] = [
    {
      label: "Email",
      desc: "me@example.com",
      enabled: true,
      d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    {
      label: "Slack",
      desc: "Webhook configured",
      enabled: true,
      d: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14",
    },
    {
      label: "Discord",
      desc: "Not configured",
      enabled: false,
      d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    },
    {
      label: "Browser Push",
      desc: "Not configured",
      enabled: false,
      d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    },
  ];

  return (
    <div className="px-7 py-4 overflow-hidden" style={{ height: CONTENT_H }}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/4 border border-white/6 rounded-lg p-1 mb-4 w-fit">
        {["Account", "Alerts", "Billing"].map((tab, i) => (
          <button
            key={tab}
            className={`px-3 py-1.5 rounded text-xs font-medium ${
              i === 1 ? "bg-white/8 text-white" : "text-zinc-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alert thresholds */}
      <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-widest mb-2.5">
        Alert thresholds
      </p>
      <div className="space-y-2 mb-4">
        {thresholds.map((t) => {
          const barColor =
            t.current >= 80 ? "bg-red-500" : t.current >= 60 ? "bg-amber-500" : "bg-blue-500";
          return (
            <div
              key={t.metric}
              className="bg-[#111] border border-white/6 rounded-xl px-4 py-2.5 flex items-center gap-3"
            >
              <div className="w-28 shrink-0">
                <p className="text-xs font-medium text-zinc-300 leading-tight">{t.metric}</p>
                <p className="text-[10px] text-zinc-600">{t.service}</p>
              </div>
              <div className="flex-1 relative">
                <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${t.current}%` }} />
                </div>
                <div
                  className="absolute top-0 h-1.5 w-px bg-amber-500/70"
                  style={{ left: "80%" }}
                />
              </div>
              <span className="text-xs font-medium text-zinc-400 w-8 text-right shrink-0">80%</span>
            </div>
          );
        })}
      </div>

      {/* Notification channels */}
      <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-widest mb-2.5">
        Notification channels
      </p>
      <div className="space-y-2">
        {channels.map((ch) => (
          <div
            key={ch.label}
            className="bg-[#111] border border-white/6 rounded-xl px-4 py-2.5 flex items-center gap-3"
          >
            <div
              className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 ${
                ch.enabled
                  ? "bg-blue-500/10 border border-blue-500/20"
                  : "bg-white/4 border border-white/6"
              }`}
            >
              <svg
                className={`h-3 w-3 ${ch.enabled ? "text-blue-400" : "text-zinc-600"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={ch.d} />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-300">{ch.label}</p>
              <p className="text-[10px] text-zinc-600 truncate">{ch.desc}</p>
            </div>
            <div
              className={`relative h-5 w-9 rounded-full shrink-0 ${ch.enabled ? "bg-blue-500" : "bg-white/10"}`}
            >
              <div
                className={`absolute top-0.5 h-4 w-4 bg-white rounded-full shadow transition-transform ${
                  ch.enabled ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Browser chrome frame ──────────────────────────────────────────────────────
function ChromeFrame({
  slideIndex,
  children,
}: {
  slideIndex: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-[#0d0d0d] border border-white/8 rounded-2xl overflow-hidden"
      style={{ width: FRAME_W }}
    >
      {/* Chrome bar */}
      <div className="h-10 bg-[#161616] border-b border-white/6 flex items-center px-4 gap-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c940]" />
        </div>
        <div className="flex-1 mx-2">
          <div className="h-6 bg-[#0a0a0a] border border-white/6 rounded-md flex items-center gap-2 px-3">
            <svg
              className="h-3 w-3 text-zinc-700 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-[11px] font-mono text-zinc-600">
              stackwatch.dev{SLIDE_URLS[slideIndex]}
            </span>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="bg-[#0a0a0a] overflow-hidden" style={{ height: CONTENT_H }}>
        {children}
      </div>
    </div>
  );
}

// ─── Carousel ─────────────────────────────────────────────────────────────────
const SLIDES = [<Slide1Dashboard key={0} />, <Slide2Integrations key={1} />, <Slide3Settings key={2} />];

function HeroCarousel() {
  const [slide, setSlide] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) setSlide((s) => (s + 1) % 3);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="select-none"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* Clip box at displayed size */}
      <div
        className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/60"
        style={{ width: FRAME_W * SCALE, height: FRAME_H * SCALE }}
      >
        {/* Full-size frame, scaled down */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: FRAME_W,
            transform: `scale(${SCALE})`,
            transformOrigin: "top left",
          }}
        >
          <ChromeFrame slideIndex={slide}>
            <div style={{ position: "relative", height: CONTENT_H }}>
              {SLIDES.map((s, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: i === slide ? 1 : 0,
                    transition: "opacity 0.5s ease-in-out",
                    pointerEvents: i === slide ? "auto" : "none",
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          </ChromeFrame>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            style={{
              height: 6,
              width: i === slide ? 16 : 6,
              borderRadius: 9999,
              background: i === slide ? "#a1a1aa" : "#3f3f46",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
export function Hero() {
  return (
    <section className="relative bg-[#0a0a0a] pt-20 pb-24 overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 xl:gap-20 items-center">
          {/* ── Left: Copy ── */}
          <div className="max-w-xl">
            <p className="text-[11px] font-mono text-zinc-600 uppercase tracking-[0.18em] mb-8 flex items-center gap-2">
              <span className="h-px w-5 bg-zinc-700 inline-block" />
              Quota guardrail for SaaS teams in production
            </p>

            <h1 className="text-[3.25rem] md:text-[3.75rem] font-bold text-white tracking-tight leading-[1.06] mb-5">
              Stop Finding Out
              <br />
              <span className="text-zinc-500">When Your Users Do.</span>
            </h1>

            <p className="text-base text-zinc-600 mb-2 leading-relaxed">
              Actions quota hit. Builds stopped. Users noticed first.
            </p>
            <p className="text-base text-zinc-400 leading-relaxed mb-10">
              Stackwatch monitors your GitHub, Vercel, Railway and Supabase
              limits — and alerts your team{" "}
              <span className="text-white font-medium">before</span> a limit
              becomes a production incident.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="h-11 px-8 text-sm font-medium bg-white text-zinc-900 hover:bg-zinc-100 rounded-lg shadow-none"
              >
                <Link href="/signup">Start for free</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-11 px-5 text-sm text-zinc-500 hover:text-zinc-200 hover:bg-white/5 rounded-lg"
              >
                <a href="#how-it-works">How it works →</a>
              </Button>
            </div>
          </div>

          {/* ── Right: Product carousel ── */}
          <div className="flex justify-center lg:justify-end">
            <HeroCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}
