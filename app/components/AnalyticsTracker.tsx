"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const payload = JSON.stringify({
      event: "page_view",
      pathname,
      ts: new Date().toISOString(),
    });

    navigator.sendBeacon("/api/analytics", payload);
  }, [pathname]);

  return null;
}
