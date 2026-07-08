import { describe, expect, it } from "vitest";
import { filterClinics, type ClinicCardModel } from "@/lib/clinic";

const clinics: ClinicCardModel[] = [
  {
    id: 1,
    title: "الصدرية",
    desc: "أمراض التنفس",
    icon: "lungs",
    color: "#000000",
    group: "باطنية",
  },
  {
    id: 2,
    title: "النساء والولادة",
    desc: "صحة المرأة",
    icon: "female",
    color: "#000000",
    group: "جراحة",
  },
];

describe("filterClinics", () => {
  it("filters by group", () => {
    const result = filterClinics(clinics, "باطنية", "");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("filters by search term across title/description", () => {
    const result = filterClinics(clinics, "all", "المرأة");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });
});
