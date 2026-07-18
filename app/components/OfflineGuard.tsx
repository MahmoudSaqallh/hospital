"use client";

import { useCallback, useEffect, useState } from "react";
import { OfflineScreen } from "./OfflineScreen";

export default function OfflineGuard() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    function sync() {
      setOffline(!navigator.onLine);
    }
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const retry = useCallback(() => {
    if (navigator.onLine) {
      window.location.reload();
      return;
    }
    setOffline(true);
  }, []);

  if (!offline) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-canvas/95 backdrop-blur-sm"
      role="alert"
      aria-live="assertive"
    >
      <div className="card mx-4 w-full max-w-md p-2 shadow-lg">
        <OfflineScreen
          brand="جمعية الخدمة العامة"
          title="لا يوجد اتصال بالإنترنت"
          description="انقطع الاتصال بالشبكة. تحقق من الواي فاي أو بيانات الجوال ثم أعد المحاولة."
          hint="ستختفي هذه الصفحة تلقائياً عند عودة الاتصال."
          retryLabel="إعادة المحاولة"
          onRetry={retry}
        />
      </div>
    </div>
  );
}
