export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-blue-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-white">
              <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 3.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" fill="currentColor" />
            </svg>
          </div>
          <span className="font-semibold text-slate-900 text-sm">Stackwatch</span>
          <span className="text-slate-300 text-sm ml-2">
            © {new Date().getFullYear()}
          </span>
        </div>
        <nav className="flex flex-wrap items-center gap-6">
          <a href="/login" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Log in</a>
          <a href="/signup" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Sign up</a>
          <a href="#pricing" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
          <a href="/privacy" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Privacy</a>
          <a href="/terms" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Terms</a>
        </nav>
      </div>
    </footer>
  );
}
