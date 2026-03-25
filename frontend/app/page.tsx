import type { Metadata } from "next";
import { Suspense } from "react";
import { LandingNav } from "@/app/components/landing/LandingNav";
import { Hero } from "@/app/components/landing/Hero";
import { ProblemSection } from "@/app/components/landing/ProblemSection";
import { HowItWorks } from "@/app/components/landing/HowItWorks";
import { ServicesSection } from "@/app/components/landing/ServicesSection";
import { DemoWidget } from "@/app/components/landing/DemoWidget";
import { AlertChannelsSection } from "@/app/components/landing/AlertChannelsSection";
import { PricingSection, type PlanState } from "@/app/components/landing/PricingSection";
import { CTASection } from "@/app/components/landing/CTASection";
import { TestimonialsSection } from "@/app/components/landing/TestimonialsSection";
import { FAQSection } from "@/app/components/landing/FAQSection";
import { LandingFooter } from "@/app/components/landing/LandingFooter";
import { ServicesStrip } from "@/app/components/landing/ServicesStrip";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/queries/user";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://stackwatch.pulsemonitor.dev";

export const metadata: Metadata = {
  title: "Stackwatch — Know before your users do",
  description:
    "Stackwatch is the quota guardrail for early-stage SaaS teams in production. Get alerted before GitHub Actions, Vercel, or Supabase limits become a production incident.",
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    url: APP_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Stackwatch",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: APP_URL,
  description:
    "Monitoring platform for developer tool usage limits. Get alerted before you hit limits on GitHub Actions, Vercel, and Supabase.",
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
    { "@type": "Offer", price: "10", priceCurrency: "USD", name: "Pro" },
    { "@type": "Offer", price: "30", priceCurrency: "USD", name: "Team" },
  ],
};

// ─── Dynamic async sub-components ────────────────────────────────────────────

async function DynamicNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <LandingNav isLoggedIn={!!user} />;
}

async function DynamicPricingSection() {
  const session = await getSession();
  let planState: PlanState = "none";

  if (session) {
    const supabase = await createClient();
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("tier, status, cancel_at_period_end")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (sub) {
      if (sub.status === "trialing") {
        planState = "trialing";
      } else if (sub.status === "active" && (sub.tier === "pro" || sub.tier === "team")) {
        planState = sub.cancel_at_period_end ? "active_cancelling" : "active";
      } else if (sub.status === "past_due") {
        planState = "past_due";
      } else {
        planState = "used_trial";
      }
    }
  }

  return <PricingSection userEmail={session?.user?.email} planState={planState} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav: streams in with auth state; static fallback shows immediately */}
      <Suspense fallback={<LandingNav isLoggedIn={false} />}>
        <DynamicNav />
      </Suspense>

      <main>
        {/* All sections below are fully static — rendered at build time */}
        <Hero />
        <ServicesStrip />
        <ProblemSection />
        <HowItWorks />
        <ServicesSection />

        {/* Demo section */}
        <section className="py-24 bg-[#0a0a0a] border-t border-white/4">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-3">
                Live preview
              </p>
              <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
                See it in action
              </h2>
              <p className="text-zinc-500 text-base max-w-xl mx-auto">
                This is what your dashboard looks like. Explore freely — no
                strings attached.
              </p>
            </div>
            <DemoWidget />
          </div>
        </section>

        <AlertChannelsSection />

        <CTASection />

        {/* Pricing: streams in with isPro/userEmail; static fallback shows immediately */}
        <Suspense fallback={<PricingSection />}>
          <DynamicPricingSection />
        </Suspense>

        <FAQSection />
      </main>

      <LandingFooter />
    </div>
  );
}
