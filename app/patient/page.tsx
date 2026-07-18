"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CalendarClock, LogIn, Stethoscope, UserRound } from "lucide-react";
import { fetchMyBookings, type Appointment } from "@/lib/appointments";
import EmptyState from "@/app/components/ui/EmptyState";

export default function PatientPage() {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;
    setLoading(true);
    setError("");
    fetchMyBookings(session.accessToken)
      .then(setAppointments)
      .catch(() => setError("تعذر جلب المواعيد من الخادم."))
      .finally(() => setLoading(false));
  }, [session, status]);

  return (
    <section className="container-custom max-w-3xl py-8 sm:py-12">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <UserRound size={16} />
          بوابة المريض
        </span>
        <h1 className="mt-4 text-ink">مواعيدي</h1>
        <p className="mt-2 text-sm text-muted">
          {status === "authenticated"
            ? "مواعيدك المحفوظة على النظام."
            : "سجّل دخولك لعرض مواعيدك ومتابعة حالة الدفع."}
        </p>
      </div>

      {status !== "authenticated" ? (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm">
          <p className="text-muted">هل لديك حساب؟</p>
          <Link
            href="/login?callbackUrl=/patient"
            className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
          >
            <LogIn size={16} />
            تسجيل الدخول
          </Link>
          <Link href="/register" className="font-semibold text-ink hover:underline">
            إنشاء حساب
          </Link>
        </div>
      ) : null}

      {status === "authenticated" ? (
        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-muted">جاري التحميل...</p>
          ) : null}
          {error ? (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}
          {!loading && !error && appointments.length === 0 ? (
            <EmptyState
              title="لا توجد مواعيد"
              description="لم تحجز أي موعد بعد. ابدأ حجزاً جديداً الآن."
            />
          ) : null}
          <div className="space-y-3">
            {appointments.map((item) => (
              <div key={item.id} className="card card-hover p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="flex items-center gap-2 font-bold text-ink">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Stethoscope size={18} />
                    </span>
                    {item.clinicTitle}
                  </h2>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    #{item.id}
                  </span>
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                  <CalendarClock size={16} className="text-primary" />
                  {item.doctorName} — {item.day} — {item.slot}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-ink">
                    {item.status}
                  </span>
                  {item.paymentStatus ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                      دفع: {item.paymentStatus}
                    </span>
                  ) : null}
                </div>
                {item.status === "cancelled" && item.notes ? (
                  <p className="mt-3 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                    {item.notes}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
          <Link href="/booking" className="btn-primary mt-6 inline-flex">
            حجز موعد جديد
          </Link>
        </div>
      ) : null}
    </section>
  );
}
