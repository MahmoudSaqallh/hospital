import { api } from "@/lib/api";
import type {
  ClinicGroup,
  DoctorModel,
  UnifiedClinicModel,
} from "@/lib/clinic";

type ApiDepartment = {
  id: number;
  name: string;
  description?: string | null;
  floor?: number;
  category?: string;
  relevance?: number;
};

type DayHours = { start: string; end: string };

type ApiDoctor = {
  id: number;
  name: string;
  specialty?: string | null;
  phone?: string | null;
  department_id: number;
  department_name?: string;
  floor?: number | null;
  weekly_off?: number[] | string | null;
  working_hours?: Record<string, DayHours> | null;
  effective_floor?: number;
  department_floor?: number;
  photo_url?: string | null;
};

const COLORS = ["#0d9488", "#0369a1", "#7c3aed", "#b45309", "#be123c"];
const ICONS = ["stethoscope", "heart", "activity", "bone", "eye"];
const GROUPS: ClinicGroup[] = ["باطنية", "جراحة", "تشخيص"];

export const WEEKDAY_LABELS = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
] as const;

function apiOrigin() {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000/api";
  return apiUrl.replace(/\/api\/?$/, "") || "http://localhost:5000";
}

function mediaUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${apiOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
}

function normalizeWeeklyOff(raw: ApiDoctor["weekly_off"]): number[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw.map(Number);
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(Number) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeWorkingHours(
  raw: ApiDoctor["working_hours"],
): Record<number, DayHours> {
  if (!raw || typeof raw !== "object") return {};
  const result: Record<number, DayHours> = {};
  for (const [key, val] of Object.entries(raw)) {
    const day = Number(key);
    if (!Number.isInteger(day) || day < 0 || day > 6) continue;
    if (!val?.start || !val?.end) continue;
    result[day] = { start: val.start, end: val.end };
  }
  return result;
}

/** Build weekday schedule labels from API working hours */
function buildDoctorSchedule(
  weeklyOff: number[] = [],
  workingHours: Record<number, DayHours> = {},
): Record<string, string> {
  const schedule: Record<string, string> = {};
  for (let day = 0; day < 7; day++) {
    const label = WEEKDAY_LABELS[day];
    if (weeklyOff.includes(day)) {
      schedule[label] = "إجازة";
      continue;
    }
    const hours = workingHours[day];
    schedule[label] = hours ? `${hours.start}-${hours.end}` : "إجازة";
  }
  return schedule;
}

function mapDoctor(doc: ApiDoctor): DoctorModel & {
  id: number;
  weeklyOff: number[];
  workingHours: Record<number, DayHours>;
  effectiveFloor: number;
} {
  const weeklyOff = normalizeWeeklyOff(doc.weekly_off);
  const workingHours = normalizeWorkingHours(doc.working_hours);
  return {
    id: doc.id,
    name: doc.name,
    photo: mediaUrl(doc.photo_url),
    schedule: buildDoctorSchedule(weeklyOff, workingHours),
    weeklyOff,
    workingHours,
    effectiveFloor: Number(
      doc.effective_floor ?? doc.floor ?? doc.department_floor ?? 1,
    ),
  };
}

function normalizeCategory(raw: string | null | undefined, fallbackIndex: number): ClinicGroup {
  const value = String(raw || "").trim();
  const mapped = value === "باطنة" ? "باطنية" : value;
  if ((GROUPS as readonly string[]).includes(mapped)) {
    return mapped as ClinicGroup;
  }
  return GROUPS[fallbackIndex % GROUPS.length];
}

export async function fetchClinics(): Promise<UnifiedClinicModel[]> {
  const [departments, doctors] = await Promise.all([
    api<ApiDepartment[]>("/departments"),
    api<ApiDoctor[]>("/doctors"),
  ]);

  if (!Array.isArray(departments)) {
    console.error("fetchClinics: departments response is not an array", departments);
    return [];
  }

  const doctorList = Array.isArray(doctors) ? doctors : [];

  return departments.map((dep, index) => {
    const floor = Number(dep.floor ?? 1);
    const depDoctors = doctorList
      .filter((d) => Number(d.department_id) === Number(dep.id))
      .map(mapDoctor);

    return {
      id: dep.id,
      title: dep.name,
      desc: dep.description || "قسم طبي في العيادة",
      icon: ICONS[index % ICONS.length],
      color: COLORS[index % COLORS.length],
      group: normalizeCategory(dep.category, index),
      relevance: Number(dep.relevance ?? 50),
      floor: String(floor),
      branch: `الطابق ${floor}`,
      doctors: depDoctors,
    };
  });
}

export async function getClinicById(id: number) {
  const clinics = await fetchClinics();
  return clinics.find((c) => c.id === id) ?? null;
}

export async function getClinicsByGroup(group: ClinicGroup) {
  const clinics = await fetchClinics();
  return clinics.filter((c) => c.group === group);
}

/** @deprecated Prefer fetchClinics() — kept empty for any leftover sync imports */
export const clinics: UnifiedClinicModel[] = [];
