import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, User, Calendar, AlertCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { mockPatients, type Patient } from "@/lib/patients";
import { NutritionistSidebar } from "@/components/layout/NutritionistSidebar";

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
        <Button className="w-full justify-center gap-2 rounded-2xl bg-emerald-700 text-white hover:bg-emerald-800" onClick={(e) => {
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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

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
    toast.success(`Abrindo perfil de ${patient.name}`);
    navigate(`/patients/${patient.id}`);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#f3f5f4] text-slate-900">
        <div className="grid min-h-screen lg:grid-cols-[224px_minmax(0,1fr)]">
          <NutritionistSidebar />
          <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_34%),linear-gradient(180deg,_#fafafa_0%,_#f3f7f4_100%)] px-4 py-8 text-foreground sm:px-6 lg:px-8 lg:pl-12">
            <div className="w-full space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Meus Pacientes</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerenciamento de pacientes cadastrados na plataforma
                </p>
              </div>
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
                      <Button variant="outline" size="sm" className="h-8 rounded-2xl border-emerald-200 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900" onClick={clearFilters}>
                  Limpar tudo
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Inline status filter buttons */}
            <div className="flex items-center gap-3">
              {PLAN_STATUS.map((status) => (
                <button
                  key={status.value}
                  onClick={() => toggleStatus(status.value)}
                  className={`h-8 rounded-full px-3 text-sm font-medium transition-colors ${selectedStatuses.includes(status.value) ? 'bg-emerald-700 text-white' : 'border border-emerald-200 text-emerald-800 bg-white'}`}
                >
                  {status.label}
                </button>
              ))}

              {hasActiveFilters && (
                <Button variant="outline" size="sm" className="ml-auto h-8 rounded-2xl border-emerald-200 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900" onClick={clearFilters}>
                  Limpar tudo
                </Button>
              )}
            </div>

            {/* Results Grid */}
            <div>
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
                      <Button variant="outline" size="sm" className="rounded-2xl border-emerald-200 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900" onClick={clearFilters}>
                        Limpar todos os filtros
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
            </div>
          </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PatientSearch;
