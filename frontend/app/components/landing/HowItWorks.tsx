"use client";

import Link from "next/link";
import { Fragment, useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Connect your services",
    description:
      "Paste your GitHub PAT, Vercel token, or Supabase Management API key. Encrypted at rest, remove it any time.",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/8 border-blue-500/15",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Set your thresholds",
    description:
      "Choose when to get notified. Default is 80%, but you can lower it for an earlier heads-up on anything critical.",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/8 border-violet-500/15",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Get alerted before limits hit",
    description:
      "Alerts fire via email, Slack, or Discord the moment usage crosses your threshold. Not after something breaks.",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/8 border-emerald-500/15",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="how-it-works"
      className="py-24 bg-[#0a0a0a] border-t border-white/4"
      ref={ref}
    >
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
            Up and running in 2 minutes
          </h2>
          <p className="text-zinc-500 text-base">
            Three steps. No dashboards to babysit.
          </p>
        </motion.div>

        {/* Flow */}
        <div className="grid md:grid-cols-[1fr_32px_1fr_32px_1fr] items-stretch gap-y-4 md:gap-y-0">
          {steps.map((s, i) => (
            <Fragment key={s.step}>
              <motion.div
                className="bg-[#111] border border-white/6 rounded-2xl p-6 flex flex-col gap-4"
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 + i * 0.12 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${s.iconBg} ${s.iconColor}`}
                  >
                    {s.icon}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-700">{s.step}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-2 leading-snug">{s.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{s.description}</p>
                </div>
              </motion.div>

              {/* Arrow connector */}
              {i < steps.length - 1 && (
                <motion.div
                  className="hidden md:flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.12 }}
                >
                  <svg className="h-5 w-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              )}
            </Fragment>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors"
          >
            Get started free →
          </Link>
          <p className="mt-3 text-xs text-zinc-600">No credit card required.</p>
        </motion.div>
      </div>
    </section>
  );
}
