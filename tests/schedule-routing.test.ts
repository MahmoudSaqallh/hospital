import { describe, expect, it } from "vitest";
import { parseClinicId } from "@/lib/schedule";
import { getClinicById } from "@/lib/data";

describe("schedule routing and data lookup", () => {
  it("parses valid clinic id from dynamic route", () => {
    expect(parseClinicId("4")).toBe(4);
  });

  it("rejects invalid clinic id values", () => {
    expect(parseClinicId("abc")).toBeNull();
    expect(parseClinicId("0")).toBeNull();
  });

  it("returns null when clinic id does not exist", () => {
    expect(getClinicById(9999)).toBeNull();
  });
});
