"use client";

type AnalyticsPayload = {
  event: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export function trackEvent(payload: AnalyticsPayload) {
  const body = JSON.stringify({
    ...payload,
    ts: new Date().toISOString(),
  });

  navigator.sendBeacon("/api/analytics", body);
}
