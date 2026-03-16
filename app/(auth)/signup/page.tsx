import type { Metadata } from "next";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Create an account</h1>
      <p className="text-slate-500 text-sm mb-6">
        Start monitoring your dev stack for free
      </p>
      <SignupForm />
    </>
  );
}
