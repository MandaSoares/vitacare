import React, { useState } from "react";
import { NutritionPlan, Meal, FoodItem, samplePlan } from "@/lib/planData";
import { mockPatients } from "@/lib/patients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Edit, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const PlanCreator: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [plan, setPlan] = useState<NutritionPlan>(samplePlan);
  const [mealName, setMealName] = useState("");
  const [mealTime, setMealTime] = useState("");
  const [foodInputs, setFoodInputs] = useState<Record<number, { name: string; qty: string }>>({});
  const [editingMealIdx, setEditingMealIdx] = useState<number | null>(null);
  const [editMealName, setEditMealName] = useState("");
  const [editMealTime, setEditMealTime] = useState("");

  const selectedPatient = mockPatients.find((p) => p.id === selectedPatientId);

  const getFoodInput = (mealIdx: number) => foodInputs[mealIdx] || { name: "", qty: "" };
  const setFoodInput = (mealIdx: number, name: string, qty: string) => {
    setFoodInputs({ ...foodInputs, [mealIdx]: { name, qty } });
  };

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
    const input = getFoodInput(mealIdx);
    if (!input.name.trim()) {
      toast.error("Digite o nome do alimento");
      return;
    }
    const updatedMeals = [...plan.meals];
    updatedMeals[mealIdx].items.push({
      id: `food-${Date.now()}`,
      name: input.name,
      quantity: input.qty || "—",
    });
    setPlan({ ...plan, meals: updatedMeals });
    setFoodInputs({ ...foodInputs, [mealIdx]: { name: "", qty: "" } });
    toast.success("Alimento adicionado");
  };

  const startEditMeal = (mealIdx: number) => {
    setEditingMealIdx(mealIdx);
    setEditMealName(plan.meals[mealIdx].name);
    setEditMealTime(plan.meals[mealIdx].time);
  };

  const [mealToDeleteIdx, setMealToDeleteIdx] = useState<number | null>(null);

  const confirmRemoveMeal = () => {
    if (mealToDeleteIdx === null) return;
    setPlan({
      ...plan,
      meals: plan.meals.filter((_, idx) => idx !== mealToDeleteIdx),
    });
    setMealToDeleteIdx(null);
    toast.success("Refeição removida");
  };

  const cancelRemoveMeal = () => {
    setMealToDeleteIdx(null);
  };

  const moveFood = (mealIdx: number, from: number, to: number) => {
    const meals = [...plan.meals];
    if (!meals[mealIdx]) return;
    const items = [...meals[mealIdx].items];
    if (from < 0 || to < 0 || from >= items.length || to >= items.length) return;
    const [moved] = items.splice(from, 1);
    items.splice(to, 0, moved);
    meals[mealIdx].items = items;
    setPlan({ ...plan, meals });
  };

  const saveEditMeal = (mealIdx: number) => {
    if (!editMealName.trim()) {
      toast.error("Digite o nome da refeição");
      return;
    }
    const updatedMeals = [...plan.meals];
    updatedMeals[mealIdx].name = editMealName;
    updatedMeals[mealIdx].time = editMealTime || "--:--";
    setPlan({ ...plan, meals: updatedMeals });
    setEditingMealIdx(null);
    toast.success("Refeição atualizada");
  };

  const cancelEditMeal = () => {
    setEditingMealIdx(null);
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
                    {editingMealIdx === mealIdx ? (
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Nome da refeição"
                          value={editMealName}
                          onChange={(e) => setEditMealName(e.target.value)}
                        />
                        <Input
                          placeholder="Horário"
                          type="time"
                          value={editMealTime}
                          onChange={(e) => setEditMealTime(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => saveEditMeal(mealIdx)}
                          >
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEditMeal}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-semibold">{meal.name}</h3>
                        <p className="text-sm text-slate-500">{meal.time}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      {editingMealIdx !== mealIdx && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditMeal(mealIdx)}
                          title="Editar refeição"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {editingMealIdx !== mealIdx && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMealToDeleteIdx(mealIdx)}
                          title="Remover refeição"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
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
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveFood(mealIdx, foodIdx, foodIdx - 1)}
                                disabled={foodIdx === 0}
                                title="Mover para cima"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveFood(mealIdx, foodIdx, foodIdx + 1)}
                                disabled={foodIdx === meal.items.length - 1}
                                title="Mover para baixo"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <button
                                onClick={() => removeFoodFromMeal(mealIdx, foodIdx)}
                                className="text-red-500 hover:text-red-700"
                                title="Remover alimento"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {meal.items.length === 0 && (
                      <p className="text-sm text-slate-400 italic">Nenhum alimento adicionado</p>
                    )}

                    {editingMealIdx !== mealIdx && (
                    <div className="grid gap-3 md:grid-cols-3">
                      <Input
                        placeholder="Alimento (ex: Arroz)"
                        value={getFoodInput(mealIdx).name}
                        onChange={(e) => setFoodInput(mealIdx, e.target.value, getFoodInput(mealIdx).qty)}
                      />
                      <Input
                        placeholder="Quantidade (ex: 100g)"
                        value={getFoodInput(mealIdx).qty}
                        onChange={(e) => setFoodInput(mealIdx, getFoodInput(mealIdx).name, e.target.value)}
                      />
                      <Button onClick={() => addFoodToMeal(mealIdx)}>
                        <Plus className="mr-1 h-4 w-4" />
                        Adicionar
                      </Button>
                    </div>
                    )}
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

        <AlertDialog open={mealToDeleteIdx !== null} onOpenChange={(open) => { if (!open) setMealToDeleteIdx(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza que deseja excluir esta refeição?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação removerá a refeição e todos os alimentos adicionados a ela. Esta operação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="mt-4 flex items-center justify-end gap-2">
              <AlertDialogCancel onClick={cancelRemoveMeal}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmRemoveMeal}>Excluir</AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

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
