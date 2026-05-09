import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, User, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Patient {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  planStatus: "active" | "inactive" | "pending";
  joinDate: string;
  lastConsultation: string | null;
  notes?: string;
}

// Mock data - será substituído por API
const mockPatients: Patient[] = [
  {
    id: "1",
    name: "João Silva",
    cpf: "123.456.789-00",
    email: "joao@email.com",
    phone: "(11) 98765-4321",
    planStatus: "active",
    joinDate: "2025-01-15",
    lastConsultation: "2026-04-20",
    notes: "Emagrecimento, acompanhamento mensal",
  },
  {
    id: "2",
    name: "Maria Santos",
    cpf: "987.654.321-11",
    email: "maria@email.com",
    phone: "(11) 97654-3210",
    planStatus: "active",
    joinDate: "2025-02-10",
    lastConsultation: "2026-05-05",
    notes: "Nutrição clínica, diabetes",
  },
  {
    id: "3",
    name: "Carlos Oliveira",
    cpf: "456.789.123-22",
    email: "carlos@email.com",
    phone: "(11) 96543-2109",
    planStatus: "inactive",
    joinDate: "2024-06-20",
    lastConsultation: null,
    notes: "Sem atividade há 6 meses",
  },
  {
    id: "4",
    name: "Ana Costa",
    cpf: "789.123.456-33",
    email: "ana@email.com",
    phone: "(11) 95432-1098",
    planStatus: "pending",
    joinDate: "2026-05-01",
    lastConsultation: null,
    notes: "Aguardando primeira consulta",
  },
  {
    id: "5",
    name: "Roberto Ferreira",
    cpf: "321.654.987-44",
    email: "roberto@email.com",
    phone: "(11) 94321-0987",
    planStatus: "active",
    joinDate: "2025-03-12",
    lastConsultation: "2026-04-28",
    notes: "Nutrição esportiva, treino",
  },
];

const PLAN_STATUS = [
  { value: "active", label: "Plano ativo", color: "bg-green-100 text-green-800" },
  { value: "inactive", label: "Plano inativo", color: "bg-red-100 text-red-800" },
  { value: "pending", label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
];

const PatientCard = ({ patient, onViewProfile }: { patient: Patient; onViewProfile: (patient: Patient) => void }) => {
  const statusInfo = PLAN_STATUS.find((s) => s.value === patient.planStatus);

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewProfile(patient)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg">{patient.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">CPF: {patient.cpf}</p>
            </div>
          </div>
          {statusInfo && (
            <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>📧</span>
            <span className="truncate">{patient.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>📞</span>
            <span>{patient.phone}</span>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2 py-2 border-y text-xs">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center cursor-help">
                <div className="font-semibold">Cadastro</div>
                <p className="text-muted-foreground">
                  {new Date(patient.joinDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Data de cadastro</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center cursor-help">
                <div className="font-semibold">Última consulta</div>
                <p className="text-muted-foreground">
                  {patient.lastConsultation
                    ? new Date(patient.lastConsultation).toLocaleDateString("pt-BR")
                    : "–"}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Última consulta realizada</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Notes */}
        {patient.notes && (
          <div className="flex gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-muted-foreground italic">{patient.notes}</p>
          </div>
        )}

        {/* Action Button */}
        <Button className="w-full" onClick={(e) => {
          e.stopPropagation();
          onViewProfile(patient);
        }}>
          Ver Perfil Completo
        </Button>
      </CardContent>
    </Card>
  );
};

export const PatientSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const hasActiveFilters = searchQuery !== "" || selectedStatuses.length > 0;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatuses([]);
  };

  // Filter logic
  const filteredPatients = useMemo(() => {
    return mockPatients.filter((patient) => {
      // Search filter
      const matchesSearch = searchQuery === "" ||
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.cpf.includes(searchQuery);

      // Status filter
      const matchesStatus = selectedStatuses.length === 0 ||
        selectedStatuses.includes(patient.planStatus);

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatuses]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const removeStatus = (status: string) => {
    setSelectedStatuses((prev) => prev.filter((s) => s !== status));
  };

  const handleViewProfile = (patient: Patient) => {
    setSelectedPatient(patient);
    setDialogOpen(true);
    toast.success(`Abrindo perfil de ${patient.name}`);
  };

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Meus Pacientes</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Gerenciamento de pacientes cadastrados na plataforma
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou CPF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-base"
              />
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted-foreground">Filtros ativos:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-2 rounded-full px-3 py-1">
                    Busca: {searchQuery}
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-xs font-semibold opacity-70 hover:opacity-100"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedStatuses.map((status) => {
                  const statusLabel = PLAN_STATUS.find((s) => s.value === status)?.label;
                  return (
                    <Badge key={status} variant="secondary" className="gap-2 rounded-full px-3 py-1">
                      {statusLabel}
                      <button
                        type="button"
                        onClick={() => removeStatus(status)}
                        className="text-xs font-semibold opacity-70 hover:opacity-100"
                      >
                        ×
                      </button>
                    </Badge>
                  );
                })}
                <Button variant="ghost" size="sm" className="h-8 px-2" onClick={clearFilters}>
                  Limpar tudo
                </Button>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-base">Filtros</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status Filter */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Status do plano</p>
                    <div className="space-y-2">
                      {PLAN_STATUS.map((status) => (
                        <label key={status.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedStatuses.includes(status.value)}
                            onChange={() => toggleStatus(status.value)}
                            className="h-4 w-4 rounded"
                          />
                          <span className="text-sm">{status.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={clearFilters}
                    >
                      Limpar Filtros
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-3">
              {filteredPatients.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {filteredPatients.length} paciente{filteredPatients.length !== 1 ? "s" : ""} encontrado{filteredPatients.length !== 1 ? "s" : ""}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredPatients.map((patient) => (
                      <PatientCard
                        key={patient.id}
                        patient={patient}
                        onViewProfile={handleViewProfile}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="py-12">
                  <CardContent className="text-center space-y-4">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                    <div>
                      <h3 className="font-semibold">Nenhum paciente encontrado</h3>
                      <p className="text-sm text-muted-foreground">
                        Não encontramos resultados com os filtros atuais.
                      </p>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {selectedStatuses.length > 0 && (
                        <p>• Tente mudar o status do plano ({selectedStatuses.join(", ")})</p>
                      )}
                      {searchQuery && (
                        <p>• Tente buscar por outro paciente</p>
                      )}
                      {!selectedStatuses.length && !searchQuery && (
                        <p>• Nenhum paciente cadastrado ainda</p>
                      )}
                    </div>
                    {hasActiveFilters && (
                      <Button variant="outline" size="sm" onClick={clearFilters}>
                        Limpar todos os filtros
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Patient Profile Modal */}
          {selectedPatient && dialogOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{selectedPatient.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-2">CPF: {selectedPatient.cpf}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDialogOpen(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 mt-6">
                  {/* Status */}
                  <div>
                    <p className="text-sm font-semibold mb-2">Status do Plano</p>
                    {PLAN_STATUS.find((s) => s.value === selectedPatient.planStatus) && (
                      <Badge className={PLAN_STATUS.find((s) => s.value === selectedPatient.planStatus)!.color}>
                        {PLAN_STATUS.find((s) => s.value === selectedPatient.planStatus)!.label}
                      </Badge>
                    )}
                  </div>

                  {/* Contact */}
                  <div>
                    <p className="text-sm font-semibold mb-2">Contato</p>
                    <div className="space-y-1 text-sm">
                      <p>Email: {selectedPatient.email}</p>
                      <p>Telefone: {selectedPatient.phone}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold">Cadastro</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedPatient.joinDate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Última Consulta</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedPatient.lastConsultation
                          ? new Date(selectedPatient.lastConsultation).toLocaleDateString("pt-BR")
                          : "Sem consultas realizadas"}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedPatient.notes && (
                    <div>
                      <p className="text-sm font-semibold">Observações</p>
                      <p className="text-sm text-muted-foreground">{selectedPatient.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1">Agendar Consulta</Button>
                    <Button variant="outline" className="flex-1">Editar Plano</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
                      Fechar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </TooltipProvider>
  );
};

export default PatientSearch;
