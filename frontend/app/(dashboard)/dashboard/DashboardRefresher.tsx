"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export function DashboardRefresher() {
  const router = useRouter();
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const refreshTimer = setInterval(() => {
      router.refresh();
      setSecondsAgo(0);
    }, REFRESH_INTERVAL_MS);

    const counterTimer = setInterval(() => {
      setSecondsAgo((s) => s + 1);
    }, 1000);

    return () => {
      clearInterval(refreshTimer);
      clearInterval(counterTimer);
    };
  }, [router]);

  function handleManualRefresh() {
    setIsSpinning(true);
    router.refresh();
    setSecondsAgo(0);
    setTimeout(() => setIsSpinning(false), 600);
  }

  const label =
    secondsAgo < 5
      ? "just now"
      : secondsAgo < 60
        ? `${secondsAgo}s ago`
        : `${Math.floor(secondsAgo / 60)}m ago`;

  return (
    <button
      onClick={handleManualRefresh}
      className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 bg-white/4 hover:bg-white/6 border border-white/6 hover:border-white/10 px-3 py-1.5 rounded-lg transition-all duration-150 shrink-0"
    >
      <RefreshCw className={`h-3 w-3 transition-transform ${isSpinning ? "animate-spin" : ""}`} />
      <span>Updated {label}</span>
    </button>
  );
}
