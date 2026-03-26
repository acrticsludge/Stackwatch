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
    title: "Stackwatch — Know before your users do",
  },
  twitter: {
    title: "Stackwatch — Know before your users do",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Stackwatch",
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "DevOps Monitoring",
  operatingSystem: "Web",
  url: APP_URL,
  description:
    "Stackwatch is a usage monitoring platform for developer teams. Connect GitHub Actions, Vercel, Supabase, and Railway to a single dashboard. Get alerted before you hit quota limits.",
  featureList: [
    "GitHub Actions minutes monitoring",
    "Vercel bandwidth and build minutes tracking",
    "Supabase database size and MAU monitoring",
    "Railway usage monitoring",
    "Email, Slack, Discord, and Browser Push alerts",
    "Configurable threshold alerts",
    "Usage history charts",
    "Team dashboard with shared pooled usage",
  ],
  screenshot: `${APP_URL}/og`,
  author: {
    "@type": "Organization",
    "@id": `${APP_URL}/#organization`,
    name: "Stackwatch",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      description: "1 account per service, email alerts, 15-minute polling, 7-day history.",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/OnlineOnly",
      url: `${APP_URL}/signup`,
    },
    {
      "@type": "Offer",
      name: "Pro",
      description: "5 accounts per service, all alert channels, 5-minute polling, 30-day history, usage charts.",
      price: "10",
      priceCurrency: "USD",
      availability: "https://schema.org/OnlineOnly",
      url: `${APP_URL}/pricing`,
    },
    {
      "@type": "Offer",
      name: "Team",
      description: "Unlimited accounts, all services, 1-minute polling, 90-day history, shared team dashboard.",
      price: "30",
      priceCurrency: "USD",
      availability: "https://schema.org/OnlineOnly",
      url: `${APP_URL}/pricing`,
    },
  ],
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${APP_URL}/#organization`,
  name: "Stackwatch",
  url: APP_URL,
  logo: {
    "@type": "ImageObject",
    url: `${APP_URL}/og`,
    width: 1200,
    height: 630,
  },
  description:
    "Stackwatch is a usage monitoring SaaS for developer teams. It watches GitHub Actions, Vercel, Supabase, and Railway quotas and sends alerts before limits cause production incidents.",
  sameAs: ["https://github.com/acrticsludge/Stackwatch"],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is there a free plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The Free plan is $0 forever — no credit card required. You get one account per service (GitHub, Vercel, Supabase, Railway), email alerts, and 15-minute polling. Upgrade to Pro when you need more.",
      },
    },
    {
      "@type": "Question",
      name: "How does Stackwatch connect to my services?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You paste in an API key or personal access token for each service. Stackwatch never asks for your password. Tokens are encrypted before storage and are only used to read usage data — never to write or modify anything.",
      },
    },
    {
      "@type": "Question",
      name: "Are my API keys stored securely?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All API keys are AES-256 encrypted before they are written to the database. The encryption key is never stored alongside the data. Row-level security on the database ensures you can only ever access your own keys.",
      },
    },
    {
      "@type": "Question",
      name: "How often does it check my usage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free accounts are polled every 15 minutes. Pro and Team accounts are polled every 5 minutes. All polling runs on a dedicated Railway worker — your dashboard does not need to be open.",
      },
    },
    {
      "@type": "Question",
      name: "Can I get alerted on Slack or Discord?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — on the Pro and Team plans. Add an incoming webhook URL in Settings and Stackwatch will post a structured alert message whenever a metric crosses your threshold. Free accounts receive email alerts only.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if the same metric stays over the threshold?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Stackwatch won't spam you. An alert fires once when the metric crosses your threshold. It won't fire again for that metric until usage drops below the threshold and crosses it again.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work with GitHub organisations, not just personal accounts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. When you add a GitHub integration you can connect either a personal account or an organisation. Stackwatch will fetch Actions minutes for all repos under that account.",
      },
    },
    {
      "@type": "Question",
      name: "Can I cancel at any time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. There's no lock-in. Cancel from the Billing tab in Settings and you won't be charged again. You'll keep Pro features until the end of your current billing period.",
      },
    },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

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
