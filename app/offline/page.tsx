"use client";

import { OfflineScreen } from "../components/OfflineScreen";

export default function OfflinePage() {
  return (
    <section className="container-custom flex min-h-[70vh] items-center justify-center py-12">
      <div className="card w-full max-w-md p-2">
        <OfflineScreen
          brand="جمعية الخدمة العامة"
          title="لا يوجد اتصال بالإنترنت"
          description="تعذّر الوصول إلى الصفحة لأن الاتصال بالإنترنت غير متاح حالياً."
          hint="بعد عودة الشبكة يمكنك المتابعة من حيث توقفت."
          retryLabel="إعادة المحاولة"
          onRetry={() => {
            if (navigator.onLine) window.location.href = "/";
            else window.location.reload();
          }}
        />
      </div>
    </section>
  );
}
