import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-28">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Gradient blob */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-100 opacity-60 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-100 opacity-50 blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 font-medium mb-8">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Free to start — no credit card required
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
          Stop finding out about
          <br />
          <span className="text-blue-600">limits when it&apos;s too late</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stackwatch monitors your GitHub Actions, Vercel, and Supabase usage
          and alerts you before you hit your limits — so you never get
          blindsided by a broken deploy or a locked database.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="text-base px-8">
            <a href="/signup">Start monitoring free</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-base px-8">
            <a href="#how-it-works">See how it works</a>
          </Button>
        </div>
        <p className="mt-6 text-sm text-slate-400">
          Connect in 2 minutes · GitHub Actions, Vercel, Supabase
        </p>
      </div>
    </section>
  );
}
