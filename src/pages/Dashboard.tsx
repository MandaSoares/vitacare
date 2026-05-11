import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, Users, Clock, TrendingUp, Plus, Search } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  status: "active" | "pending";
  hasPlan: boolean;
}

interface Activity {
  id: string;
  type: "patient_created" | "plan_created" | "plan_completed";
  patientName: string;
  timestamp: Date;
  description: string;
}

// Mock data - será substituído por API
const mockPatients: Patient[] = [
  { id: "1", name: "João Silva", status: "active", hasPlan: true },
  { id: "2", name: "Maria Santos", status: "active", hasPlan: false },
  { id: "3", name: "Pedro Oliveira", status: "pending", hasPlan: false },
  { id: "4", name: "Ana Costa", status: "active", hasPlan: true },
  { id: "5", name: "Carlos Mendes", status: "pending", hasPlan: false },
];

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "patient_created",
    patientName: "Carlos Mendes",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    description: "Novo paciente registrado",
  },
  {
    id: "2",
    type: "plan_created",
    patientName: "João Silva",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    description: "Plano de nutrição criado",
  },
  {
    id: "3",
    type: "plan_completed",
    patientName: "Ana Costa",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    description: "Plano concluído",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [patients] = useState<Patient[]>(mockPatients);
  const [activities] = useState<Activity[]>(mockActivities);

  // Cálculos de estatísticas
  const activePatients = patients.filter((p) => p.status === "active").length;
  const pendingPatients = patients.filter((p) => p.status === "pending").length;
  const patientsWithoutPlan = patients.filter((p) => !p.hasPlan);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `há ${diffMins}m`;
    if (diffHours < 24) return `há ${diffHours}h`;
    return `há ${diffDays}d`;
  };

  // Handlers para ações
  const handleNewPlan = () => {
    navigate("/nutritionist/plan/create");
  };

  const handleSearchPatient = () => {
    navigate("/patients");
  };

  const handleViewAllPatients = () => {
    navigate("/nutritionist/plans");
  };

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Bem-vindo de volta. Aqui está um resumo da sua carteira de pacientes.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="cursor-help hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
                    <Users className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activePatients}</div>
                    <p className="text-xs text-muted-foreground">em acompanhamento</p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pacientes com status ativo e acompanhamento regular</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="cursor-help hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pacientes Pendentes</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pendingPatients}</div>
                    <p className="text-xs text-muted-foreground">aguardando confirmação</p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pacientes registrados mas ainda não confirmados</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="cursor-help hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de Planos</CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(((patients.length - patientsWithoutPlan.length) / patients.length) * 100)}%</div>
                    <p className="text-xs text-muted-foreground">pacientes com plano</p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Percentual de pacientes com plano de nutrição ativo</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Alerts Section */}
          {patientsWithoutPlan.length > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Pacientes sem Plano Ativo</AlertTitle>
              <AlertDescription className="mt-2 space-y-3">
                <p className="text-sm">
                  Você tem {patientsWithoutPlan.length} paciente{patientsWithoutPlan.length > 1 ? "s" : ""} sem plano de nutrição ativo. Considere criar planos para melhorar o acompanhamento.
                </p>
                <div className="flex flex-wrap gap-2">
                  {patientsWithoutPlan.slice(0, 5).map((patient) => (
                    <Badge key={patient.id} variant="outline" className="bg-yellow-100 border-yellow-300">
                      {patient.name}
                    </Badge>
                  ))}
                  {patientsWithoutPlan.length > 5 && <Badge variant="outline">+{patientsWithoutPlan.length - 5} mais</Badge>}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Atalhos Rápidos</CardTitle>
                  <CardDescription>Ações frequentes para gerenciar seus pacientes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="gap-2" size="sm" onClick={handleNewPlan}>
                    <Plus className="h-4 w-4" />
                    Novo Plano
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Criar um novo plano de nutrição (Ctrl+N)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="gap-2" size="sm" variant="outline" onClick={handleSearchPatient}>
                    <Search className="h-4 w-4" />
                    Buscar Paciente
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pesquisar e filtrar pacientes (Ctrl+P)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="gap-2" size="sm" variant="outline" onClick={handleViewAllPatients}>
                    <Users className="h-4 w-4" />
                    Ver Todos os Pacientes
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visualizar lista completa de pacientes</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Atividade Recente</CardTitle>
              <CardDescription>Últimas ações na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 border-b pb-4 last:border-0 hover:bg-muted/30 p-2 rounded transition-colors">
                      <div className="mt-1 rounded-full bg-green-100 p-2">
                        {activity.type === "patient_created" && <Users className="h-4 w-4 text-green-700" />}
                        {activity.type === "plan_created" && <Plus className="h-4 w-4 text-blue-700" />}
                        {activity.type === "plan_completed" && <TrendingUp className="h-4 w-4 text-purple-700" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          {activity.type === "patient_created" && `Novo paciente: ${activity.patientName}`}
                          {activity.type === "plan_created" && `Plano criado para ${activity.patientName}`}
                          {activity.type === "plan_completed" && `Plano concluído por ${activity.patientName}`}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{formatTimeAgo(activity.timestamp)}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </TooltipProvider>
  );
};

export default Dashboard;