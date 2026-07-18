"use client";

import { useEffect } from "react";
import { useLoadingOverlay } from "./LoadingOverlayManager";

const MIN_DISPLAY_MS = 900;

export default function InitialSplash() {
  const { registerLoading, unregisterLoading } = useLoadingOverlay();

  useEffect(() => {
    registerLoading("splash");
    const started = Date.now();
    let timeoutId: number | undefined;

    const finish = () => {
      const elapsed = Date.now() - started;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      timeoutId = window.setTimeout(() => unregisterLoading("splash"), remaining);
    };

    if (document.readyState === "complete") {
      requestAnimationFrame(finish);
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      window.removeEventListener("load", finish);
      unregisterLoading("splash");
    };
  }, [registerLoading, unregisterLoading]);

  return null;
}
