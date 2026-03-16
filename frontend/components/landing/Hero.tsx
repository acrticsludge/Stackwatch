"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative bg-[#0a0a0a] pt-28 pb-32 overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #555 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Glow orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/[0.08] rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        className="relative max-w-3xl mx-auto px-6 text-center"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        {/* Eyebrow badge */}
        <motion.div variants={fadeUp} transition={{ duration: 0.5, ease: "easeOut" }}>
          <span className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 border border-white/[0.08] bg-white/[0.03] rounded-full px-3.5 py-1.5 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            GitHub Actions · Vercel · Supabase
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-5xl md:text-[4.5rem] font-bold text-white tracking-tight leading-[1.05] mb-6"
        >
          Know before you hit
          <br />
          <span className="bg-gradient-to-r from-zinc-400 to-zinc-600 bg-clip-text text-transparent">
            your limits.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Stackwatch monitors your dev tool usage and alerts you before
          something breaks — no more surprise failures at 2am.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <Button
            asChild
            size="lg"
            className="px-8 text-sm font-medium h-11 bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30 hover:-translate-y-px"
          >
            <a href="/signup">Start monitoring free</a>
          </Button>
          <a
            href="#how-it-works"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5 group"
          >
            See how it works
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-10 text-xs text-zinc-700"
        >
          Free forever · No credit card · 2-minute setup
        </motion.p>
      </motion.div>
    </section>
  );
}
