import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { NutritionPlan, Meal, FoodItem, samplePlan } from "@/lib/planData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

const PlanCreator: React.FC = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<NutritionPlan>(samplePlan);
  const [mealName, setMealName] = useState("");
  const [mealTime, setMealTime] = useState("");
  const [foodName, setFoodName] = useState("");
  const [foodQty, setFoodQty] = useState("");

  const addMeal = () => {
    if (!mealName) return;
    const newMeal: Meal = { id: uuidv4(), name: mealName, time: mealTime || "--:--", items: [] };
    setPlan({ ...plan, meals: [...plan.meals, newMeal] });
    setMealName("");
    setMealTime("");
  };

  const addFoodToMeal = (mealId: string) => {
    if (!foodName) return;
    setPlan({
      ...plan,
      meals: plan.meals.map((m) =>
        m.id === mealId ? { ...m, items: [...m.items, { id: uuidv4(), name: foodName, quantity: foodQty || "" }] } : m
      ),
    });
    setFoodName("");
    setFoodQty("");
  };

  const saveDraft = () => {
    // Placeholder: persist to API later
    alert("Rascunho salvo (simulado)");
  };

  const activatePlan = () => {
    // Placeholder: call API and activate
    setPlan({ ...plan, active: true });
    alert("Plano ativado (simulado)");
    navigate("/patients");
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Criar plano nutricional</h1>
          <p className="text-slate-600">Selecione paciente, adicione refeições e alimentos</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Dados do plano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Input placeholder="Título do plano" value={plan.title} onChange={(e) => setPlan({ ...plan, title: e.target.value })} />
              {/* TODO: paciente selector */}
              <Textarea placeholder="Observações (opcional)" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adicionar refeição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input placeholder="Nome da refeição" value={mealName} onChange={(e) => setMealName(e.target.value)} />
              <Input placeholder="Horário (HH:MM)" value={mealTime} onChange={(e) => setMealTime(e.target.value)} />
              <Button onClick={addMeal}>Adicionar refeição</Button>
            </div>
          </CardContent>
        </Card>

        {plan.meals.map((meal) => (
          <Card key={meal.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{meal.name}</h3>
                  <p className="text-sm text-slate-500">{meal.time}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {meal.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-slate-500">{it.quantity}</div>
                    </div>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Input placeholder="Alimento (ex: Arroz)" value={foodName} onChange={(e) => setFoodName(e.target.value)} />
                  <Input placeholder="Quantidade (ex: 100g)" value={foodQty} onChange={(e) => setFoodQty(e.target.value)} />
                  <Button onClick={() => addFoodToMeal(meal.id)}>Adicionar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex gap-3">
          <Button onClick={saveDraft}>Salvar rascunho</Button>
          <Button variant="secondary" onClick={activatePlan}>Ativar plano</Button>
        </div>
      </div>
    </div>
  );
};

export default PlanCreator;
