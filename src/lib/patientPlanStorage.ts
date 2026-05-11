import type { PatientNutritionPlan } from "@/lib/patientPlanData";

const STORAGE_PREFIX = "vitacare:patient-plan:";

const storageKey = (patientId: string) => `${STORAGE_PREFIX}${patientId}`;

export const savePatientPlanToStorage = (plan: PatientNutritionPlan) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(plan.patientId), JSON.stringify(plan));
};

export const loadPatientPlanFromStorage = (patientId: string): PatientNutritionPlan | null => {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(storageKey(patientId));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PatientNutritionPlan;
  } catch {
    return null;
  }
};
