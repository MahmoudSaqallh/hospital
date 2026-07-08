import { z } from "zod";

const clinicGroupSchema = z.enum(["باطنية", "جراحة", "تشخيص"]);

export const cardSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  desc: z.string().min(1),
  icon: z.string().min(1),
  color: z.string().min(1),
  group: clinicGroupSchema,
  branch: z.string().min(1).optional(),
});

export const cardsSchema = z.array(cardSchema);

export const doctorScheduleSchema = z.record(z.string(), z.string().min(1));

export const doctorSchema = z.object({
  name: z.string().min(1),
  photo: z.string().min(1).optional(),
  schedule: doctorScheduleSchema,
});

export const scheduleSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  group: clinicGroupSchema,
  floor: z.string().min(1).optional(),
  doctors: z.array(doctorSchema),
});

export const schedulesSchema = z.array(scheduleSchema);
