import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, ChevronDown, Search, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const patients = [
  {
    id: "1",
    name: "João Silva",
    planStatus: "active",
    updatedAt: "Hoje às 08:20",
    summary: { kcal: 2280, protein: 148, carbs: 261, fats: 71 },
    meals: 5,
    goal: "Emagrecimento",
  },
  {
    id: "2",
    name: "Maria Santos",
    planStatus: "active",
    updatedAt: "Ontem às 16:45",
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
    updatedAt: "08/05 às 11:10",
    summary: { kcal: 2105, protein: 126, carbs: 236, fats: 68 },
    meals: 5,
    goal: "Primeira consulta",
  },
] as const;

const NutritionistPlanView: React.FC = () => {
  const [query, setQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>("1");

  const filteredPatients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return patients.filter((patient) => patient.name.toLowerCase().includes(normalizedQuery));
  }, [query]);

  useEffect(() => {
    if (filteredPatients.length === 0) {
      return;
    }

    if (selectedPatientId === null) {
      return;
    }

    const stillVisible = filteredPatients.some((patient) => patient.id === selectedPatientId);
    if (!stillVisible) {
      setSelectedPatientId(filteredPatients[0].id);
    }
  }, [filteredPatients, selectedPatientId]);

  const selectedPatient = filteredPatients.find((patient) => patient.id === selectedPatientId) ?? null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.08),_transparent_35%),linear-gradient(180deg,_rgba(250,250,250,1)_0%,_rgba(244,247,250,1)_100%)] px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                  <Link to="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar ao painel
                  </Link>
                </Button>
                <span aria-hidden="true">•</span>
                <span>{filteredPatients.length} pacientes visíveis</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Planos dos pacientes</h1>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                    Uma visão única para localizar, revisar e abrir rapidamente o plano de cada paciente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border px-6 py-4">
            <div className="relative w-full lg:max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar paciente por nome"
                aria-label="Buscar paciente por nome"
                className="pl-9 pr-10"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label="Limpar busca"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
        </header>

        <div className="grid gap-6">
          <section className="space-y-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Detalhes do paciente</h2>
                <p className="text-sm text-muted-foreground">Clique em um paciente para abrir os dados logo abaixo do card.</p>
              </div>
              {selectedPatient ? (
                <Badge variant="outline" className="rounded-full">
                  {selectedPatient.name}
                </Badge>
              ) : null}
            </div>

            <div className="space-y-3">
              {filteredPatients.map((patient) => {
                const isSelected = patient.id === selectedPatientId;

                return (
                  <Collapsible
                    key={patient.id}
                    open={isSelected}
                    onOpenChange={(open) => setSelectedPatientId(open ? patient.id : null)}
                  >
                    <Card className={`overflow-hidden border shadow-sm ${isSelected ? "border-primary" : "border-border"}`}>
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          className={`group flex w-full items-start justify-between gap-4 p-5 text-left transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                            isSelected ? "bg-primary/5" : "bg-background hover:bg-accent/30"
                          }`}
                          aria-expanded={isSelected}
                        >
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-base font-semibold">{patient.name}</h3>
                              <Badge variant={patient.planStatus === "active" ? "default" : "secondary"}>
                                {patient.planStatus === "active" ? "Com plano" : "Sem plano"}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{patient.goal}</p>
                            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                              <CalendarDays className="h-3.5 w-3.5" />
                              <span>{patient.updatedAt}</span>
                            </div>
                          </div>
                          <ChevronDown
                            className={`mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                              isSelected ? "rotate-180 text-foreground" : ""
                            }`}
                          />
                        </button>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <CardContent className="space-y-5 border-t border-border bg-muted/20 p-5">
                          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <Metric label="Kcal/dia" value={patient.summary.kcal} />
                            <Metric label="Proteína" value={`${patient.summary.protein} g`} />
                            <Metric label="Carboidratos" value={`${patient.summary.carbs} g`} />
                            <Metric label="Gorduras" value={`${patient.summary.fats} g`} />
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <Button asChild className="justify-start">
                              <Link to={`/patients/${patient.id}/plan`}>Abrir plano detalhado</Link>
                            </Button>
                            <Button variant="outline" asChild className="justify-start">
                              <Link to="/nutritionist/plan/create">Editar criação de plano</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                );
              })}
            </div>

            <div className="pt-2">
              <Button asChild className="w-full">
                <Link to="/nutritionist/plan/create">Criar novo plano</Link>
              </Button>
            </div>
          </section>
        </div>
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
