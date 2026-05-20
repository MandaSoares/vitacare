import type { AuthUser } from "@/contexts/AuthContext";

export type NutritionistBannerPresetId = "forest" | "sunrise" | "ocean";

export const bannerPresets = [
  {
    id: "forest" as const,
    name: "Verde clínico",
    className: "bg-gradient-to-r from-[#2f684b] via-[#2a7452] to-[#43795d]",
  },
  {
    id: "sunrise" as const,
    name: "Manhã leve",
    className: "bg-gradient-to-r from-[#a76f2a] via-[#c38f41] to-[#d0ad5a]",
  },
  {
    id: "ocean" as const,
    name: "Azul oceano",
    className: "bg-gradient-to-r from-[#255f79] via-[#2f7590] to-[#4c90a7]",
  },
] as const;

export type NutritionistProfile = {
  name: string;
  email: string;
  crn: string;
  phone: string;
  specialty: string;
  state: string;
  city: string;
  attendance: string;
  bio: string;
  formationPrimary: string;
  formationSecondary: string;
  serviceFirst: string;
  serviceReturn: string;
  servicePlan: string;
  serviceBioimpedance: string;
  mondayAvailability: string[];
  tuesdayAvailability: string[];
  wednesdayAvailability: string[];
  thursdayAvailability: string[];
  fridayAvailability: string[];
  saturdayAvailability: string[];
  sundayAvailability: string[];
  expertise: string[];
  otherExpertise: string;
  acceptedPlans: string[];
  otherPlan: string;
  careForAdults: boolean;
  careForChildren: boolean;
  profileImageUrl: string;
  bannerPreset: NutritionistBannerPresetId | "custom";
  customBannerImageUrl: string;
};

const STORAGE_KEY = "vitacare.nutritionist.profile";

const DEFAULT_NUTRITIONIST_PROFILE: NutritionistProfile = {
  name: "Dra. Maria Nutricionista",
  email: "nutricionista@teste.com",
  crn: "CRN 10002",
  phone: "(21) 99876-5432",
  specialty: "Clínica",
  state: "RJ",
  city: "Rio de Janeiro",
  attendance: "Presencial e Online",
  bio: "Nutricionista clínica com foco em reeducação alimentar e acompanhamento individualizado.",
  formationPrimary: "Graduação em Nutrição – Universidade Federal",
  formationSecondary: "Pós-graduação em Nutrição Clínica e Funcional",
  serviceFirst: "180",
  serviceReturn: "120",
  servicePlan: "240",
  serviceBioimpedance: "Inclusa na consulta",
  mondayAvailability: ["08:00 - 09:00", "09:00 - 10:00", "14:00 - 15:00"],
  tuesdayAvailability: ["08:00 - 09:00", "14:00 - 15:00"],
  wednesdayAvailability: ["08:00 - 09:00", "09:00 - 10:00"],
  thursdayAvailability: ["08:00 - 09:00", "14:00 - 15:00"],
  fridayAvailability: ["08:00 - 09:00", "09:00 - 10:00"],
  saturdayAvailability: ["Nao disponivel"],
  sundayAvailability: ["Nao disponivel"],
  expertise: ["Clínica", "Reeducação alimentar"],
  otherExpertise: "",
  acceptedPlans: ["Unimed", "Bradesco Saúde", "SulAmérica"],
  otherPlan: "",
  careForAdults: true,
  careForChildren: true,
  profileImageUrl: "",
  bannerPreset: "forest",
  customBannerImageUrl: "",
};

const normalizeNutritionistProfile = (profile: Partial<NutritionistProfile>): NutritionistProfile => ({
  ...DEFAULT_NUTRITIONIST_PROFILE,
  ...profile,
  serviceFirst: profile.serviceFirst ?? DEFAULT_NUTRITIONIST_PROFILE.serviceFirst,
  serviceReturn: profile.serviceReturn ?? DEFAULT_NUTRITIONIST_PROFILE.serviceReturn,
  servicePlan: profile.servicePlan ?? DEFAULT_NUTRITIONIST_PROFILE.servicePlan,
  serviceBioimpedance: profile.serviceBioimpedance ?? DEFAULT_NUTRITIONIST_PROFILE.serviceBioimpedance,
  mondayAvailability: profile.mondayAvailability ?? DEFAULT_NUTRITIONIST_PROFILE.mondayAvailability,
  tuesdayAvailability: profile.tuesdayAvailability ?? DEFAULT_NUTRITIONIST_PROFILE.tuesdayAvailability,
  wednesdayAvailability: profile.wednesdayAvailability ?? DEFAULT_NUTRITIONIST_PROFILE.wednesdayAvailability,
  thursdayAvailability: profile.thursdayAvailability ?? DEFAULT_NUTRITIONIST_PROFILE.thursdayAvailability,
  fridayAvailability: profile.fridayAvailability ?? DEFAULT_NUTRITIONIST_PROFILE.fridayAvailability,
  saturdayAvailability: profile.saturdayAvailability ?? DEFAULT_NUTRITIONIST_PROFILE.saturdayAvailability,
  sundayAvailability: profile.sundayAvailability ?? DEFAULT_NUTRITIONIST_PROFILE.sundayAvailability,
  expertise: profile.expertise ?? DEFAULT_NUTRITIONIST_PROFILE.expertise,
  otherExpertise: profile.otherExpertise ?? DEFAULT_NUTRITIONIST_PROFILE.otherExpertise,
  acceptedPlans: profile.acceptedPlans ?? DEFAULT_NUTRITIONIST_PROFILE.acceptedPlans,
  otherPlan: profile.otherPlan ?? DEFAULT_NUTRITIONIST_PROFILE.otherPlan,
  careForAdults: profile.careForAdults ?? DEFAULT_NUTRITIONIST_PROFILE.careForAdults,
  careForChildren: profile.careForChildren ?? DEFAULT_NUTRITIONIST_PROFILE.careForChildren,
  profileImageUrl: profile.profileImageUrl ?? DEFAULT_NUTRITIONIST_PROFILE.profileImageUrl,
  bannerPreset: profile.bannerPreset ?? DEFAULT_NUTRITIONIST_PROFILE.bannerPreset,
  customBannerImageUrl: profile.customBannerImageUrl ?? DEFAULT_NUTRITIONIST_PROFILE.customBannerImageUrl,
});

const canUseStorage = (): boolean => typeof window !== "undefined";

const readProfileMap = (): Record<string, NutritionistProfile> => {
  if (!canUseStorage()) {
    return {};
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as Record<string, NutritionistProfile>;
  } catch {
    return {};
  }
};

const writeProfileMap = (profiles: Record<string, NutritionistProfile>): void => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};

const getProfileKey = (user?: AuthUser | null): string => user?.email?.trim().toLowerCase() ?? DEFAULT_NUTRITIONIST_PROFILE.email;

export const getNutritionistProfile = (user?: AuthUser | null): NutritionistProfile => {
  const profiles = readProfileMap();
  const key = getProfileKey(user);

  return normalizeNutritionistProfile(
    profiles[key] ?? { ...DEFAULT_NUTRITIONIST_PROFILE, email: key, name: user?.name ?? DEFAULT_NUTRITIONIST_PROFILE.name },
  );
};

export const saveNutritionistProfile = (user: AuthUser, profile: NutritionistProfile): NutritionistProfile => {
  const profiles = readProfileMap();
  const key = getProfileKey(user);
  const nextProfile = normalizeNutritionistProfile({ ...profile, email: key });

  profiles[key] = nextProfile;
  writeProfileMap(profiles);

  return nextProfile;
};

export const getDefaultNutritionistProfile = (): NutritionistProfile => ({ ...DEFAULT_NUTRITIONIST_PROFILE });

export const getNutritionistBannerClassName = (bannerPreset: NutritionistProfile["bannerPreset"]): string => {
  const selected = bannerPresets.find((preset) => preset.id === bannerPreset);
  return selected?.className ?? bannerPresets[0].className;
};

export const getNutritionistInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
