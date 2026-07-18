"use client";

import { WifiOff, RefreshCw } from "lucide-react";

type OfflineScreenProps = {
  title: string;
  description: string;
  hint?: string;
  retryLabel: string;
  onRetry?: () => void;
  brand?: string;
};

export function OfflineScreen({
  title,
  description,
  hint,
  retryLabel,
  onRetry,
  brand,
}: OfflineScreenProps) {
  function handleRetry() {
    if (onRetry) {
      onRetry();
      return;
    }
    if (typeof window !== "undefined" && navigator.onLine) {
      window.location.reload();
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-6 py-10 text-center">
      {brand ? (
        <p className="mb-6 text-sm font-semibold tracking-wide text-primary">{brand}</p>
      ) : null}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <WifiOff size={36} strokeWidth={1.75} aria-hidden />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{description}</p>
      {hint ? <p className="mt-2 text-xs text-muted">{hint}</p> : null}
      <button type="button" onClick={handleRetry} className="btn-primary mt-8 gap-2">
        <RefreshCw size={18} aria-hidden />
        {retryLabel}
      </button>
    </div>
  );
}
