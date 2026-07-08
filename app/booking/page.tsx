"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, CalendarCheck, CheckCircle2, MessageCircle, UserRound } from "lucide-react";
import { clinics } from "@/lib/data";
import {
  createAppointmentId,
  getAvailableSlots,
  saveAppointment,
} from "@/lib/appointments";
import { trackEvent } from "@/lib/analytics";
import NotFound from "../not-found";

type BookingStep = 1 | 2 | 3;

const steps = [
  { id: 1, label: "العيادة والموعد" },
  { id: 2, label: "بيانات المريض" },
  { id: 3, label: "التأكيد" },
];

const panelMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

export default function BookingPage() {
  const params = useSearchParams();
  const initialClinicId = Number(params.get("clinic"));
  const [step, setStep] = useState<BookingStep>(1);
  const [clinicId, setClinicId] = useState<number>(
    Number.isFinite(initialClinicId) ? initialClinicId : clinics[0]?.id ?? 1,
  );
  const [slotKey, setSlotKey] = useState<string>("");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmationId, setConfirmationId] = useState<string | null>(null);

  const clinic = useMemo(
    () => clinics.find((item) => item.id === clinicId) ?? clinics[0],
    [clinicId],
  );
  const slots = clinic ? getAvailableSlots(clinic) : [];
  const selectedSlot = slots.find(
    (item) => `${item.doctorName}|${item.day}|${item.slot}` === slotKey,
  );

  function goNextFromStepOne() {
    if (!slotKey) return;
    setStep(2);
  }

  function confirmAppointment() {
    if (!clinic || !selectedSlot || patientName.trim().length < 3 || phone.trim().length < 8) return;

    const appointmentId = createAppointmentId();
    saveAppointment({
      id: appointmentId,
      clinicId: clinic.id,
      clinicTitle: clinic.title,
      doctorName: selectedSlot.doctorName,
      day: selectedSlot.day,
      slot: selectedSlot.slot,
      patientName: patientName.trim(),
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
    });
    trackEvent({
      event: "booking_confirmed",
      metadata: { clinicId: clinic.id, clinicTitle: clinic.title },
    });
    setConfirmationId(appointmentId);
    setStep(3);
  }

  return (
    <section className="container-custom max-w-3xl py-8 sm:py-12">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <CalendarCheck size={16} />
          حجز موعد
        </span>
        <h1 className="mt-4 text-ink">حجز موعد جديد</h1>
        <p className="mt-2 text-sm text-muted">أكمل الخطوات التالية لتأكيد موعدك بسهولة.</p>
      </div>

      {/* Stepper */}
      <div className="mt-8 flex items-center justify-center">
        {steps.map((s, index) => {
          const done = step > s.id;
          const active = step === s.id;
          return (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                    done
                      ? "gradient-primary text-white"
                      : active
                      ? "bg-white text-primary ring-2 ring-primary"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {done ? <CheckCircle2 size={20} /> : s.id}
                </div>
                <span className={`mt-2 hidden text-xs font-medium sm:block ${active || done ? "text-primary" : "text-muted"}`}>
                  {s.label}
                </span>
              </div>
              {index < steps.length - 1 ? (
                <div className={`mx-2 h-0.5 w-10 rounded-full sm:w-20 ${step > s.id ? "gradient-primary" : "bg-slate-200"}`} />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="step1" {...panelMotion} className="card p-5 sm:p-6">
              <label className="block text-sm font-semibold text-ink">
                اختر العيادة
                <select
                  value={clinicId}
                  onChange={(event) => {
                    setClinicId(Number(event.target.value));
                    setSlotKey("");
                  }}
                  className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {clinics.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>

              <p className="mt-5 mb-2 text-sm font-semibold text-ink">اختر الموعد المتاح</p>
              {slots.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-muted">لا توجد مواعيد متاحة لهذه العيادة حاليا.</p>
              ) : (
                <div className="grid gap-2 md:grid-cols-2">
                  {slots.map((slot) => {
                    const key = `${slot.doctorName}|${slot.day}|${slot.slot}`;
                    const selected = slotKey === key;
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setSlotKey(key)}
                        className={`rounded-xl border p-3 text-right transition-all duration-200 focus-ring ${
                          selected
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                            : "border-line hover:border-primary/40 hover:bg-primary/5"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                          <UserRound size={16} className="text-primary" />
                          {slot.doctorName}
                        </div>
                        <div className="mt-1 text-xs text-muted">{slot.day} - {slot.slot}</div>
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                onClick={goNextFromStepOne}
                className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!slotKey}
              >
                التالي
                <ArrowLeft size={18} />
              </button>
            </motion.div>
          ) : null}

          {step === 2 ? (
            <motion.div key="step2" {...panelMotion} className="card p-5 sm:p-6">
              <label className="block text-sm font-semibold text-ink">
                الاسم الكامل
                <input
                  value={patientName}
                  onChange={(event) => setPatientName(event.target.value)}
                  placeholder="ادخل اسمك الثلاثي"
                  className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="mt-4 block text-sm font-semibold text-ink">
                رقم الجوال
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                  className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-right text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>

              {selectedSlot ? (
                <div className="mt-4 rounded-xl bg-primary/5 p-3 text-xs text-muted">
                  <span className="font-semibold text-ink">{clinic?.title}</span> - {selectedSlot.doctorName} - {selectedSlot.day} - {selectedSlot.slot}
                </div>
              ) : null}

              <div className="mt-6 flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1">
                  <ArrowRight size={18} />
                  رجوع
                </button>
                <button
                  type="button"
                  onClick={confirmAppointment}
                  className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={patientName.trim().length < 3 || phone.trim().length < 8}
                >
                  تأكيد الحجز
                </button>
              </div>
            </motion.div>
          ) : null}

          {step === 3 ? (
            <motion.div key="step3" {...panelMotion} className="card overflow-hidden p-0">
              <div className="gradient-primary px-6 py-8 text-center text-white">
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur"
                >
                  <CheckCircle2 size={40} />
                </motion.div>
                <h2 className="mt-4 text-xl font-bold text-white">تم تأكيد الموعد بنجاح</h2>
                <p className="mt-1 text-sm text-white/85">سنتواصل معك لتأكيد التفاصيل.</p>
              </div>
              <div className="p-6">
                <div className="rounded-xl border border-line bg-slate-50 p-4 text-center">
                  <p className="text-xs text-muted">رقم التأكيد</p>
                  <p className="mt-1 text-lg font-bold tracking-wide text-primary">{confirmationId}</p>
                </div>
                <p className="mt-4 text-center text-sm text-muted">
                  يمكنك إدارة الموعد من بوابة المريض باستخدام رقم الجوال.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Link href="/patient" className="btn-primary flex-1">
                    إدارة المواعيد
                  </Link>
                  <a
                    href="https://wa.me/966123456789"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                  >
                    <MessageCircle size={16} />
                    إرسال على واتساب
                  </a>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );



  // return (
  //   <>
  //   <NotFound/>
  //   </>
  // )
}
