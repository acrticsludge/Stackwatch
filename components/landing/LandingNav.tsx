import { Button } from "@/components/ui/button";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white">
              <path
                d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 3.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="font-bold text-slate-900">Stackwatch</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
            How it works
          </a>
          <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="/login" className="text-sm text-slate-600 hover:text-slate-900 font-medium">
            Log in
          </a>
          <Button asChild size="sm">
            <a href="/signup">Get started free</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
