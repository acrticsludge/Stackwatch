import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For solo devs getting started",
    features: [
      "1 account per service",
      "3 services (GitHub, Vercel, Supabase)",
      "Email alerts",
      "15-minute polling",
      "7-day alert history",
    ],
    cta: "Get started free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$10",
    period: "/month",
    description: "For individuals with multiple projects",
    features: [
      "5 accounts per service",
      "All services",
      "Email + Slack + Discord alerts",
      "5-minute polling",
      "30-day alert history",
      "Usage history charts",
    ],
    cta: "Start Pro",
    href: "/signup?plan=pro",
    highlight: true,
  },
  {
    name: "Team",
    price: "$30",
    period: "/month",
    description: "For teams sharing infrastructure",
    features: [
      "Unlimited accounts",
      "All services",
      "All alert channels + Browser push",
      "1-minute polling",
      "90-day alert history",
      "Team dashboard",
      "Shared alert configs",
    ],
    cta: "Start Team",
    href: "/signup?plan=team",
    highlight: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-500 text-lg">
            Start free. Upgrade when you need more.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl p-7 ${
                p.highlight
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-200 ring-2 ring-blue-600"
                  : "bg-white border border-slate-200 shadow-sm"
              }`}
            >
              <div className="mb-5">
                <p
                  className={`text-sm font-medium mb-1 ${p.highlight ? "text-blue-200" : "text-slate-500"}`}
                >
                  {p.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-bold ${p.highlight ? "text-white" : "text-slate-900"}`}
                  >
                    {p.price}
                  </span>
                  {p.period && (
                    <span
                      className={`text-sm ${p.highlight ? "text-blue-200" : "text-slate-400"}`}
                    >
                      {p.period}
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm mt-1 ${p.highlight ? "text-blue-100" : "text-slate-500"}`}
                >
                  {p.description}
                </p>
              </div>
              <ul className="space-y-2.5 mb-7">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <svg
                      className={`h-4 w-4 mt-0.5 flex-shrink-0 ${p.highlight ? "text-blue-200" : "text-green-500"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span
                      className={`text-sm ${p.highlight ? "text-blue-50" : "text-slate-600"}`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`w-full ${
                  p.highlight
                    ? "bg-white text-blue-700 hover:bg-blue-50"
                    : ""
                }`}
                variant={p.highlight ? "secondary" : "default"}
              >
                <a href={p.href}>{p.cta}</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
