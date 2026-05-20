import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock3, Flame, Leaf, Beef, Wheat } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { NutritionistSidebar } from "@/components/layout/NutritionistSidebar";
import { mockPatients } from "@/lib/patients";
import { calculateNutritionSummary, samplePatientNutritionPlan, PatientNutritionPlan as PlanType } from "@/lib/patientPlanData";
import { loadPatientPlanFromStorage, savePatientPlanToStorage } from "@/lib/patientPlanStorage";

const PatientNutritionPlan = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const patient = mockPatients.find((entry) => entry.id === patientId);

  const [plan, setPlan] = useState<PlanType | null>(() => {
    if (!patientId) return null;
    try {
      return loadPatientPlanFromStorage(patientId);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!patient || !patientId) return;

    // If no plan found, create a mock plan for this patient and save it
    if (!plan) {
      const newPlan: PlanType = {
        ...samplePatientNutritionPlan,
        patientId,
        patientName: patient.name,
        updatedAt: new Date().toISOString(),
      };
      try {
        savePatientPlanToStorage(newPlan);
        setPlan(newPlan);
      } catch {
        // ignore failures in non-browser env
        setPlan(newPlan);
      }
    }
  }, [patientId, patient, plan]);

  const summary = plan ? calculateNutritionSummary(plan) : null;

  if (!patient || !plan) {
    return (
      <div className="min-h-screen bg-[#f3f5f4] text-slate-900">
        <div className="grid min-h-screen lg:grid-cols-[224px_minmax(0,1fr)]">
          <NutritionistSidebar />
          <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
            <div className="w-full space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plano nutricional não encontrado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Não encontramos um plano detalhado para o paciente solicitado.
              </p>
              <Button onClick={() => navigate(`/patients/${patientId}`)}>
                Voltar para o perfil
              </Button>
            </CardContent>
          </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f5f4] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[224px_minmax(0,1fr)]">
        <NutritionistSidebar />
        <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
          <div className="w-full space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            to={`/patients/${patientId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o perfil
          </Link>
          <Badge variant="secondary" className="gap-2">
            <CalendarDays className="h-3.5 w-3.5" />
            Atualizado em {new Date(plan.updatedAt).toLocaleDateString("pt-BR")}
          </Badge>
        </div>

        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-muted-foreground">Plano nutricional</p>
                <CardTitle className="mt-2 text-2xl">{plan.title}</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  {patient.name} · CPF {patient.cpf}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border p-3 text-center">
                  <Flame className="mx-auto h-5 w-5 text-orange-500" />
                  <p className="mt-2 text-lg font-semibold">{summary?.totalCalories ?? 0}</p>
                  <p className="text-xs text-muted-foreground">kcal no dia</p>
                </div>
                <div className="rounded-2xl border p-3 text-center">
                  <Beef className="mx-auto h-5 w-5 text-red-500" />
                  <p className="mt-2 text-lg font-semibold">{summary?.totalProtein ?? 0}g</p>
                  <p className="text-xs text-muted-foreground">proteína</p>
                </div>
                <div className="rounded-2xl border p-3 text-center">
                  <Wheat className="mx-auto h-5 w-5 text-amber-500" />
                  <p className="mt-2 text-lg font-semibold">{summary?.totalCarbs ?? 0}g</p>
                  <p className="text-xs text-muted-foreground">carboidratos</p>
                </div>
                <div className="rounded-2xl border p-3 text-center">
                  <Leaf className="mx-auto h-5 w-5 text-green-600" />
                  <p className="mt-2 text-lg font-semibold">{summary?.totalFats ?? 0}g</p>
                  <p className="text-xs text-muted-foreground">gorduras</p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <section className="rounded-2xl border bg-muted/30 p-4">
              <p className="text-sm font-semibold">Orientações do nutricionista</p>
              <p className="mt-2 text-sm text-muted-foreground">{plan.observations}</p>
            </section>

            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Meta diária</p>
                <p className="mt-2 text-lg font-semibold">{plan.dailyCaloriesGoal} kcal</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Proteína alvo</p>
                <p className="mt-2 text-lg font-semibold">{plan.dailyProteinGoal} g</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Carboidratos / Gorduras</p>
                <p className="mt-2 text-lg font-semibold">
                  {plan.dailyCarbsGoal} g · {plan.dailyFatsGoal} g
                </p>
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Refeições do plano</h2>
                <p className="text-sm text-muted-foreground">
                  Horários, alimentos e informações nutricionais por refeição.
                </p>
              </div>

              <div className="grid gap-4">
                {plan.meals.map((meal) => (
                  <Card key={meal.id} className="overflow-hidden">
                    <CardHeader className="border-b bg-muted/20">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <CardTitle className="text-xl">{meal.name}</CardTitle>
                          <p className="mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock3 className="h-4 w-4" />
                            {meal.time}
                          </p>
                        </div>
                        <Badge variant="outline">{meal.calories} kcal</Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-4 sm:p-6">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border p-3">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Calorias</p>
                          <p className="mt-1 text-lg font-semibold">{meal.calories} kcal</p>
                        </div>
                        <div className="rounded-2xl border p-3">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Proteína</p>
                          <p className="mt-1 text-lg font-semibold">{meal.proteinGrams} g</p>
                        </div>
                        <div className="rounded-2xl border p-3">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Carbs / Gorduras</p>
                          <p className="mt-1 text-lg font-semibold">{meal.carbsGrams} g · {meal.fatsGrams} g</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-semibold">Alimentos e quantidades</p>
                        <div className="overflow-hidden rounded-2xl border">
                          <div className="grid grid-cols-12 bg-muted/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            <div className="col-span-6 sm:col-span-7">Alimento</div>
                            <div className="col-span-3 sm:col-span-2">Quantidade</div>
                            <div className="col-span-3 sm:col-span-3 text-right">Kcal</div>
                          </div>
                          <div className="divide-y">
                            {meal.foods.map((food) => (
                              <div key={food.id} className="grid grid-cols-12 px-4 py-3 text-sm">
                                <div className="col-span-6 sm:col-span-7 font-medium">{food.name}</div>
                                <div className="col-span-3 sm:col-span-2 text-muted-foreground">{food.quantity}</div>
                                <div className="col-span-3 sm:col-span-3 text-right text-muted-foreground">{food.calories}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate(`/patients/${patientId}`)} variant="outline">
            Voltar para o perfil
          </Button>
          <Button disabled>Abrir dashboard</Button>
        </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientNutritionPlan;
