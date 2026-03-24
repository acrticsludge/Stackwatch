const testimonials = [
  {
    quote:
      "We hit our Supabase row limit on a Friday evening. No warning, writes just started silently failing. Lost two hours debugging before we figured it out. Stackwatch would have caught that days earlier.",
    name: "Marcus T.",
    role: "Solo founder, B2B SaaS",
    initials: "MT",
    color: "bg-blue-500/15 text-blue-300",
  },
  {
    quote:
      "I was manually checking GitHub billing, Vercel usage, and Supabase storage every few days just to feel safe. It was eating 20–30 minutes a week for no reason. Now I just get a Slack ping if anything gets close.",
    name: "Priya S.",
    role: "CTO, 4-person startup",
    initials: "PS",
    color: "bg-violet-500/15 text-violet-300",
  },
  {
    quote:
      "Our Actions quota ran out during a live demo. Builds stopped mid-pipeline. The prospect noticed before we did. That was the moment I stopped trusting manual checks and started looking for something like this.",
    name: "Jordan L.",
    role: "Indie hacker, 3 products",
    initials: "JL",
    color: "bg-emerald-500/15 text-emerald-300",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#0a0a0a] border-t border-white/4">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-3">
            Why people use it
          </p>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            The moment that made them switch
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-[#111] border border-white/6 rounded-2xl p-6 flex flex-col gap-5"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-zinc-400 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>

              <div className="flex items-center gap-3 pt-2 border-t border-white/4">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-300">{t.name}</p>
                  <p className="text-[11px] text-zinc-600">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
