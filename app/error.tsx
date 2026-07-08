"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Unhandled app error:", error);
  }, [error]);

  return (
    <section className="container-custom flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-accent-soft text-accent">
        <AlertTriangle size={40} />
      </div>
      <h2 className="mt-6 text-ink">حدث خطأ غير متوقع</h2>
      <p className="mt-3 max-w-md text-muted">يمكنك إعادة المحاولة أو الرجوع للصفحة الرئيسية.</p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={() => reset()} className="btn-primary">
          <RotateCcw size={18} />
          إعادة المحاولة
        </button>
        <Link href="/" className="btn-outline bg-white">
          <Home size={18} />
          الرئيسية
        </Link>
      </div>
    </section>
  );
}
