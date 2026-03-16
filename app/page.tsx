import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { DemoWidget } from "@/components/landing/DemoWidget";
import { AlertChannelsSection } from "@/components/landing/AlertChannelsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "Stackwatch — Monitor your dev stack limits",
  description:
    "Get alerted before you hit limits on GitHub Actions, Vercel, and Supabase. One dashboard, real-time alerts.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <ServicesSection />
        <section className="py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                See it in action
              </h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">
                This is what your dashboard looks like. No signup needed to
                explore.
              </p>
            </div>
            <DemoWidget />
          </div>
        </section>
        <AlertChannelsSection />
        <PricingSection />
      </main>
      <LandingFooter />
    </div>
  );
}
