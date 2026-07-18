"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  MessageCircle,
  Phone,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { fetchClinics } from "@/lib/data";
import type { UnifiedClinicModel } from "@/lib/clinic";
import {
  buildAppointmentAt,
  createBookingOnApi,
  fetchDoctorBookableSlots,
  type BookableSlot,
  type DoctorSlotAlternative,
} from "@/lib/appointments";
import { trackEvent } from "@/lib/analytics";
import { ApiError } from "@/lib/api";
import { useToast } from "@/app/components/ToastProvider";

type BookingStep = 1 | 2 | 3;

const steps = [
  { id: 1, label: "العيادة والموعد" },
  { id: 2, label: "تأكيد الهوية" },
  { id: 3, label: "تم" },
];

const panelMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 pl-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

type FullDoctorOffer = {
  message: string;
  alternatives: DoctorSlotAlternative[];
  nextDay: string | null;
};

export default function BookingClient() {
  const params = useSearchParams();
  const { data: session, status } = useSession();
  const toast = useToast();
  const initialClinicId = Number(params.get("clinic"));
  const initialDoctorId = Number(params.get("doctor"));

  const [clinics, setClinics] = useState<UnifiedClinicModel[]>([]);
  const [step, setStep] = useState<BookingStep>(1);
  const [clinicId, setClinicId] = useState<number>(
    Number.isFinite(initialClinicId) && initialClinicId ? initialClinicId : 0,
  );
  const [doctorId, setDoctorId] = useState<number>(
    Number.isFinite(initialDoctorId) && initialDoctorId ? initialDoctorId : 0,
  );
  const [slotKey, setSlotKey] = useState<string>("");
  const [slots, setSlots] = useState<BookableSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [doctorFullOffer, setDoctorFullOffer] = useState<FullDoctorOffer | null>(
    null,
  );
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [confirmationId, setConfirmationId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.phone) setPhone(session.user.phone);
    if (session?.user?.nationalId) setNationalId(session.user.nationalId);
  }, [session]);

  useEffect(() => {
    fetchClinics().then((list) => {
      setClinics(list);
      const preferredClinic =
        Number.isFinite(initialClinicId) && initialClinicId
          ? list.find((c) => c.id === initialClinicId)
          : undefined;
      const nextClinic = preferredClinic ?? list[0];
      if (nextClinic) {
        setClinicId((current) => current || nextClinic.id);
      }
    });
  }, [initialClinicId]);

  const clinic = useMemo(
    () => clinics.find((item) => item.id === clinicId) ?? clinics[0],
    [clinicId, clinics],
  );

  const doctors = clinic?.doctors ?? [];

  const selectedDoctor = useMemo(
    () => doctors.find((d) => Number(d.id) === doctorId) ?? null,
    [doctors, doctorId],
  );

  // When clinic changes, keep doctor if still in list; otherwise pick first / query param
  useEffect(() => {
    if (!clinic) {
      setDoctorId(0);
      return;
    }
    const ids = clinic.doctors.map((d) => Number(d.id)).filter(Number.isFinite);
    if (!ids.length) {
      setDoctorId(0);
      return;
    }
    setDoctorId((current) => {
      if (current && ids.includes(current)) return current;
      if (
        Number.isFinite(initialDoctorId) &&
        initialDoctorId &&
        ids.includes(initialDoctorId) &&
        clinic.id ===
          (Number.isFinite(initialClinicId) && initialClinicId
            ? initialClinicId
            : clinic.id)
      ) {
        return initialDoctorId;
      }
      return ids[0];
    });
    setSlotKey("");
    setDoctorFullOffer(null);
  }, [clinic, initialClinicId, initialDoctorId]);

  useEffect(() => {
    if (!clinic || !selectedDoctor) {
      setSlots([]);
      setDoctorFullOffer(null);
      return;
    }
    let cancelled = false;
    setSlotsLoading(true);
    setSlotKey("");
    fetchDoctorBookableSlots(
      {
        id: Number(selectedDoctor.id),
        name: selectedDoctor.name,
        effectiveFloor: selectedDoctor.effectiveFloor,
      },
      clinic.floor,
    )
      .then((result) => {
        if (cancelled) return;
        setSlots(result.slots);
        if (result.doctorFullDays.length > 0) {
          setDoctorFullOffer({
            message:
              "الطبيب ممتلئ في بعض الأيام. يمكنك اختيار طبيب آخر من نفس القسم، أو الحجز في أول يوم متاح لاحقاً.",
            alternatives: result.alternatives,
            nextDay: result.nextAvailableDate,
          });
        } else {
          setDoctorFullOffer(null);
        }
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [clinic, selectedDoctor]);

  const selectedSlot = slots.find(
    (item) => `${item.doctorId}|${item.appointmentAt}` === slotKey,
  );

  const slotsByDay = useMemo(() => {
    const groups: Array<{ date: string; label: string; items: BookableSlot[] }> =
      [];
    const index = new Map<string, number>();
    for (const slot of slots) {
      let i = index.get(slot.date);
      if (i === undefined) {
        i = groups.length;
        index.set(slot.date, i);
        groups.push({
          date: slot.date,
          label: `${slot.day} ${slot.dateLabel || slot.date}`,
          items: [],
        });
      }
      groups[i].items.push(slot);
    }
    return groups;
  }, [slots]);

  function switchToAlternativeDoctor(altId: number) {
    setDoctorId(altId);
    setSlotKey("");
    setDoctorFullOffer(null);
    setError("");
    setStep(1);
    toast.success("تم التحويل لطبيب آخر من نفس القسم — اختر موعداً مناسباً.");
  }

  function jumpToNextAvailableDay() {
    const nextDate = doctorFullOffer?.nextDay || slotsByDay[0]?.date;
    if (!nextDate) {
      toast.error("لا يوجد يوم متاح حالياً لهذا الطبيب.");
      return;
    }
    const first = slots.find((s) => s.date === nextDate);
    if (first) {
      setSlotKey(`${first.doctorId}|${first.appointmentAt}`);
      setStep(1);
      setError("");
      toast.success(`تم اختيار أول موعد متاح في ${first.dateLabel || nextDate}`);
      document
        .getElementById(`day-${nextDate}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      toast.success("اختر موعداً من الأيام المتاحة أدناه.");
    }
  }

  async function confirmBooking() {
    setError("");
    if (!clinic || !selectedSlot) return;

    if (status !== "authenticated" || !session?.accessToken) {
      setError("يجب تسجيل الدخول أولاً لإتمام الحجز.");
      return;
    }

    if (!phone.trim() || !nationalId.trim()) {
      setError("أدخل رقم الجوال ورقم الهوية لتأكيد الحجز.");
      return;
    }

    const bookingDoctorId = selectedSlot.doctorId;
    if (!bookingDoctorId) {
      setError("تعذر تحديد الطبيب. تأكد من إضافة أطباء في الداشبورد.");
      return;
    }

    setSubmitting(true);
    try {
      const appointmentAt =
        selectedSlot.appointmentAt ||
        buildAppointmentAt(selectedSlot.day, selectedSlot.slot);
      const booking = await createBookingOnApi({
        token: session.accessToken,
        doctorId: bookingDoctorId,
        appointmentAt,
        notes: `${selectedSlot.day} ${selectedSlot.date} ${selectedSlot.slot}`,
        phone: phone.trim(),
        nationalId: nationalId.trim(),
      });

      trackEvent({
        event: "booking_confirmed",
        metadata: { clinicId: clinic.id, clinicTitle: clinic.title },
      });
      setConfirmationId(String(booking.id));
      setStep(3);
      setDoctorFullOffer(null);
      toast.success(
        `تم تأكيد حجزك بنجاح${booking.id ? ` — رقم الحجز ${booking.id}` : ""}`,
      );
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "تعذر إتمام الحجز. حاول مرة أخرى.";
      setError(message);

      if (err instanceof ApiError && err.payload?.code === "DOCTOR_FULL") {
        const alts = Array.isArray(err.payload.alternatives)
          ? (err.payload.alternatives as DoctorSlotAlternative[])
          : [];
        const nextDay =
          typeof err.payload.next_day === "string" ? err.payload.next_day : null;
        setDoctorFullOffer({
          message,
          alternatives: alts,
          nextDay,
        });
        setStep(1);
        toast.error("الطبيب ممتلئ لهذا اليوم — اختر بديلاً أو اليوم التالي.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const alternativePanel =
    doctorFullOffer &&
    (doctorFullOffer.alternatives.length > 0 || doctorFullOffer.nextDay) ? (
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <p className="font-semibold">{doctorFullOffer.message}</p>
        {doctorFullOffer.alternatives.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {doctorFullOffer.alternatives.map((alt) => (
              <button
                key={alt.id}
                type="button"
                onClick={() => switchToAlternativeDoctor(alt.id)}
                className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-primary hover:bg-primary/5"
              >
                التحويل إلى {alt.name}
              </button>
            ))}
          </div>
        ) : null}
        {doctorFullOffer.nextDay || slots.length > 0 ? (
          <button
            type="button"
            onClick={jumpToNextAvailableDay}
            className="mt-3 text-xs font-bold text-primary underline"
          >
            لا أريد — سأحجز في اليوم التالي / أول يوم متاح
          </button>
        ) : null}
      </div>
    ) : null;

  return (
    <section className="container-custom max-w-3xl py-8 sm:py-12">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <CalendarCheck size={16} />
          حجز موعد
        </span>
        <h1 className="mt-4 text-ink">حجز موعد جديد</h1>
        <p className="mt-2 text-sm text-muted">
          اختر العيادة ثم الطبيب، وبعدها اختر موعداً من مواعيده المتاحة.
        </p>
      </div>

      {status !== "authenticated" ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          يلزم{" "}
          <Link href="/login?callbackUrl=/booking" className="font-bold underline">
            تسجيل الدخول
          </Link>{" "}
          قبل تأكيد الحجز.
        </div>
      ) : null}

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
                <span
                  className={`mt-2 hidden text-xs font-medium sm:block ${
                    active || done ? "text-primary" : "text-muted"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {index < steps.length - 1 ? (
                <div
                  className={`mx-2 h-0.5 w-10 rounded-full sm:w-20 ${
                    step > s.id ? "gradient-primary" : "bg-slate-200"
                  }`}
                />
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
                  value={clinicId || clinic?.id || ""}
                  onChange={(event) => {
                    setClinicId(Number(event.target.value));
                    setDoctorId(0);
                    setSlotKey("");
                    setSlots([]);
                    setDoctorFullOffer(null);
                  }}
                  className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {clinics.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                      {item.floor ? ` — الطابق ${item.floor}` : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-4 block text-sm font-semibold text-ink">
                اختر الطبيب
                <select
                  value={doctorId || ""}
                  onChange={(event) => {
                    setDoctorId(Number(event.target.value));
                    setSlotKey("");
                    setDoctorFullOffer(null);
                  }}
                  disabled={!doctors.length}
                  className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                >
                  {!doctors.length ? (
                    <option value="">لا يوجد أطباء في هذه العيادة</option>
                  ) : (
                    doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name}
                        {doc.effectiveFloor != null
                          ? ` — الطابق ${doc.effectiveFloor}`
                          : ""}
                      </option>
                    ))
                  )}
                </select>
              </label>

              {selectedDoctor ? (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2 text-sm text-ink">
                  <Stethoscope size={16} className="text-primary" />
                  مواعيد الدكتور <span className="font-semibold">{selectedDoctor.name}</span>
                </div>
              ) : null}

              {alternativePanel}

              <p className="mt-5 mb-2 text-sm font-semibold text-ink">اختر الموعد المتاح</p>
              {!selectedDoctor ? (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-muted">
                  اختر طبيباً لعرض مواعيده المتاحة.
                </p>
              ) : slotsLoading ? (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-muted">
                  جاري تحميل مواعيد الطبيب…
                </p>
              ) : slots.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-muted">
                  لا توجد مواعيد فاضية لهذا الطبيب خلال الأسبوعين القادمين.
                  {doctorFullOffer?.alternatives.length
                    ? " جرّب طبيباً آخر من نفس القسم أعلاه."
                    : ""}
                </p>
              ) : (
                <div className="max-h-[32rem] space-y-4 overflow-y-auto pe-1">
                  {slotsByDay.map((group) => (
                    <div key={group.date} id={`day-${group.date}`}>
                      <p className="mb-2 sticky top-0 z-10 bg-white/95 py-1 text-xs font-bold text-ink backdrop-blur">
                        {group.label}
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {group.items.map((slot) => {
                          const key = `${slot.doctorId}|${slot.appointmentAt}`;
                          const selected = slotKey === key;
                          const range = slot.endSlot
                            ? `${slot.slot} – ${slot.endSlot}`
                            : slot.slot;
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
                                {range}
                              </div>
                              <div className="mt-1 text-xs text-muted">
                                {slot.floor != null ? `الطابق ${slot.floor}` : selectedDoctor.name}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => slotKey && setStep(2)}
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
              {selectedSlot ? (
                <div className="rounded-xl bg-primary/5 p-3 text-sm text-muted">
                  <span className="font-semibold text-ink">{clinic?.title}</span>
                  {clinic?.floor ? ` (الطابق ${clinic.floor})` : ""} —{" "}
                  {selectedSlot.doctorName} — {selectedSlot.day}{" "}
                  {selectedSlot.dateLabel || selectedSlot.date} —{" "}
                  {selectedSlot.endSlot
                    ? `${selectedSlot.slot} – ${selectedSlot.endSlot}`
                    : selectedSlot.slot}
                </div>
              ) : null}

              <p className="mt-5 text-sm font-semibold text-ink">تأكيد الحجز</p>
              <p className="mt-1 text-xs text-muted">
                أدخل رقم الجوال ورقم الهوية المسجّلين في حسابك لتأكيد الموعد.
              </p>

              <label className="mt-4 block text-sm font-semibold text-ink">
                رقم الجوال
                <div className="relative">
                  <Phone
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                    autoComplete="tel"
                    dir="ltr"
                    placeholder="05xxxxxxxx"
                    className={inputClass}
                  />
                </div>
              </label>

              <label className="mt-3 block text-sm font-semibold text-ink">
                رقم الهوية
                <div className="relative">
                  <CreditCard
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    value={nationalId}
                    onChange={(event) => setNationalId(event.target.value)}
                    required
                    inputMode="numeric"
                    dir="ltr"
                    placeholder="xxxxxxxxxxx"
                    className={inputClass}
                  />
                </div>
              </label>

              {error ? (
                <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
              ) : null}

              <div className="mt-6 flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1">
                  <ArrowRight size={18} />
                  رجوع
                </button>
                <button
                  type="button"
                  onClick={confirmBooking}
                  className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={
                    submitting ||
                    status !== "authenticated" ||
                    !phone.trim() ||
                    !nationalId.trim()
                  }
                >
                  {submitting ? "جاري التأكيد..." : "تأكيد الحجز"}
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
                <p className="mt-1 text-sm text-white/85">
                  تم التحقق من هويتك وأصبح الحجز مؤكداً.
                </p>
              </div>
              <div className="p-6">
                <div className="rounded-xl border border-line bg-slate-50 p-4 text-center">
                  <p className="text-xs text-muted">رقم الحجز</p>
                  <p className="mt-1 text-lg font-bold tracking-wide text-primary">{confirmationId}</p>
                </div>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Link href="/patient" className="btn-primary flex-1">
                    مواعيدي
                  </Link>
                  <a
                    href="https://wa.me/970597715288"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                  >
                    <MessageCircle size={16} />
                    واتساب
                  </a>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
