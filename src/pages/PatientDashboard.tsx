import React from "react";
import { sampleMeals, sampleProgress } from "@/lib/patientDashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const MacroRow = ({ label, value, goal }: { label: string; value: number; goal: number }) => {
  const percent = Math.min(100, Math.round((value / goal) * 100));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-slate-600">
        <span>{label}</span>
        <span className="font-medium">{value}/{goal}g</span>
      </div>
      <Progress value={percent} />
    </div>
  );
};

const PatientDashboard: React.FC = () => {
  const meals = sampleMeals;
  const p = sampleProgress;
  const caloriePercent = Math.min(100, Math.round((p.todayCalories / p.calorieGoal) * 100));

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Dashboard do paciente</h1>
          <p className="text-slate-600">Resumo do plano, progresso e próximas refeições</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Progresso de calorias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Consumidas hoje</p>
                  <p className="text-2xl font-semibold">{p.todayCalories} kcal</p>
                  <p className="text-sm text-slate-500">Meta: {p.calorieGoal} kcal</p>
                </div>
                <div className="w-36">
                  <Progress value={caloriePercent} />
                </div>
              </div>

              <Separator className="my-4" />

              <MacroRow label="Proteína" value={p.proteinGrams} goal={p.proteinGoal} />
              <MacroRow label="Carboidratos" value={p.carbsGrams} goal={p.carbsGoal} />
              <MacroRow label="Gorduras" value={p.fatsGrams} goal={p.fatsGoal} />
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Próximas refeições</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {meals.map((m) => (
                    <div key={m.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-md bg-slate-100 p-2">
                          <Clock className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <div className="font-medium">{m.name}</div>
                          <div className="text-sm text-slate-500">{m.time} • {m.calories} kcal</div>
                        </div>
                      </div>
                      <div>
                        <Button variant="ghost" size="sm">Ver receita</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to="/patients"><Button variant="secondary">Voltar para pacientes</Button></Link>
                  <Button>Registrar refeição</Button>
                  <Button variant="outline">Ver plano nutricional</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
