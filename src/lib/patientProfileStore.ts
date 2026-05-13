import type { AuthUser } from "@/contexts/AuthContext";

export type PatientProfile = {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate: string;
  height: string;
  weight: string;
  goal: string;
  activityLevel: string;
  allergies: string;
  conditions: string;
  profileImageUrl?: string;
};

const STORAGE_KEY = "vitacare.patient.profile";

const DEFAULT_PATIENT_PROFILE: PatientProfile = {
  name: "João Paciente",
  cpf: "123.456.789-00",
  email: "paciente@teste.com",
  phone: "(11) 99999-0000",
  birthDate: "1995-03-21",
  height: "175",
  weight: "70",
  goal: "Perda de peso",
  activityLevel: "Moderadamente ativo",
  allergies: "",
  conditions: "",
  profileImageUrl: "",
};

const canUseStorage = (): boolean => typeof window !== "undefined";

const readProfileMap = (): Record<string, PatientProfile> => {
  if (!canUseStorage()) {
    return {};
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as Record<string, PatientProfile>;
  } catch {
    return {};
  }
};

const writeProfileMap = (profiles: Record<string, PatientProfile>): void => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};

const getProfileKey = (user?: AuthUser | null): string => user?.email?.trim().toLowerCase() ?? DEFAULT_PATIENT_PROFILE.email;

export const getPatientProfile = (user?: AuthUser | null): PatientProfile => {
  const profiles = readProfileMap();
  const key = getProfileKey(user);
  return profiles[key] ?? { ...DEFAULT_PATIENT_PROFILE, email: key, name: user?.name ?? DEFAULT_PATIENT_PROFILE.name };
};

export const savePatientProfile = (user: AuthUser, profile: PatientProfile): PatientProfile => {
  const profiles = readProfileMap();
  const key = getProfileKey(user);
  const nextProfile = { ...profile, email: key };

  profiles[key] = nextProfile;
  writeProfileMap(profiles);

  return nextProfile;
};

export const getDefaultPatientProfile = (): PatientProfile => ({ ...DEFAULT_PATIENT_PROFILE });