import React, { useState } from "react";
import { NutritionistSidebar } from "@/components/layout/NutritionistSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Users, FileText, Download, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportData {
  id: string;
  title: string;
  description: string;
  type: "patient" | "performance" | "financial" | "compliance";
  period: string;
  date: string;
  status: "disponível" | "gerando" | "erro";
}

const mockReports: ReportData[] = [
  {
    id: "1",
    title: "Desempenho de Pacientes - Maio 2026",
    description: "Relatório de evolução dos pacientes ativos",
    type: "patient",
    period: "Maio 2026",
    date: "2026-05-15",
    status: "disponível",
  },
  {
    id: "2",
    title: "Taxa de Conclusão de Planos",
    description: "Análise das taxa de sucesso em planos nutricionais",
    type: "performance",
    period: "Abril - Maio 2026",
    date: "2026-05-14",
    status: "disponível",
  },
  {
    id: "3",
    title: "Faturamento - Maio 2026",
    description: "Relatório financeiro e de faturamento do mês",
    type: "financial",
    period: "Maio 2026",
    date: "2026-05-12",
    status: "disponível",
  },
  {
    id: "4",
    title: "Conformidade com Regulamentações",
    description: "Análise de conformidade com regulações nutricionais",
    type: "compliance",
    period: "Anual 2026",
    date: "2026-05-10",
    status: "disponível",
  },
  {
    id: "5",
    title: "Satisfação de Pacientes",
    description: "Feedback e avaliações dos pacientes atendidos",
    type: "patient",
    period: "Trimestral",
    date: "2026-05-08",
    status: "disponível",
  },
];

const typeLabels: Record<string, string> = {
  patient: "Pacientes",
  performance: "Desempenho",
  financial: "Financeiro",
  compliance: "Conformidade",
};

const typeColors: Record<string, string> = {
  patient: "bg-blue-100 text-blue-800",
  performance: "bg-green-100 text-green-800",
  financial: "bg-purple-100 text-purple-800",
  compliance: "bg-orange-100 text-orange-800",
};

const statusColors: Record<string, string> = {
  disponível: "bg-green-100 text-green-800",
  gerando: "bg-yellow-100 text-yellow-800",
  erro: "bg-red-100 text-red-800",
};

interface KPICard {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}

const Reports: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("todos");

  const filteredReports = mockReports.filter((report) => {
    if (selectedType && report.type !== selectedType) return false;
    return true;
  });

  const kpis: KPICard[] = [
    {
      title: "Total de Pacientes Ativos",
      value: 47,
      change: "+12%",
      trend: "up",
      icon: <Users className="h-6 w-6 text-emerald-600" />,
    },
    {
      title: "Taxa de Sucesso de Planos",
      value: "85%",
      change: "+5%",
      trend: "up",
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Receita do Mês",
      value: "R$ 12.540",
      change: "+18%",
      trend: "up",
      icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
    },
    {
      title: "Novas Consultas",
      value: 23,
      change: "+8%",
      trend: "up",
      icon: <FileText className="h-6 w-6 text-orange-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f5f4] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[224px_minmax(0,1fr)]">
        <NutritionistSidebar />
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.08),_transparent_35%),linear-gradient(180deg,_rgba(250,250,250,1)_0%,_rgba(244,247,250,1)_100%)] px-4 py-6 text-foreground sm:px-6 lg:px-8 lg:pl-12">
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
              <Button className="gap-2 rounded-2xl bg-emerald-700 text-white hover:bg-emerald-800">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {kpis.map((kpi, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                        <div className="mt-2 flex items-baseline gap-2">
                          <h3 className="text-2xl font-bold">{kpi.value}</h3>
                          <span
                            className={`text-sm font-semibold ${
                              kpi.trend === "up" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {kpi.change}
                          </span>
                        </div>
                      </div>
                      <div className="rounded-lg bg-gray-100 p-3">{kpi.icon}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Filter className="h-4 w-4" />
                  <Select value={selectedType || "todos"} onValueChange={(val) => setSelectedType(val === "todos" ? null : val)}>
                    <SelectTrigger className="w-48 rounded-2xl">
                      <SelectValue placeholder="Tipo de relatório" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="patient">Pacientes</SelectItem>
                      <SelectItem value="performance">Desempenho</SelectItem>
                      <SelectItem value="financial">Financeiro</SelectItem>
                      <SelectItem value="compliance">Conformidade</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-48 rounded-2xl">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="mes">Este Mês</SelectItem>
                      <SelectItem value="trimestre">Este Trimestre</SelectItem>
                      <SelectItem value="semestre">Este Semestre</SelectItem>
                      <SelectItem value="ano">Este Ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
            </Card>

            {/* Reports List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Relatórios Disponíveis ({filteredReports.length})</h2>
              {filteredReports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{report.title}</h3>
                          <Badge className={typeColors[report.type]}>
                            {typeLabels[report.type]}
                          </Badge>
                          <Badge className={statusColors[report.status]}>
                            {report.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                          <span>Período: {report.period}</span>
                          <span>Gerado em: {new Date(report.date).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl"
                          disabled={report.status !== "disponível"}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl"
                          disabled={report.status !== "disponível"}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Excel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Chart Section */}
            <Card>
              <CardHeader>
                <CardTitle>Tendências do Período</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">Satisfação de Pacientes</span>
                      <span className="text-sm font-semibold">92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">Retenção de Pacientes</span>
                      <span className="text-sm font-semibold">78%</span>
                    </div>
                    <Progress value={78} />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">Taxa de Conclusão</span>
                      <span className="text-sm font-semibold">85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
