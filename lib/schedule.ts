export function parseClinicId(value: string) {
  const numericId = Number(value);
  if (!Number.isFinite(numericId) || numericId < 1) {
    return null;
  }
  return numericId;
}
