import React, { useState } from "react";
import { NutritionPlan, Meal, FoodItem, samplePlan } from "@/lib/planData";
import { mockPatients } from "@/lib/patients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PlanCreator: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [plan, setPlan] = useState<NutritionPlan>(samplePlan);
  const [mealName, setMealName] = useState("");
  const [mealTime, setMealTime] = useState("");
  const [foodName, setFoodName] = useState("");
  const [foodQty, setFoodQty] = useState("");
  const [currentMealIdx, setCurrentMealIdx] = useState<number | null>(null);

  const selectedPatient = mockPatients.find((p) => p.id === selectedPatientId);

  const addMeal = () => {
    if (!mealName.trim()) {
      toast.error("Digite o nome da refeição");
      return;
    }
    const newMeal: Meal = {
      id: `meal-${Date.now()}`,
      name: mealName,
      time: mealTime || "--:--",
      items: [],
    };
    setPlan({ ...plan, meals: [...plan.meals, newMeal] });
    setMealName("");
    setMealTime("");
    toast.success("Refeição adicionada");
  };

  const addFoodToMeal = (mealIdx: number) => {
    if (!foodName.trim()) {
      toast.error("Digite o nome do alimento");
      return;
    }
    const updatedMeals = [...plan.meals];
    updatedMeals[mealIdx].items.push({
      id: `food-${Date.now()}`,
      name: foodName,
      quantity: foodQty || "—",
    });
    setPlan({ ...plan, meals: updatedMeals });
    setFoodName("");
    setFoodQty("");
    toast.success("Alimento adicionado");
  };

  const removeFoodFromMeal = (mealIdx: number, foodIdx: number) => {
    const updatedMeals = [...plan.meals];
    updatedMeals[mealIdx].items.splice(foodIdx, 1);
    setPlan({ ...plan, meals: updatedMeals });
    toast.success("Alimento removido");
  };

  const removeMeal = (mealIdx: number) => {
    setPlan({
      ...plan,
      meals: plan.meals.filter((_, idx) => idx !== mealIdx),
    });
    setCurrentMealIdx(null);
    toast.success("Refeição removida");
  };

  const saveDraft = () => {
    if (!selectedPatientId) {
      toast.error("Selecione um paciente");
      return;
    }
    toast.success("Plano salvo como rascunho");
  };

  const activatePlan = () => {
    if (!selectedPatientId) {
      toast.error("Selecione um paciente");
      return;
    }
    if (plan.meals.length === 0) {
      toast.error("Adicione pelo menos uma refeição");
      return;
    }
    setPlan({ ...plan, active: true });
    toast.success("Plano ativado com sucesso");
    setTimeout(() => navigate("/patients"), 1000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Criar plano nutricional</h1>
          <p className="text-slate-600">Preencha os dados e adicione as refeições</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Informações do plano</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Paciente *</label>
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione um paciente" />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.cpf})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPatient && (
              <div className="rounded-md bg-blue-50 p-3 border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Paciente selecionado:</strong> {selectedPatient.name}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-700">Título do plano</label>
              <Input
                className="mt-1"
                placeholder="Ex: Plano de ganho de massa"
                value={plan.title}
                onChange={(e) => setPlan({ ...plan, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Observações (opcional)</label>
              <Textarea className="mt-1" placeholder="Ex: Aumentar ingestão de proteína..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Refeições</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">Nome da refeição</label>
                <Input
                  className="mt-1"
                  placeholder="Ex: Café da manhã"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Horário</label>
                <Input
                  className="mt-1"
                  placeholder="08:00"
                  type="time"
                  value={mealTime}
                  onChange={(e) => setMealTime(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={addMeal} className="w-full" size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar refeição
            </Button>
          </CardContent>
        </Card>

        {plan.meals.length > 0 && (
          <div className="space-y-4">
            {plan.meals.map((meal, mealIdx) => (
              <Card key={meal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{meal.name}</h3>
                      <p className="text-sm text-slate-500">{meal.time}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMeal(mealIdx)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {meal.items.length > 0 && (
                      <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                        {meal.items.map((item, foodIdx) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-slate-500">{item.quantity}</div>
                            </div>
                            <button
                              onClick={() => removeFoodFromMeal(mealIdx, foodIdx)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {meal.items.length === 0 && (
                      <p className="text-sm text-slate-400 italic">Nenhum alimento adicionado</p>
                    )}

                    <div className="grid gap-3 md:grid-cols-3">
                      <Input
                        placeholder="Alimento (ex: Arroz)"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                      />
                      <Input
                        placeholder="Quantidade (ex: 100g)"
                        value={foodQty}
                        onChange={(e) => setFoodQty(e.target.value)}
                      />
                      <Button onClick={() => addFoodToMeal(mealIdx)}>
                        <Plus className="mr-1 h-4 w-4" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {plan.meals.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500">Adicione refeições ao plano acima</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={saveDraft}
            className="flex-1"
            size="lg"
          >
            Salvar rascunho
          </Button>
          <Button
            onClick={activatePlan}
            className="flex-1"
            size="lg"
          >
            Ativar plano
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanCreator;
