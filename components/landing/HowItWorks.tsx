const steps = [
  {
    step: "01",
    title: "Connect your services",
    description:
      "Paste your GitHub PAT, Vercel API token, or Supabase Management API key. We encrypt and store it securely — you can remove it at any time.",
  },
  {
    step: "02",
    title: "Set your thresholds",
    description:
      "Choose when you want to be notified. Default is 80% — but you can set it to 60% for an earlier heads-up on critical services.",
  },
  {
    step: "03",
    title: "Get alerted before it's too late",
    description:
      "Receive alerts via email, Slack, or Discord the moment your usage crosses a threshold. No more surprises.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Up and running in 2 minutes
          </h2>
          <p className="text-slate-500 text-lg">
            No complex setup. No agents to install.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.step} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-full w-full h-px bg-slate-200 -translate-x-4 z-0" />
              )}
              <div className="relative z-10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                  {s.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
