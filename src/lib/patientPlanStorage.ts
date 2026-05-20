import type { PatientNutritionPlan } from "@/lib/patientPlanData";

const STORAGE_PREFIX = "vitacare:patient-plan:";

const storageKey = (patientId: string) => `${STORAGE_PREFIX}${patientId}`;

// Mock plans for patients without stored plans
const mockPlans: Record<string, PatientNutritionPlan> = {
  "1": {
    patientId: "1",
    patientName: "João Silva",
    title: "Plano de Emagrecimento",
    updatedAt: "2026-05-15T08:00:00.000Z",
    observations: "Reduzir ingestão calórica mantendo proteína alta. Evitar alimentos processados.",
    dailyCaloriesGoal: 1600,
    dailyProteinGoal: 120,
    dailyCarbsGoal: 160,
    dailyFatsGoal: 53,
    meals: [
      {
        id: "meal-1",
        name: "Café da manhã",
        time: "07:00",
        calories: 350,
        proteinGrams: 25,
        carbsGrams: 30,
        fatsGrams: 10,
        foods: [
          { id: "food-1", name: "Ovos mexidos", quantity: "3 unidades", calories: 220 },
          { id: "food-2", name: "Tomate", quantity: "1 tomate", calories: 30 },
          { id: "food-3", name: "Café preto", quantity: "1 xícara", calories: 10 }
        ]
      },
      {
        id: "meal-2",
        name: "Almoço",
        time: "12:00",
        calories: 520,
        proteinGrams: 45,
        carbsGrams: 50,
        fatsGrams: 18,
        foods: [
          { id: "food-4", name: "Frango grelhado", quantity: "200g", calories: 320 },
          { id: "food-5", name: "Arroz integral", quantity: "80g", calories: 96 },
          { id: "food-6", name: "Brócolis cozido", quantity: "200g", calories: 70 },
          { id: "food-7", name: "Azeite", quantity: "0.5 colher", calories: 45 }
        ]
      },
      {
        id: "meal-3",
        name: "Lanche",
        time: "15:30",
        calories: 150,
        proteinGrams: 20,
        carbsGrams: 10,
        fatsGrams: 5,
        foods: [
          { id: "food-8", name: "Iogurte natural", quantity: "200g", calories: 150 }
        ]
      },
      {
        id: "meal-4",
        name: "Jantar",
        time: "19:00",
        calories: 480,
        proteinGrams: 50,
        carbsGrams: 40,
        fatsGrams: 15,
        foods: [
          { id: "food-9", name: "Peixe grelhado", quantity: "180g", calories: 280 },
          { id: "food-10", name: "Batata doce", quantity: "100g", calories: 90 },
          { id: "food-11", name: "Cenoura", quantity: "100g", calories: 40 },
          { id: "food-12", name: "Azeite", quantity: "0.5 colher", calories: 45 }
        ]
      }
    ]
  },
  "2": {
    patientId: "2",
    patientName: "Maria Santos",
    title: "Plano de Controle Glicêmico",
    updatedAt: "2026-05-12T10:30:00.000Z",
    observations: "Reduzir carboidratos simples e aumentar fibras. Fazer refeições a cada 3 horas.",
    dailyCaloriesGoal: 1800,
    dailyProteinGoal: 95,
    dailyCarbsGoal: 200,
    dailyFatsGoal: 60,
    meals: [
      {
        id: "meal-1",
        name: "Café da manhã",
        time: "07:30",
        calories: 380,
        proteinGrams: 18,
        carbsGrams: 35,
        fatsGrams: 14,
        foods: [
          { id: "food-1", name: "Ovos cozidos", quantity: "2 unidades", calories: 160 },
          { id: "food-2", name: "Pão integral", quantity: "2 fatias", calories: 140 },
          { id: "food-3", name: "Manteiga", quantity: "1 colher", calories: 80 }
        ]
      },
      {
        id: "meal-2",
        name: "Almoço",
        time: "12:00",
        calories: 600,
        proteinGrams: 40,
        carbsGrams: 65,
        fatsGrams: 18,
        foods: [
          { id: "food-4", name: "Peixe grelhado", quantity: "180g", calories: 280 },
          { id: "food-5", name: "Batata doce", quantity: "100g", calories: 90 },
          { id: "food-6", name: "Brócolis", quantity: "150g", calories: 50 },
          { id: "food-7", name: "Azeite", quantity: "1 colher", calories: 95 }
        ]
      },
      {
        id: "meal-3",
        name: "Lanche",
        time: "15:00",
        calories: 200,
        proteinGrams: 12,
        carbsGrams: 25,
        fatsGrams: 6,
        foods: [
          { id: "food-8", name: "Maçã", quantity: "1 unidade", calories: 95 },
          { id: "food-9", name: "Amêndoas", quantity: "20g", calories: 105 }
        ]
      },
      {
        id: "meal-4",
        name: "Jantar",
        time: "19:00",
        calories: 550,
        proteinGrams: 35,
        carbsGrams: 45,
        fatsGrams: 16,
        foods: [
          { id: "food-10", name: "Frango assado", quantity: "150g", calories: 260 },
          { id: "food-11", name: "Arroz integral", quantity: "80g", calories: 96 },
          { id: "food-12", name: "Cenoura cozida", quantity: "120g", calories: 48 },
          { id: "food-13", name: "Azeite", quantity: "0.5 colher", calories: 50 }
        ]
      }
    ]
  },
  "4": {
    patientId: "4",
    patientName: "Ana Costa",
    title: "Plano de Ganho Muscular",
    updatedAt: "2026-05-08T14:00:00.000Z",
    observations: "Aumentar calorias com foco em proteína. Fazer 5 refeições por dia.",
    dailyCaloriesGoal: 2500,
    dailyProteinGoal: 150,
    dailyCarbsGoal: 300,
    dailyFatsGoal: 83,
    meals: [
      {
        id: "meal-1",
        name: "Café da manhã",
        time: "07:00",
        calories: 550,
        proteinGrams: 35,
        carbsGrams: 60,
        fatsGrams: 18,
        foods: [
          { id: "food-1", name: "Whey protein", quantity: "40g", calories: 160 },
          { id: "food-2", name: "Aveia", quantity: "60g", calories: 228 },
          { id: "food-3", name: "Banana", quantity: "1 unidade", calories: 105 },
          { id: "food-4", name: "Mel", quantity: "1 colher", calories: 64 }
        ]
      },
      {
        id: "meal-2",
        name: "Lanche 1",
        time: "10:00",
        calories: 320,
        proteinGrams: 30,
        carbsGrams: 25,
        fatsGrams: 8,
        foods: [
          { id: "food-5", name: "Iogurte grego", quantity: "200g", calories: 220 },
          { id: "food-6", name: "Granola", quantity: "40g", calories: 100 }
        ]
      },
      {
        id: "meal-3",
        name: "Almoço",
        time: "12:30",
        calories: 700,
        proteinGrams: 50,
        carbsGrams: 80,
        fatsGrams: 22,
        foods: [
          { id: "food-7", name: "Carne vermelha", quantity: "200g", calories: 380 },
          { id: "food-8", name: "Batata doce", quantity: "150g", calories: 135 },
          { id: "food-9", name: "Abóbora", quantity: "100g", calories: 40 },
          { id: "food-10", name: "Azeite", quantity: "1 colher", calories: 95 }
        ]
      },
      {
        id: "meal-4",
        name: "Lanche 2",
        time: "16:00",
        calories: 280,
        proteinGrams: 25,
        carbsGrams: 30,
        fatsGrams: 8,
        foods: [
          { id: "food-11", name: "Castanha de caju", quantity: "50g", calories: 280 }
        ]
      },
      {
        id: "meal-5",
        name: "Jantar",
        time: "19:30",
        calories: 650,
        proteinGrams: 45,
        carbsGrams: 70,
        fatsGrams: 20,
        foods: [
          { id: "food-12", name: "Salmão grelhado", quantity: "180g", calories: 320 },
          { id: "food-13", name: "Arroz integral", quantity: "100g", calories: 120 },
          { id: "food-14", name: "Espinafre", quantity: "150g", calories: 40 },
          { id: "food-15", name: "Azeite", quantity: "1 colher", calories: 95 }
        ]
      }
    ]
  }
};

export const savePatientPlanToStorage = (plan: PatientNutritionPlan) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(plan.patientId), JSON.stringify(plan));
};

export const loadPatientPlanFromStorage = (patientId: string): PatientNutritionPlan | null => {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(storageKey(patientId));
  if (!raw) {
    // Return mock plan if no stored plan exists
    return mockPlans[patientId] || null;
  }

  try {
    return JSON.parse(raw) as PatientNutritionPlan;
  } catch {
    return mockPlans[patientId] || null;
  }
};
