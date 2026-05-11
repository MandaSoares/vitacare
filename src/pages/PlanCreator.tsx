import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { NutritionPlan, Meal, FoodItem, samplePlan } from "@/lib/planData";
import { mockPatients } from "@/lib/patients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Edit, GripVertical } from "lucide-react";
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
import { savePatientPlanToStorage } from "@/lib/patientPlanStorage";

const createEmptyPlan = (patientId: string): NutritionPlan => ({
  id: `plan-${patientId}`,
  patientId,
  title: "",
  meals: [],
  active: false,
});

const PlanCreator: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [plansByPatient, setPlansByPatient] = useState<Record<string, NutritionPlan>>({
    [samplePlan.patientId]: samplePlan,
  });
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
    if (!selectedPatientId) {
      toast.error("Selecione um paciente");
      return;
    }
    const newMeal: Meal = {
      id: `meal-${Date.now()}`,
      name: mealName,
      time: mealTime || "--:--",
      items: [],
    };
    updateCurrentPlan((plan) => ({ ...plan, meals: [...plan.meals, newMeal] }));
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
    updateCurrentPlan((plan) => {
      const updatedMeals = [...plan.meals];
      updatedMeals[mealIdx].items.push({
        id: `food-${Date.now()}`,
        name: input.name,
        quantity: input.qty || "—",
      });
      return { ...plan, meals: updatedMeals };
    });
    setFoodInputs({ ...foodInputs, [mealIdx]: { name: "", qty: "" } });
    toast.success("Alimento adicionado");
  };

  const startEditMeal = (mealIdx: number) => {
    setEditingMealIdx(mealIdx);
    if (!currentPlan) return;
    setEditMealName(currentPlan.meals[mealIdx].name);
    setEditMealTime(currentPlan.meals[mealIdx].time);
  };

  const [mealToDeleteIdx, setMealToDeleteIdx] = useState<number | null>(null);

  const confirmRemoveMeal = () => {
    if (mealToDeleteIdx === null) return;
    updateCurrentPlan((plan) => ({
      ...plan,
      meals: plan.meals.filter((_, idx) => idx !== mealToDeleteIdx),
    }));
    setMealToDeleteIdx(null);
    toast.success("Refeição removida");
  };

  const cancelRemoveMeal = () => {
    setMealToDeleteIdx(null);
  };

  const moveFood = (mealIdx: number, from: number, to: number) => {
    updateCurrentPlan((plan) => {
      const meals = [...plan.meals];
      if (!meals[mealIdx]) return plan;
      const items = [...meals[mealIdx].items];
      if (from < 0 || to < 0 || from >= items.length || to >= items.length) return plan;
      const [moved] = items.splice(from, 1);
      items.splice(to, 0, moved);
      meals[mealIdx].items = items;
      return { ...plan, meals };
    });
  };
  
  const [dragInfo, setDragInfo] = useState<{ mealIdx: number; from: number } | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<{ mealIdx: number; idx: number } | null>(null);

  const currentPlan = selectedPatientId
    ? plansByPatient[selectedPatientId] ?? createEmptyPlan(selectedPatientId)
    : null;

  const updateCurrentPlan = (updater: (plan: NutritionPlan) => NutritionPlan) => {
    if (!selectedPatientId) return;
    setPlansByPatient((previous) => {
      const patientPlan = previous[selectedPatientId] ?? createEmptyPlan(selectedPatientId);
      return {
        ...previous,
        [selectedPatientId]: updater(patientPlan),
      };
    });
  };

  const handlePatientChange = (patientId: string) => {
    setSelectedPatientId(patientId);
    setEditingMealIdx(null);
    setMealToDeleteIdx(null);
    setDragInfo(null);
    setDragOverIdx(null);
    setFoodInputs({});
    setMealName("");
    setMealTime("");
    setEditMealName("");
    setEditMealTime("");
  };

  const handleDragStart = (e: React.DragEvent, mealIdx: number, idx: number) => {
    setDragInfo({ mealIdx, from: idx });
    setDragOverIdx({ mealIdx, idx });
    try {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", "drag");
    } catch (e) {
      // some browsers may throw when setting data
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, mealIdx: number, toIdx: number) => {
    e.preventDefault();
    if (!dragInfo) return;
    if (dragInfo.mealIdx !== mealIdx) return;
    setDragInfo(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDragInfo(null);
    setDragOverIdx(null);
  };

  const handleDragEnterItem = (mealIdx: number, toIdx: number) => {
    if (!dragInfo) return;
    if (dragInfo.mealIdx !== mealIdx) return;
    if (dragInfo.from === toIdx) return;

    moveFood(mealIdx, dragInfo.from, toIdx);
    setDragInfo({ mealIdx, from: toIdx });
    setDragOverIdx({ mealIdx, idx: toIdx });
  };

  const saveEditMeal = (mealIdx: number) => {
    if (!editMealName.trim()) {
      toast.error("Digite o nome da refeição");
      return;
    }
    updateCurrentPlan((plan) => {
      const updatedMeals = [...plan.meals];
      updatedMeals[mealIdx].name = editMealName;
      updatedMeals[mealIdx].time = editMealTime || "--:--";
      return { ...plan, meals: updatedMeals };
    });
    setEditingMealIdx(null);
    toast.success("Refeição atualizada");
  };

  const cancelEditMeal = () => {
    setEditingMealIdx(null);
  };

  const removeFoodFromMeal = (mealIdx: number, foodIdx: number) => {
    updateCurrentPlan((plan) => {
      const updatedMeals = [...plan.meals];
      updatedMeals[mealIdx].items.splice(foodIdx, 1);
      return { ...plan, meals: updatedMeals };
    });
    toast.success("Alimento removido");
  };

  const removeMeal = (mealIdx: number) => {
    updateCurrentPlan((plan) => ({
      ...plan,
      meals: plan.meals.filter((_, idx) => idx !== mealIdx),
    }));
    toast.success("Refeição removida");
  };

  const saveDraft = () => {
    if (!selectedPatientId) {
      toast.error("Selecione um paciente");
      return;
    }
    if (!currentPlan) return;
    savePatientPlanToStorage(currentPlan);
    toast.success("Plano salvo como rascunho");
  };

  const activatePlan = () => {
    if (!selectedPatientId) {
      toast.error("Selecione um paciente");
      return;
    }
    if (!currentPlan || currentPlan.meals.length === 0) {
      toast.error("Adicione pelo menos uma refeição");
      return;
    }
    const activePlan = { ...currentPlan, active: true };
    updateCurrentPlan(() => activePlan);
    savePatientPlanToStorage(activePlan);
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
              <Select value={selectedPatientId} onValueChange={handlePatientChange}>
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
                value={currentPlan?.title ?? ""}
                onChange={(e) => {
                  if (!selectedPatientId) return;
                  updateCurrentPlan((plan) => ({ ...plan, title: e.target.value }));
                }}
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

        {currentPlan?.meals.length > 0 && (
          <div className="space-y-4">
            {currentPlan?.meals.map((meal, mealIdx) => (
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
                            className={cn(
                              "flex items-center justify-between text-sm rounded-md px-2 py-2 transition-all duration-200",
                              dragInfo && dragInfo.mealIdx === mealIdx && dragInfo.from === foodIdx
                                ? "bg-sky-100 ring-2 ring-sky-400 shadow-md scale-[1.01] opacity-75"
                                : "",
                              dragInfo && dragOverIdx && dragInfo.mealIdx === mealIdx
                                ? dragInfo.from < dragOverIdx.idx && foodIdx > dragInfo.from && foodIdx <= dragOverIdx.idx
                                  ? "translate-y-1.5"
                                  : dragInfo.from > dragOverIdx.idx && foodIdx >= dragOverIdx.idx && foodIdx < dragInfo.from
                                    ? "-translate-y-1.5"
                                    : ""
                                : ""
                            )}
                            onDragEnter={() => {
                              handleDragEnterItem(mealIdx, foodIdx);
                              setDragOverIdx({ mealIdx, idx: foodIdx });
                            }}
                            onDragOver={(e) => {
                              handleDragOver(e);
                              setDragOverIdx({ mealIdx, idx: foodIdx });
                            }}
                          >
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-slate-500">{item.quantity}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                draggable
                                onDragStart={(e) => handleDragStart(e, mealIdx, foodIdx)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, mealIdx, foodIdx)}
                                onDragEnd={handleDragEnd}
                                className="cursor-grab"
                                title="Arrastar para reordenar"
                              >
                                <GripVertical className="h-4 w-4 text-slate-400" />
                              </div>
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

        {currentPlan?.meals.length === 0 && (
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
