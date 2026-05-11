import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Mail, Phone, User } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { mockPatients } from "@/lib/patients";

const PLAN_STATUS = [
  { value: "active", label: "Plano ativo", color: "bg-green-100 text-green-800" },
  { value: "inactive", label: "Plano inativo", color: "bg-red-100 text-red-800" },
  { value: "pending", label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
] as const;

const PatientProfile = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const patient = mockPatients.find((entry) => entry.id === patientId);

  if (!patient) {
    return (
      <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Paciente não encontrado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Não encontramos o paciente solicitado na lista.
              </p>
              <Button onClick={() => navigate("/patients")}>Voltar para pacientes</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const statusInfo = PLAN_STATUS.find((status) => status.value === patient.planStatus);

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <Link
          to="/patients"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para pacientes
        </Link>

        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{patient.name}</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">CPF: {patient.cpf}</p>
                </div>
              </div>
              {statusInfo && <Badge className={statusInfo.color}>{statusInfo.label}</Badge>}
            </div>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.email}</span>
                </div>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Telefone</p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.phone}</span>
                </div>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Cadastro</p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(patient.joinDate).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
            </section>

            <Separator />

            <section className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h2 className="text-sm font-semibold">Última consulta</h2>
                <p className="text-sm text-muted-foreground">
                  {patient.lastConsultation
                    ? new Date(patient.lastConsultation).toLocaleDateString("pt-BR")
                    : "Sem consultas realizadas"}
                </p>
              </div>
              <div className="space-y-2">
                <h2 className="text-sm font-semibold">Status do plano</h2>
                <p className="text-sm text-muted-foreground">
                  {statusInfo?.label ?? "Sem status"}
                </p>
              </div>
            </section>

            {patient.notes && (
              <section className="space-y-2">
                <h2 className="text-sm font-semibold">Observações</h2>
                <p className="text-sm text-muted-foreground">{patient.notes}</p>
              </section>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button>Agendar Consulta</Button>
              <Button variant="outline">Editar Plano</Button>
              <Button variant="ghost" onClick={() => navigate("/patients")}>
                Voltar para a lista
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default PatientProfile;