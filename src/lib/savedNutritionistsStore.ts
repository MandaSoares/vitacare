const STORAGE_KEY = "vitacare.saved.nutritionists";

const DEFAULT_SAVED_IDS = ["1", "2"];

const canUseStorage = (): boolean => typeof window !== "undefined";

const readSavedIds = (): string[] => {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return DEFAULT_SAVED_IDS;
  }

  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : DEFAULT_SAVED_IDS;
  } catch {
    return DEFAULT_SAVED_IDS;
  }
};

const writeSavedIds = (ids: string[]): void => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};

export const getSavedNutritionistIds = (): string[] => readSavedIds();

export const isNutritionistSaved = (nutritionistId: string): boolean => readSavedIds().includes(nutritionistId);

export const setNutritionistSaved = (nutritionistId: string, saved: boolean): string[] => {
  const nextIds = saved
    ? Array.from(new Set([...readSavedIds(), nutritionistId]))
    : readSavedIds().filter((id) => id !== nutritionistId);

  writeSavedIds(nextIds);
  return nextIds;
};

export const toggleNutritionistSaved = (nutritionistId: string): boolean => {
  const nextSaved = !isNutritionistSaved(nutritionistId);
  setNutritionistSaved(nutritionistId, nextSaved);
  return nextSaved;
};