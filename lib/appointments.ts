import type { UnifiedClinicModel } from "@/lib/clinic";

export type Appointment = {
  id: string;
  patientName: string;
  phone: string;
  clinicId: number;
  clinicTitle: string;
  doctorName: string;
  day: string;
  slot: string;
  createdAt: string;
};

const APPOINTMENTS_KEY = "clinic_appointments_v1";

export function createAppointmentId() {
  return `APT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function getAvailableSlots(clinic: UnifiedClinicModel) {
  return clinic.doctors.flatMap((doctor) =>
    Object.entries(doctor.schedule)
      .filter(([, slot]) => slot !== "إجازة")
      .map(([day, slot]) => ({
        doctorName: doctor.name,
        day,
        slot,
      })),
  );
}

export function saveAppointment(appointment: Appointment) {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem(APPOINTMENTS_KEY);
  const appointments: Appointment[] = stored ? JSON.parse(stored) : [];
  appointments.push(appointment);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
}

export function findAppointmentsByPhone(phone: string) {
  if (typeof window === "undefined") return [] as Appointment[];

  const stored = localStorage.getItem(APPOINTMENTS_KEY);
  if (!stored) return [] as Appointment[];

  const appointments = JSON.parse(stored) as Appointment[];
  return appointments.filter((item) => item.phone === phone);
}

export function cancelAppointment(appointmentId: string) {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem(APPOINTMENTS_KEY);
  if (!stored) return;

  const appointments = JSON.parse(stored) as Appointment[];
  const updated = appointments.filter((item) => item.id !== appointmentId);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
}
