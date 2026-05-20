import { useMemo, useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useAuth } from "@/contexts/AuthContext";
import { getNutritionistBannerClassName, getNutritionistInitials, getNutritionistProfile } from "@/lib/nutritionistProfileStore";
import { ProfileDropdown } from "@/components/layout/ProfileDropdown";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  Clock3,
  HelpCircle,
  Leaf,
  Mail,
  MapPin,
  Plus,
  Search,
  Settings,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";

const DAILY_TIPS = [
  "Pequenas mudancas diarias geram grandes transformacoes a longo prazo.",
  "Inclua mais vegetais coloridos nas suas refeicoes para variar os nutrientes.",
  "Beba agua ao longo do dia para manter a hidratacao e a energia.",
  "Faça movimetacao leve apos as refeicoes para ajudar na digestao.",
  "Planeje suas refeicoes na semana para evitar escolhas impulsivas.",
  "Durma bem: reparacao e recuperacao acontecem durante o sono.",
  "Mantenha metas pequenas e alcançaveis para construir habitos duradouros.",
];

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

const mockPatients: Patient[] = [
  { id: "1", name: "Joao Silva", status: "active", hasPlan: true },
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
    patientName: "Joao Silva",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    description: "Plano de nutricao criado",
  },
  {
    id: "3",
    type: "plan_completed",
    patientName: "Ana Costa",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    description: "Plano concluido",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const profile = useMemo(() => getNutritionistProfile(user), [user]);
  const [patients] = useState<Patient[]>(mockPatients);
  const [activities] = useState<Activity[]>(mockActivities);
  const [unreadMessages] = useState<number>(3); // Mock: simulando 3 mensagens não lidas
  const recentPatientNotifications = patients
    .filter((patient) => patient.status === "pending")
    .slice(0, 3)
    .map((patient) => ({
      id: patient.id,
      title: patient.name,
      subtitle: "Novo paciente aguardando avaliação",
    }));

  const recentMessageNotifications = [
    {
      id: "m1",
      title: "João Silva",
      subtitle: "Oi! Como faço para ajustar meu plano?",
    },
    {
      id: "m2",
      title: "Maria Santos",
      subtitle: "Posso ajustar o plano para encaixar os horários do trabalho?",
    },
  ];

  const activePatients = patients.filter((patient) => patient.status === "active").length;
  const pendingPatients = patients.filter((patient) => patient.status === "pending").length;
  const patientsWithoutPlan = patients.filter((patient) => !patient.hasPlan);
  const planCoverage = patients.length > 0 ? Math.round(((patients.length - patientsWithoutPlan.length) / patients.length) * 100) : 0;

  // Total de notificações (pacientes pendentes + mensagens não lidas)
  const totalNotifications = pendingPatients + unreadMessages;

  const formatTimeAgo = (date: Date) => {
    const diffMs = new Date().getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `ha ${diffMins}m`;
    if (diffHours < 24) return `ha ${diffHours}h`;
    return `ha ${diffDays}d`;
  };

  const handleNewPlan = () => navigate("/nutritionist/plan/create");
  const handleSearchPatient = () => navigate("/patients");
  const handleViewAllPatients = () => navigate("/nutritionist/plans");
  const handleOpenProfile = () => navigate("/nutritionist/profile");
  const handleOpenMessages = () => navigate("/nutritionist/messages");

  const bannerClassName = getNutritionistBannerClassName(profile.bannerPreset);

  const [dailyTip, setDailyTip] = useState(() => {
    const dayIndex = Math.floor(Date.now() / 86400000) % DAILY_TIPS.length;
    return DAILY_TIPS[dayIndex];
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      const now = Date.now();
      const nextMidnight = new Date();
      nextMidnight.setHours(24, 0, 0, 0);
      const msUntilNext = nextMidnight.getTime() - now;
      timeoutId = setTimeout(() => {
        const dayIndex = Math.floor(Date.now() / 86400000) % DAILY_TIPS.length;
        setDailyTip(DAILY_TIPS[dayIndex]);
        schedule();
      }, msUntilNext + 1000);
    };

    schedule();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f5f4] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[224px_minmax(0,1fr)]">
        <aside className="border-r border-slate-200 bg-white px-5 py-6">
          <div className="flex h-full flex-col">
            <Link to="/dashboard" className="mb-6 flex items-center gap-2 rounded-xl">
              <Leaf className="h-6 w-6 text-emerald-700" />
              <p className="text-[28px] font-semibold tracking-tight text-emerald-700">VitaCare</p>
            </Link>

            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900" onClick={handleNewPlan}>
                <Plus className="h-4 w-4" />
                Novo plano
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                onClick={handleSearchPatient}
              >
                <Search className="h-4 w-4" />
                Buscar paciente
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                onClick={handleViewAllPatients}
              >
                <Users className="h-4 w-4" />
                Ver pacientes
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                onClick={handleOpenMessages}
              >
                <Mail className="h-4 w-4" />
                Mensagens
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                <CalendarDays className="h-4 w-4" />
                Agenda
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                <BarChart3 className="h-4 w-4" />
                Relatorios
              </Button>
            </div>

            <div className="mt-auto space-y-1 border-t border-slate-200 pt-4">
              <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                <Settings className="h-4 w-4" />
                Configuracoes
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                <HelpCircle className="h-4 w-4" />
                Ajuda
              </Button>
            </div>
          </div>
        </aside>

        <main className="px-4 py-5 sm:px-6 lg:px-8 lg:pl-12">
          <div className="w-full space-y-6">
            <header className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Olá, Dra. Maria! 👋</h1>
                <p className="mt-1 text-base text-slate-500">Aqui esta o resumo da sua clinica hoje.</p>
              </div>

              <div className="flex items-center gap-3">
                <HoverCard openDelay={120} closeDelay={80}>
                  <HoverCardTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative rounded-full text-slate-600 hover:bg-emerald-100 hover:text-emerald-700"
                    >
                      <Bell className="h-5 w-5" />
                      {totalNotifications > 0 && (
                        <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 p-0 text-xs font-semibold text-white hover:bg-emerald-600">
                          {totalNotifications > 9 ? "9+" : totalNotifications}
                        </Badge>
                      )}
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent align="end" className="w-80 border-emerald-100 bg-white p-4 shadow-lg">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Novos pacientes</p>
                        <div className="mt-2 space-y-2">
                          {recentPatientNotifications.length > 0 ? (
                            recentPatientNotifications.map((item) => (
                              <div key={item.id} className="rounded-xl border border-slate-200 px-3 py-2">
                                <p className="text-sm font-medium text-slate-900">{item.title}</p>
                                <p className="text-xs text-slate-500">{item.subtitle}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500">Nenhum novo paciente no momento.</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">Mensagens recentes</p>
                        <div className="mt-2 space-y-2">
                          {recentMessageNotifications.map((item) => (
                            <div key={item.id} className="rounded-xl border border-slate-200 px-3 py-2">
                              <p className="text-sm font-medium text-slate-900">{item.title}</p>
                              <p className="text-xs text-slate-500">{item.subtitle}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <ProfileDropdown />
              </div>
            </header>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
              <section className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-slate-700">Pacientes Ativos</p>
                          <p className="text-4xl font-bold leading-none text-slate-900">{activePatients}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500">em acompanhamento</p>
                      <Badge className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">+ 12%</Badge>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                          <Clock3 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-slate-700">Pacientes Pendentes</p>
                          <p className="text-4xl font-bold leading-none text-slate-900">{pendingPatients}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500">aguardando confirmacao</p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-slate-700">Taxa de Planos</p>
                          <p className="text-4xl font-bold leading-none text-slate-900">{planCoverage}%</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500">pacientes com plano</p>
                      <Badge className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">+ 8%</Badge>
                    </CardContent>
                  </Card>
                </div>

                {patientsWithoutPlan.length > 0 && (
                  <Alert className="rounded-2xl border-[#efcc86] bg-[#fdf8ea] text-[#7d4317]">
                    <AlertCircle className="h-5 w-5 text-[#f28b22]" />
                    <AlertTitle className="text-base font-semibold text-[#7d4317]">Pacientes sem Plano Ativo</AlertTitle>
                    <AlertDescription className="mt-2 flex items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <p className="max-w-[620px] text-sm text-[#7d4317]/80">
                          Voce tem {patientsWithoutPlan.length} paciente{patientsWithoutPlan.length > 1 ? "s" : ""} sem plano de nutricao ativo. Considere criar planos para melhorar o acompanhamento.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {patientsWithoutPlan.slice(0, 5).map((patient) => (
                            <Badge
                              key={patient.id}
                              variant="outline"
                              className="rounded-full border-[#edd39a] bg-[#f8ebc9] px-3 py-1 text-sm font-medium text-[#8d5a22]"
                            >
                              {patient.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="hidden shrink-0 md:flex md:justify-end md:self-start">
                        <img
                          src="/pacientes-sem-plano.png"
                          alt="Ilustracao de checklist e salada"
                          className="w-[180px] max-w-none -mt-10"
                        />
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
                  <CardContent className="space-y-5 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-semibold text-slate-900">Atividade Recente</h2>
                        <p className="mt-1 text-sm text-slate-500">Ultimas acoes na plataforma</p>
                      </div>
                      <Button variant="outline" onClick={() => navigate('/activities')} className="rounded-xl border-emerald-200 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900">
                        Ver todas
                      </Button>
                    </div>

                    <div className="space-y-1">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 border-b border-slate-200 py-3 last:border-none">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            {activity.type === "patient_created" && <Users className="h-5 w-5" />}
                            {activity.type === "plan_created" && <Plus className="h-5 w-5" />}
                            {activity.type === "plan_completed" && <TrendingUp className="h-5 w-5" />}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-base font-semibold text-slate-800">
                              {activity.type === "patient_created" && `Novo paciente: ${activity.patientName}`}
                              {activity.type === "plan_created" && `Plano criado para ${activity.patientName}`}
                              {activity.type === "plan_completed" && `Plano concluido por ${activity.patientName}`}
                            </p>
                            <p className="text-sm text-slate-500">{activity.description}</p>
                          </div>

                          <span className="shrink-0 text-sm text-slate-500">{formatTimeAgo(activity.timestamp)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              <aside className="flex h-full flex-col gap-5">
                <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
                  {profile.bannerPreset === "custom" && profile.customBannerImageUrl ? (
                    <img src={profile.customBannerImageUrl} alt="Banner do perfil" className="h-20 w-full object-cover" />
                  ) : (
                    <div className={`h-20 ${bannerClassName}`} />
                  )}
                  <CardContent className="space-y-4 pt-0">
                    <div className="-mt-9 flex justify-center">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-emerald-100 text-3xl font-bold text-emerald-800 shadow">
                        {profile.profileImageUrl ? (
                          <img src={profile.profileImageUrl} alt={profile.name} className="h-full w-full object-cover" />
                        ) : (
                          getNutritionistInitials(profile.name)
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-slate-900">{profile.name}</h2>
                      <p className="text-sm text-slate-500">{profile.specialty} · {profile.city}, {profile.state}</p>
                    </div>

                    <div className="space-y-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-emerald-700" />
                        <span>{profile.crn}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-700" />
                        <span>{profile.attendance}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-700" />
                        <span>{profile.formationPrimary}</span>
                      </div>
                    </div>

                    <Button className="w-full gap-2 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800" onClick={handleOpenProfile}>
                      Editar perfil
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="flex-1 rounded-2xl border-emerald-100 bg-emerald-50/50 shadow-sm">
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <Leaf className="h-5 w-5" />
                      <h3 className="text-base font-semibold">Dica do dia</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                      {dailyTip}
                    </p>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
