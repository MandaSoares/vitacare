import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockPatients } from "@/lib/patients";
import { loadPatientPlanFromStorage } from "@/lib/patientPlanStorage";
import { samplePatientNutritionPlan, calculateNutritionSummary } from "@/lib/patientPlanData";
import PatientNutritionPlan from "./PatientNutritionPlan";

const NutritionistPlanView: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const patientList = mockPatients;

  const selectedPlan = (selectedPatientId && loadPatientPlanFromStorage(selectedPatientId)) ||
    (selectedPatientId === samplePatientNutritionPlan.patientId ? samplePatientNutritionPlan : null);

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Visualização do plano nutricional (Nutricionista)</h1>
          <p className="text-sm text-muted-foreground">Selecione um paciente para ver o plano associado.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Selecionar paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedPatientId ?? ""} onValueChange={(v) => setSelectedPatientId(v || null)}>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Selecione um paciente" />
              </SelectTrigger>
              <SelectContent>
                {patientList.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name} ({p.cpf})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedPlan ? (
          <PatientNutritionPlan />
        ) : (
          <div className="text-muted-foreground">Nenhum plano disponível para o paciente selecionado.</div>
        )}
      </div>
    </main>
  );
};

export default NutritionistPlanView;
