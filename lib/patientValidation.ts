import { z } from "zod";

export const PATIENT_PHONE_REGEX = /^(059|056)\d{7}$/;
export const PATIENT_NATIONAL_ID_REGEX = /^\d{10}$/;

export const PATIENT_PHONE_ERROR =
  "رقم الجوال يجب أن يبدأ بـ 059 أو 056 ويتكون من 10 أرقام";
export const PATIENT_NATIONAL_ID_ERROR = "رقم الهوية يجب أن يكون 10 أرقام";

export function digitsOnly(value: string, maxLength?: number) {
  const digits = value.replace(/\D/g, "");
  return maxLength != null ? digits.slice(0, maxLength) : digits;
}

export function normalizePatientPhone(value: string) {
  return digitsOnly(value);
}

export function normalizePatientNationalId(value: string) {
  return digitsOnly(value);
}

export function isValidPatientPhone(value: string) {
  return PATIENT_PHONE_REGEX.test(normalizePatientPhone(value));
}

export function isValidPatientNationalId(value: string) {
  return PATIENT_NATIONAL_ID_REGEX.test(normalizePatientNationalId(value));
}

export function validatePatientPhone(value: string) {
  const normalized = normalizePatientPhone(value);
  if (!normalized) {
    return { ok: false as const, error: "رقم الجوال مطلوب" };
  }
  if (!PATIENT_PHONE_REGEX.test(normalized)) {
    return { ok: false as const, error: PATIENT_PHONE_ERROR };
  }
  return { ok: true as const, value: normalized };
}

export function validatePatientNationalId(value: string) {
  const normalized = normalizePatientNationalId(value);
  if (!normalized) {
    return { ok: false as const, error: "رقم الهوية مطلوب" };
  }
  if (!PATIENT_NATIONAL_ID_REGEX.test(normalized)) {
    return { ok: false as const, error: PATIENT_NATIONAL_ID_ERROR };
  }
  return { ok: true as const, value: normalized };
}

export const patientRegisterSchema = z.object({
  name: z.string().trim().min(2, "الاسم قصير جداً"),
  phone: z
    .string()
    .trim()
    .transform(normalizePatientPhone)
    .refine((value) => PATIENT_PHONE_REGEX.test(value), {
      message: PATIENT_PHONE_ERROR,
    }),
  national_id: z
    .string()
    .trim()
    .transform(normalizePatientNationalId)
    .refine((value) => PATIENT_NATIONAL_ID_REGEX.test(value), {
      message: PATIENT_NATIONAL_ID_ERROR,
    }),
});
