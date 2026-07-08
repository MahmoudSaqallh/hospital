import Link from "next/link";
import { Home, Stethoscope } from "lucide-react";

export default function NotFound() {
  return (
    <section className="container-custom flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="text-8xl font-black leading-none text-transparent" style={{ backgroundImage: "var(--gradient-primary)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>
        404
      </div>
      <h1 className="mt-4 text-ink">الصفحة الحالية قيد التتطوير</h1>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          <Home size={18} />
          الرجوع للرئيسية
        </Link>
        <Link href="/clinics" className="btn-outline bg-white">
          <Stethoscope size={18} />
          دليل العيادات
        </Link>
      </div>
    </section>
  );
}
