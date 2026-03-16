import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="inline-flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 text-white"
              >
                <path
                  d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 3.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">Stackwatch</span>
          </a>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
