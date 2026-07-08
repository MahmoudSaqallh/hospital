import rawCards from "@/app/jsonData/Cards.json";
import rawSchedules from "@/app/jsonData/scheduleWithDoctors.json";
import { cardsSchema, schedulesSchema } from "@/lib/schemas";
import type {
  ClinicCardModel,
  ClinicScheduleModel,
  UnifiedClinicModel,
} from "@/lib/clinic";

const parsedCards = cardsSchema.parse(rawCards) as ClinicCardModel[];
const parsedSchedules = schedulesSchema.parse(rawSchedules) as ClinicScheduleModel[];

const scheduleMap = new Map(parsedSchedules.map((item) => [item.id, item]));

export const clinics: UnifiedClinicModel[] = parsedCards.map((card) => {
  const schedule = scheduleMap.get(card.id);

  return {
    ...card,
    doctors: schedule?.doctors ?? [],
  };
});

export const clinicsById = new Map(clinics.map((clinic) => [clinic.id, clinic]));

export function getClinicById(id: number) {
  return clinicsById.get(id) ?? null;
}

export function getClinicsByGroup(group: ClinicCardModel["group"]) {
  return clinics.filter((clinic) => clinic.group === group);
}
