export type FoodItem = {
  id: string;
  name: string;
  quantity: string; // e.g. "100g"
};

export type Meal = {
  id: string;
  name: string;
  time: string; // e.g. "12:30"
  items: FoodItem[];
};

export type NutritionPlan = {
  id: string;
  patientId: string;
  title: string;
  meals: Meal[];
  active: boolean;
};

export const samplePlan: NutritionPlan = {
  id: "plan-1",
  patientId: "1",
  title: "Plano inicial - manutenção",
  active: false,
  meals: [
    {
      id: "m1",
      name: "Café da manhã",
      time: "08:00",
      items: [
        { id: "f1", name: "Aveia (50g)", quantity: "50g" },
        { id: "f2", name: "Banana (1 unidade)", quantity: "1 un" },
      ],
    },
  ],
};
