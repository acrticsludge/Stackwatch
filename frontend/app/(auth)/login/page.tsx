import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <>
      <h1 className="text-xl font-bold text-white mb-1 tracking-tight">Welcome back</h1>
      <p className="text-zinc-500 text-sm mb-6">
        Sign in to your Stackwatch account.{" "}
        <a href="/signup" className="text-zinc-400 hover:text-white transition-colors">
          No account? Sign up free →
        </a>
      </p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
}
