"use client";

import { useEffect } from "react";

let loadingCount = 0;

function syncLoadingClass() {
  if (typeof document === "undefined") return;

  if (loadingCount > 0) {
    document.documentElement.classList.add("is-loading");
  } else {
    document.documentElement.classList.remove("is-loading");
  }
}

export function useLoadingChrome(active = true) {
  useEffect(() => {
    if (!active) return;

    loadingCount += 1;
    syncLoadingClass();

    return () => {
      loadingCount = Math.max(0, loadingCount - 1);
      syncLoadingClass();
    };
  }, [active]);
}
