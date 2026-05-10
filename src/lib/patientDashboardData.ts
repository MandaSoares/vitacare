export type Meal = {
  id: string;
  time: string; // e.g. "08:00"
  name: string;
  calories: number;
};

export type NutritionProgress = {
  todayCalories: number;
  calorieGoal: number;
  proteinGrams: number;
  proteinGoal: number;
  carbsGrams: number;
  carbsGoal: number;
  fatsGrams: number;
  fatsGoal: number;
};

export const sampleMeals: Meal[] = [
  { id: "m1", time: "08:00", name: "Café da manhã - Aveia e frutas", calories: 420 },
  { id: "m2", time: "12:30", name: "Almoço - Frango grelhado e arroz", calories: 650 },
  { id: "m3", time: "16:00", name: "Lanche - Iogurte e castanhas", calories: 220 },
  { id: "m4", time: "20:00", name: "Jantar - Salada e peixe", calories: 480 },
];

export const sampleProgress: NutritionProgress = {
  todayCalories: 1290,
  calorieGoal: 2000,
  proteinGrams: 78,
  proteinGoal: 100,
  carbsGrams: 160,
  carbsGoal: 250,
  fatsGrams: 50,
  fatsGoal: 70,
};
