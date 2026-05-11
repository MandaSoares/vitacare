export type PlanFood = {
  id: string;
  name: string;
  quantity: string;
  calories: number;
};

export type PlanMeal = {
  id: string;
  name: string;
  time: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  foods: PlanFood[];
};

export type PatientNutritionPlan = {
  patientId: string;
  patientName: string;
  title: string;
  updatedAt: string;
  observations: string;
  dailyCaloriesGoal: number;
  dailyProteinGoal: number;
  dailyCarbsGoal: number;
  dailyFatsGoal: number;
  meals: PlanMeal[];
};

export const samplePatientNutritionPlan: PatientNutritionPlan = {
  patientId: "1",
  patientName: "Ana Silva Santos",
  title: "Plano alimentar personalizado",
  updatedAt: "2026-05-10T09:00:00.000Z",
  observations:
    "Aumentar ingestão de proteínas no café da manhã e manter hidratação ao longo do dia.",
  dailyCaloriesGoal: 2000,
  dailyProteinGoal: 110,
  dailyCarbsGoal: 240,
  dailyFatsGoal: 70,
  meals: [
    {
      id: "meal-1",
      name: "Café da manhã",
      time: "08:00",
      calories: 420,
      proteinGrams: 22,
      carbsGrams: 48,
      fatsGrams: 12,
      foods: [
        { id: "food-1", name: "Aveia", quantity: "50g", calories: 190 },
        { id: "food-2", name: "Banana", quantity: "1 unidade", calories: 90 },
        { id: "food-3", name: "Iogurte natural", quantity: "170g", calories: 140 },
      ],
    },
    {
      id: "meal-2",
      name: "Almoço",
      time: "12:30",
      calories: 650,
      proteinGrams: 38,
      carbsGrams: 68,
      fatsGrams: 20,
      foods: [
        { id: "food-4", name: "Frango grelhado", quantity: "150g", calories: 250 },
        { id: "food-5", name: "Arroz integral", quantity: "120g", calories: 145 },
        { id: "food-6", name: "Feijão", quantity: "100g", calories: 105 },
        { id: "food-7", name: "Salada verde", quantity: "1 prato", calories: 55 },
        { id: "food-8", name: "Azeite de oliva", quantity: "1 colher", calories: 95 },
      ],
    },
    {
      id: "meal-3",
      name: "Lanche da tarde",
      time: "16:00",
      calories: 220,
      proteinGrams: 12,
      carbsGrams: 18,
      fatsGrams: 10,
      foods: [
        { id: "food-9", name: "Iogurte proteico", quantity: "1 unidade", calories: 120 },
        { id: "food-10", name: "Castanhas", quantity: "20g", calories: 100 },
      ],
    },
    {
      id: "meal-4",
      name: "Jantar",
      time: "20:00",
      calories: 480,
      proteinGrams: 30,
      carbsGrams: 38,
      fatsGrams: 18,
      foods: [
        { id: "food-11", name: "Peixe grelhado", quantity: "140g", calories: 210 },
        { id: "food-12", name: "Batata-doce", quantity: "100g", calories: 120 },
        { id: "food-13", name: "Legumes cozidos", quantity: "1 porção", calories: 150 },
      ],
    },
  ],
};
