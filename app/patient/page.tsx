"use client";

import { useState } from "react";
import { CalendarClock, Search, Stethoscope, UserRound } from "lucide-react";
import { cancelAppointment, findAppointmentsByPhone, type Appointment } from "@/lib/appointments";
import EmptyState from "@/app/components/ui/EmptyState";
import NotFound from "../not-found";
import { useRouter } from "next/navigation";

export default function PatientPage() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const router = useRouter();

  return (
    <section className="container-custom max-w-3xl py-8 sm:py-12">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <UserRound size={16} />
          بوابة المريض
        </span>
        <h1 className="mt-4 text-ink">مواعيدي</h1>
        <p className="mt-2 text-sm text-muted">ابحث عن مواعيدك الحالية باستخدام رقم الجوال.</p>
      </div>

      <form
        className="card mt-6 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          const normalizedPhone = phone.trim();
          setAppointments(findAppointmentsByPhone(normalizedPhone));
          setSubmitted(true);
        }}
      >
        <label className="block text-sm font-semibold text-ink">
          رقم الجوال
          <div className="relative mt-1.5">
            <Search size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary" />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="05xxxxxxxx"
              dir="ltr"
              className="w-full rounded-xl border border-line bg-white px-3 py-2.5 pr-10 text-right text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </label>
        <button type="submit" className="btn-primary mt-4">
          <Search size={16} />
          بحث عن المواعيد
        </button>
      </form>

      {submitted ? (
        <div className="mt-6">
          {appointments.length === 0 ? (
            <EmptyState
              title="لا توجد مواعيد"
              description="لم نجد مواعيد مرتبطة بهذا الرقم. تأكد من الرقم أو احجز موعدا جديدا."
            />
          ) : (
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
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{item.id}</span>
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                    <CalendarClock size={16} className="text-primary" />
                    {item.doctorName} - {item.day} - {item.slot}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-line px-3 py-1.5 text-xs font-semibold text-primary transition hover:border-primary/60 hover:bg-primary/5"
                      onClick={() => {
                        // Reschedule: open booking with the same clinic pre-selected
                        router.push(`/booking?clinic=${item.clinicId}`);
                      }}
                    >
                      إعادة جدولة
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                      onClick={() => {
                        const ok = window.confirm("هل أنت متأكد من إلغاء الموعد؟");
                        if (!ok) return;
                        cancelAppointment(item.id);
                        setAppointments((prev) => prev.filter((a) => a.id !== item.id));
                      }}
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </section>


    // <>
    
    // {/* <NotFound/> */}
    // </>
  );
}
