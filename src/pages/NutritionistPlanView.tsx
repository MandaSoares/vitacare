import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ChefHat, ClipboardList, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const patients = [
  {
    id: "1",
    name: "João Silva",
    planStatus: "active",
    updatedAt: "Hoje, 08:20",
    summary: { kcal: 2280, protein: 148, carbs: 261, fats: 71 },
    meals: 5,
    goal: "Emagrecimento",
  },
  {
    id: "2",
    name: "Maria Santos",
    planStatus: "active",
    updatedAt: "Ontem, 16:45",
    summary: { kcal: 1940, protein: 132, carbs: 208, fats: 62 },
    meals: 4,
    goal: "Controle glicêmico",
  },
  {
    id: "3",
    name: "Carlos Oliveira",
    planStatus: "pending",
    updatedAt: "Sem plano salvo",
    summary: { kcal: 0, protein: 0, carbs: 0, fats: 0 },
    meals: 0,
    goal: "Avaliação inicial",
  },
  {
    id: "4",
    name: "Ana Costa",
    planStatus: "active",
    updatedAt: "08/05, 11:10",
    summary: { kcal: 2105, protein: 126, carbs: 236, fats: 68 },
    meals: 5,
    goal: "Primeira consulta",
  },
] as const;

const NutritionistPlanView: React.FC = () => {
  const [query, setQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("1");

  const filteredPatients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return patients.filter((patient) => patient.name.toLowerCase().includes(normalizedQuery));
  }, [query]);

  const selectedPatient = filteredPatients.find((patient) => patient.id === selectedPatientId) ?? filteredPatients[0] ?? null;

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Planos dos pacientes</h1>
              <p className="text-sm text-muted-foreground">Visualização consolidada para acompanhamento nutricional.</p>
            </div>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar paciente"
              className="pl-9"
            />
          </div>

          <div className="space-y-3">
            {filteredPatients.map((patient) => {
              const isSelected = patient.id === selectedPatient?.id;

              return (
                <button
                  key={patient.id}
                  type="button"
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-background hover:border-primary/40 hover:bg-accent/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{patient.goal}</p>
                    </div>
                    <Badge variant={patient.planStatus === "active" ? "default" : "secondary"}>
                      {patient.planStatus === "active" ? "Com plano" : "Sem plano"}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{patient.updatedAt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          {selectedPatient ? (
            <>
              <Card className="overflow-hidden border-border shadow-sm">
                <CardHeader className="border-b border-border bg-muted/30">
                  <CardTitle className="flex items-center justify-between gap-3">
                    <span>{selectedPatient.name}</span>
                    <Badge variant={selectedPatient.planStatus === "active" ? "default" : "secondary"}>
                      {selectedPatient.planStatus === "active" ? "Plano ativo" : "Sem plano salvo"}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{selectedPatient.goal}</p>
                </CardHeader>
                <CardContent className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
                  <Metric label="Kcal/dia" value={selectedPatient.summary.kcal} />
                  <Metric label="Proteína" value={`${selectedPatient.summary.protein} g`} />
                  <Metric label="Carboidratos" value={`${selectedPatient.summary.carbs} g`} />
                  <Metric label="Gorduras" value={`${selectedPatient.summary.fats} g`} />
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ChefHat className="h-4 w-4 text-primary" />
                      Estrutura do plano
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>{selectedPatient.meals} refeições distribuídas ao longo do dia.</p>
                    <p>Plano preparado para revisão rápida, com distribuição macro-alimentar destacada.</p>
                    <p>Use a tela detalhada do paciente para validar substituições e orientações.</p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ClipboardList className="h-4 w-4 text-primary" />
                      Ações rápidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <Button asChild>
                      <Link to={`/patients/${selectedPatient.id}/plan`}>Abrir plano detalhado</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/nutritionist/plan/create">Editar criação de plano</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card className="shadow-sm">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                Nenhum paciente encontrado com o filtro atual.
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
};

const Metric = ({ label, value }: { label: string; value: number | string }) => (
  <div className="rounded-2xl border border-border bg-background p-4">
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="mt-2 text-2xl font-semibold">{value}</p>
  </div>
);

export default NutritionistPlanView;
