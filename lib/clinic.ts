export const CLINIC_GROUPS = ["باطنية", "جراحة", "تشخيص"] as const;

export type ClinicGroup = (typeof CLINIC_GROUPS)[number];

export type CardFilter = "all" | ClinicGroup;

export type ClinicCardModel = {
  id: number;
  title: string;
  desc: string;
  icon: string;
  color: string;
  group: ClinicGroup;
  branch?: string;
  floor?: string;
  relevance?: number;
};

export type DoctorScheduleValue = string;

export type DoctorModel = {
  id?: number;
  name: string;
  photo?: string;
  schedule: Record<string, DoctorScheduleValue>;
  weeklyOff?: number[];
  effectiveFloor?: number;
};

export type ClinicScheduleModel = {
  id: number;
  title: string;
  group: ClinicGroup;
  floor?: string;
  doctors: DoctorModel[];
};

export type UnifiedClinicModel = ClinicCardModel & {
  doctors: DoctorModel[];
  floor?: string;
};

export function filterClinics<T extends ClinicCardModel>(
  clinics: T[],
  filter: CardFilter,
  search: string,
): T[] {
  const normalizedSearch = search.trim().toLowerCase();

  return clinics.filter((clinic) => {
    const matchesGroup = filter === "all" || clinic.group === filter;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      clinic.title.toLowerCase().includes(normalizedSearch) ||
      clinic.desc.toLowerCase().includes(normalizedSearch);

    return matchesGroup && matchesSearch;
  });
}

export function clinicAvailabilityHint(doctors: DoctorModel[]) {
  if (doctors.length === 0) {
    return "لا توجد مواعيد متاحة حاليا";
  }

  const hasTodayOrWeekSlots = doctors.some((doctor) =>
    Object.values(doctor.schedule).some((slot) => slot !== "إجازة"),
  );

  return hasTodayOrWeekSlots ? "متاح هذا الأسبوع" : "لا توجد مواعيد هذا الأسبوع";
}
