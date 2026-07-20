import type { UnifiedClinicModel } from "@/lib/clinic";
import { api } from "@/lib/api";
import { WEEKDAY_LABELS } from "@/lib/data";

export type Appointment = {
  id: string;
  patientName: string;
  phone: string;
  clinicId: number;
  clinicTitle: string;
  doctorName: string;
  doctorId?: number;
  day: string;
  slot: string;
  appointmentAt?: string;
  status?: string;
  paymentStatus?: string;
  notes?: string | null;
  createdAt: string;
};

export const ACTIVE_BOOKING_STATUSES = new Set([
  "pending",
  "pending_payment",
  "confirmed",
]);

export function findActivePatientBooking(appointments: Appointment[]) {
  return appointments.find(
    (item) => item.status && ACTIVE_BOOKING_STATUSES.has(item.status),
  );
}

export type PaymentProvider =
  | "bank_of_palestine"
  | "palpay"
  | "jawwal_pay";

export type BookableSlot = {
  doctorName: string;
  doctorId: number;
  day: string;
  slot: string;
  endSlot?: string;
  date: string;
  dateLabel: string;
  appointmentAt: string;
  floor?: number;
};

/** Map Arabic weekday label to next Date for that day */
const DAY_INDEX: Record<string, number> = {
  الأحد: 0,
  الاحد: 0,
  الاثنين: 1,
  الثلاثاء: 2,
  الأربعاء: 3,
  الاربعاء: 3,
  الخميس: 4,
  الجمعة: 5,
  السبت: 6,
};

function formatDateLabel(isoDate: string) {
  const m = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return isoDate;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

function addThirtyMinutes(time: string): string {
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return time;
  const total = Number(match[1]) * 60 + Number(match[2]) + 30;
  const h = Math.floor(total / 60) % 24;
  const mins = total % 60;
  return `${String(h).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

/** Legacy range-based slots from doctor.schedule (display fallback) */
export function getAvailableSlots(clinic: UnifiedClinicModel) {
  return clinic.doctors.flatMap((doctor) =>
    Object.entries(doctor.schedule)
      .filter(([, slot]) => slot !== "إجازة")
      .filter(([day]) => {
        const weeklyOff = doctor.weeklyOff ?? [];
        if (!weeklyOff.length) return true;
        const dow = DAY_INDEX[day];
        if (dow === undefined) return true;
        return !weeklyOff.includes(dow);
      })
      .map(([day, slot]) => ({
        doctorName: doctor.name,
        doctorId: "id" in doctor ? Number((doctor as { id?: number }).id) : undefined,
        day,
        slot,
        floor:
          doctor.effectiveFloor != null
            ? Number(doctor.effectiveFloor)
            : clinic.floor
              ? Number(clinic.floor)
              : undefined,
      })),
  );
}

function formatDateStr(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export type DoctorSlotAlternative = {
  id: number;
  name: string;
  specialty?: string | null;
};

export type DoctorSlotsResult = {
  slots: BookableSlot[];
  doctorFullDays: string[];
  alternatives: DoctorSlotAlternative[];
  nextAvailableDate: string | null;
  dailyCapacity: number | null;
};

export async function fetchDoctorAvailableSlots(doctorId: number): Promise<{
  slots: Array<{
    date: string;
    weekday: number;
    time: string;
    end_time?: string;
    appointment_at: string;
  }>;
  doctor_full_days?: string[];
  alternatives?: DoctorSlotAlternative[];
  next_available_date?: string | null;
  daily_capacity?: number;
}> {
  const from = new Date();
  const to = new Date();
  to.setDate(to.getDate() + 13);
  const qs = new URLSearchParams({
    from: formatDateStr(from),
    to: formatDateStr(to),
  });
  return api(`/doctors/${doctorId}/available-slots?${qs}`);
}

type SlotDoctorMeta = {
  id: number;
  name: string;
  effectiveFloor?: number | null;
};

/** Free 30-min slots for one doctor */
export async function fetchDoctorBookableSlots(
  doctor: SlotDoctorMeta,
  clinicFloor?: number | string | null,
): Promise<DoctorSlotsResult> {
  const doctorId = Number(doctor.id);
  if (!Number.isFinite(doctorId)) {
    return {
      slots: [],
      doctorFullDays: [],
      alternatives: [],
      nextAvailableDate: null,
      dailyCapacity: null,
    };
  }

  try {
    const data = await fetchDoctorAvailableSlots(doctorId);
    const slots = (data.slots ?? [])
      .map((s) => ({
        doctorName: doctor.name,
        doctorId,
        day: WEEKDAY_LABELS[s.weekday] ?? s.date,
        slot: s.time,
        endSlot: s.end_time || addThirtyMinutes(s.time),
        date: s.date,
        dateLabel: formatDateLabel(s.date),
        appointmentAt: s.appointment_at,
        floor:
          doctor.effectiveFloor != null
            ? Number(doctor.effectiveFloor)
            : clinicFloor
              ? Number(clinicFloor)
              : undefined,
      }))
      .sort((a, b) => a.appointmentAt.localeCompare(b.appointmentAt));

    return {
      slots,
      doctorFullDays: data.doctor_full_days ?? [],
      alternatives: data.alternatives ?? [],
      nextAvailableDate: data.next_available_date ?? slots[0]?.date ?? null,
      dailyCapacity:
        data.daily_capacity != null ? Number(data.daily_capacity) : null,
    };
  } catch {
    return {
      slots: [],
      doctorFullDays: [],
      alternatives: [],
      nextAvailableDate: null,
      dailyCapacity: null,
    };
  }
}

/** Free 30-min slots across all doctors in a clinic */
export async function fetchClinicBookableSlots(
  clinic: UnifiedClinicModel,
): Promise<BookableSlot[]> {
  const results = await Promise.all(
    clinic.doctors.map((doctor) =>
      fetchDoctorBookableSlots(
        {
          id: Number(doctor.id),
          name: doctor.name,
          effectiveFloor: doctor.effectiveFloor,
        },
        clinic.floor,
      ),
    ),
  );
  return results
    .flatMap((r) => r.slots)
    .sort((a, b) => a.appointmentAt.localeCompare(b.appointmentAt));
}

function parseSlotTime(slot: string): { hours: number; minutes: number } {
  const match = slot.match(/(\d{1,2}):(\d{2})/);
  if (match) {
    return { hours: Number(match[1]), minutes: Number(match[2]) };
  }
  const hourOnly = slot.match(/(\d{1,2})/);
  return { hours: hourOnly ? Number(hourOnly[1]) : 9, minutes: 0 };
}

export function buildAppointmentAt(day: string, slot: string): string {
  const targetDow = DAY_INDEX[day] ?? 0;
  const now = new Date();
  const result = new Date(now);
  const delta = (targetDow - now.getDay() + 7) % 7 || 7;
  result.setDate(now.getDate() + delta);
  const { hours, minutes } = parseSlotTime(slot);
  result.setHours(hours, minutes, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${result.getFullYear()}-${pad(result.getMonth() + 1)}-${pad(result.getDate())} ${pad(result.getHours())}:${pad(result.getMinutes())}:00`;
}

export async function createBookingOnApi(params: {
  token: string;
  doctorId: number;
  appointmentAt: string;
  notes?: string;
  phone: string;
  nationalId: string;
}) {
  return api<{
    id: number;
    status: string;
    payment_status: string;
    deposit_amount: number;
    doctor_name: string;
    department_name: string;
    appointment_at: string;
  }>("/bookings", {
    method: "POST",
    auth: true,
    token: params.token,
    body: {
      doctor_id: params.doctorId,
      appointment_at: params.appointmentAt,
      notes: params.notes || null,
      phone: params.phone,
      national_id: params.nationalId,
    },
  });
}

export async function initDepositPayment(params: {
  token: string;
  bookingId: number;
  provider: PaymentProvider;
}) {
  return api<{
    id: number;
    checkoutUrl: string;
    amount: number;
    mock?: boolean;
    status: string;
  }>("/payments/init", {
    method: "POST",
    auth: true,
    token: params.token,
    body: {
      booking_id: params.bookingId,
      provider: params.provider,
    },
  });
}

export async function completeMockPayment(params: {
  token: string;
  paymentId: number;
}) {
  return api("/payments/mock/complete", {
    method: "POST",
    auth: true,
    token: params.token,
    body: { payment_id: params.paymentId },
  });
}

export async function fetchMyBookings(token: string): Promise<Appointment[]> {
  const rows = await api<
    Array<{
      id: number;
      doctor_id: number;
      doctor_name: string;
      department_name: string;
      appointment_at: string;
      status: string;
      payment_status?: string;
      created_at: string;
      notes?: string | null;
    }>
  >("/bookings/me", { auth: true, token });

  return rows
    .map((row) => {
    const at = new Date(row.appointment_at);
    return {
      id: String(row.id),
      patientName: "",
      phone: "",
      clinicId: 0,
      clinicTitle: row.department_name,
      doctorName: row.doctor_name,
      doctorId: row.doctor_id,
      day: at.toLocaleDateString("ar-EG", { weekday: "long" }),
      slot: at.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      appointmentAt: row.appointment_at,
      status: row.status,
      paymentStatus: row.payment_status,
      notes: row.notes ?? null,
      createdAt: row.created_at,
    };
  })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() ||
        Number(b.id) - Number(a.id),
    );
}

/** localStorage helpers kept as no-ops for backward compatibility */
export function createAppointmentId() {
  return `APT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function saveAppointment(_appointment: Appointment) {
  // persisted on backend
}

export function findAppointmentsByPhone(_phone: string) {
  return [] as Appointment[];
}

export function cancelAppointment(_appointmentId: string) {
  // cancelling via admin API only for now
}
