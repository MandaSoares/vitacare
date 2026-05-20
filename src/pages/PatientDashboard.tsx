import React, { useEffect, useState } from "react";
import { sampleMeals, sampleProgress } from "@/lib/patientDashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Bell, BarChart3, CalendarDays, ChevronRight, Clock, Droplets, Heart, MessageSquare, Salad, Scale, Sparkles, TrendingUp, Users, Smile, MoreVertical, Leaf, Search, LogOut, Zap } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PatientConsultations from "./PatientConsultations";
import PreAnalysis from "./PreAnalysis";
import { useAuth } from "@/contexts/AuthContext";
import { getPatientProfile } from "@/lib/patientProfileStore";
import { cn } from "@/lib/utils";
import { PatientSidebar } from "@/components/layout/PatientSidebar";
import NutritionistSearch, { NutritionistCard, getNutritionistAvatarStyle, mockNutritionists } from "./NutritionistSearch";
import NutritionistProfileDialog from "@/components/landing/NutritionistProfileDialog";
import { getSavedNutritionistIds, setNutritionistSaved } from "@/lib/savedNutritionistsStore";

type TabType = "home" | "find" | "messages" | "meals" | "saved" | "consultations" | "preanalysis";

const calculateAge = (birthDate: string) => {
  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDifference = today.getMonth() - date.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }

  return age;
};

const calculateBmi = (weight: string, height: string) => {
  const weightValue = Number(weight.replace(",", "."));
  const heightValue = Number(height.replace(",", ".")) / 100;

  if (!weightValue || !heightValue) {
    return null;
  }

  return weightValue / (heightValue * heightValue);
};

const getBmiStatus = (bmi: number | null) => {
  if (bmi === null) {
    return "Dados insuficientes";
  }

  if (bmi >= 30) {
    return "Obesidade";
  }

  if (bmi >= 25) {
    return "Sobrepeso";
  }

  if (bmi >= 18.5) {
    return "Peso saudável";
  }

  return "Atenção nutricional";
};

const PatientStatCard = ({
  icon,
  label,
  value,
  subvalue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subvalue?: string;
}) => {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="flex items-start gap-4 p-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          {icon}
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
          {subvalue && <p className="text-sm text-slate-500">{subvalue}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

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

const PATIENT_DAILY_TIPS = [
  "Hidratação consistente ajuda a regular a fome e mantém o corpo funcionando melhor.",
  "Priorize alimentos frescos em pelo menos uma refeição do dia para ganhar mais fibras e saciedade.",
  "Organizar o prato com proteína, legumes e carboidratos de qualidade facilita escolhas melhores.",
  "Pequenas constâncias contam mais do que mudanças radicais quando o foco é nutrição.",
  "Começar a refeição pelos vegetais pode ajudar no controle de apetite e na qualidade do prato.",
  "Planejar o lanche antes da fome apertar reduz decisões por impulso e ajuda na rotina.",
];

const getDailyTip = (date = new Date()) => {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  return PATIENT_DAILY_TIPS[seed % PATIENT_DAILY_TIPS.length];
};

const getTabFromSearch = (search: string): TabType | null => {
  const tab = new URLSearchParams(search).get("tab");
  if (
    tab === "find" ||
    tab === "preanalysis" ||
    tab === "consultations" ||
    tab === "messages" ||
    tab === "meals" ||
    tab === "saved" ||
    tab === "home"
  ) {
    return tab;
  }

  return null;
};

const PatientHomeContent: React.FC<{
  patientProfile: ReturnType<typeof getPatientProfile>;
  patientInitials: string;
  onOpenTab: (tab: TabType) => void;
  onLogout: () => void;
}> = ({ patientProfile, patientInitials, onOpenTab, onLogout }) => {
  const bmi = calculateBmi(patientProfile.weight, patientProfile.height);
  const bmiStatus = getBmiStatus(bmi);
  const age = calculateAge(patientProfile.birthDate);
  const firstName = patientProfile.name.split(" ")[0] || "Paciente";
  const progressPercent = Math.min(100, Math.round((sampleProgress.todayCalories / sampleProgress.calorieGoal) * 100));
  const planName = patientProfile.goal || "Reeducação alimentar";
  const formattedBmi = bmi ? bmi.toFixed(1) : "--";
  const tipOfTheDay = getDailyTip();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    {
      title: "Plano atualizado",
      description: "Seu nutricionista ajustou a meta calórica de hoje.",
      time: "há 10 min",
    },
    {
      title: "Nova mensagem",
      description: "Dra. Carolina Silva respondeu sua última dúvida.",
      time: "há 1 h",
    },
    {
      title: "Consulta confirmada",
      description: "Sua próxima consulta foi agendada para amanhã.",
      time: "Hoje",
    },
  ];

  const upcomingConsultations = [
    {
      id: "1",
      title: "Retorno nutricional",
      nutritionist: "Dra. Carolina Silva",
      date: "24 de Maio de 2024",
      time: "10:00",
    },
    {
      id: "2",
      title: "Acompanhamento do plano",
      nutritionist: "Nutri. Roberto Costa",
      date: "28 de Maio de 2024",
      time: "14:30",
    },
  ];

  useEffect(() => {
    const handleDocumentPointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target?.closest('[data-menu="profile-menu"]')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentPointerDown);
    return () => document.removeEventListener("mousedown", handleDocumentPointerDown);
  }, []);

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex items-start justify-between gap-4 pt-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-[2.15rem]">
            Olá, {firstName}! 👋
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
            Acompanhe seu progresso, confira o plano atual e acesse suas áreas principais.
          </p>
        </div>

          <div className="flex items-center gap-3 self-start">
          <div className="group relative">
            <button
              type="button"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50"
              aria-label="Notificações"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[11px] font-semibold text-white">
                {notifications.length}
              </span>
            </button>
            <div className="pointer-events-none absolute right-0 top-full z-30 mt-3 hidden w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg group-hover:block">
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-sm font-semibold text-slate-900">Notificações</p>
                <span className="text-xs text-slate-500">Hoje</span>
              </div>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div key={notification.title} className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-600">{notification.description}</p>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-emerald-700">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative" data-menu="profile-menu">
            <button
              type="button"
              onClick={() => setProfileDropdownOpen((current) => !current)}
              aria-label="Abrir menu do perfil"
              className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-emerald-100 text-sm font-semibold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-200"
            >
              {patientProfile.profileImageUrl ? (
                <img src={patientProfile.profileImageUrl} alt={patientProfile.name} className="h-full w-full object-cover" />
              ) : (
                patientInitials || "P"
              )}
            </button>
            
            {profileDropdownOpen && (
              <div className="absolute right-0 top-full z-30 mt-3 w-32 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setProfileDropdownOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:gap-4">
        <PatientStatCard
          icon={<BarChart3 className="h-6 w-6" />}
          label="IMC"
          value={formattedBmi}
          subvalue={bmiStatus}
        />
        <PatientStatCard
          icon={<Scale className="h-6 w-6" />}
          label="Peso atual"
          value={`${patientProfile.weight} kg`}
          subvalue={`${sampleProgress.todayCalories} kcal consumidas hoje`}
        />
        <PatientStatCard
          icon={<TrendingUp className="h-6 w-6" />}
          label="Foco"
          value={patientProfile.goal || "Perda de peso"}
          subvalue={`${progressPercent}% concluído`}
        />
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
          <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-slate-100">
              <div className="space-y-1">
                <CardTitle className="text-xl text-slate-900">Plano alimentar atual</CardTitle>
                <p className="text-sm text-slate-500">Seu acompanhamento em andamento com metas diárias e progresso.</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Em andamento
              </span>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[120px_minmax(0,1fr)_220px] items-center">
                {/* Left placeholder box (no image yet) */}
                <div className="flex items-center justify-center">
                  <div className="rounded-xl bg-emerald-50 p-2">
                    <img
                      src="/Salada%20fresca%20com%20laranja%20e%20bolhas.png"
                      alt="Salada fresca com laranja"
                      className="h-20 w-20 rounded-lg object-cover shadow-sm"
                    />
                  </div>
                </div>

                {/* Middle content */}
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-semibold text-slate-900">{planName}</p>
                    <p className="text-sm text-slate-500">Iniciado em 10 de Maio de 2024</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <span>Déficit calórico moderado</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                        <Droplets className="h-4 w-4" />
                      </div>
                      <span>{sampleProgress.calorieGoal} kcal por dia</span>
                    </div>
                  </div>
                </div>

                {/* Right column: progress + button */}
                <div className="flex flex-col items-end justify-center gap-4">
                  <div className="w-full">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>Progresso diário</span>
                      <span className="font-semibold text-slate-900">{progressPercent}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-2 mt-2" />
                  </div>
                  <div className="w-full">
                    <button
                      type="button"
                      onClick={() => onOpenTab("meals")}
                      className="ml-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
                    >
                      Ver plano completo
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-slate-100">
                <div className="flex items-start justify-between w-full">
                  <div className="space-y-1">
                    <CardTitle className="text-xl text-slate-900">Próximas consultas</CardTitle>
                    <p className="text-sm text-slate-500">Consultas agendadas para acompanhamento do seu plano.</p>
                  </div>
                  <div className="flex items-center gap-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {upcomingConsultations.length} agendadas
                      </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6 md:p-8">
              {upcomingConsultations.map((consultation) => {
                const initials = consultation.nutritionist.split(" ").map((p) => p[0]).slice(0, 2).join("");
                return (
                <div key={consultation.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold ${getNutritionistAvatarStyle(consultation.nutritionist)}`}>
                      {initials}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-900">{consultation.title}</p>
                      <p className="text-sm text-slate-500">{consultation.nutritionist}</p>
                      <p className="text-sm text-slate-600">{consultation.date} · {consultation.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
                    <CalendarDays className="h-4 w-4 text-emerald-600" />
                    Confirmada
                  </div>
                </div>
                )
              })}
              <button
                type="button"
                onClick={() => onOpenTab("consultations")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Ver minhas consultas
                <ChevronRight className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>
          <Card className="border-emerald-100 bg-emerald-50/70 shadow-sm">
            <CardContent className="flex items-center justify-between space-y-3 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white/80 p-3 text-emerald-700">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="max-w-2xl">
                  <p className="font-semibold text-emerald-700">Insight da IA</p>
                  <p className="text-sm text-slate-600">Seu consumo de proteína está abaixo da média desta semana. Que tal incluir mais fontes de proteína nas suas refeições?</p>
                </div>
              </div>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
                Ver recomendações
                <ChevronRight className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4 xl:mt-6 xl:sticky xl:top-3 flex flex-col">
          <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
            <div className="h-28 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 rounded-t-lg" />
            <CardContent className="-mt-12 p-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-emerald-100 text-xl font-semibold text-emerald-800 shadow-lg">
                {patientProfile.profileImageUrl ? (
                  <img src={patientProfile.profileImageUrl} alt={patientProfile.name} className="h-full w-full object-cover rounded-full" />
                ) : (
                  patientInitials || "P"
                )}
              </div>

              <div className="mt-4 space-y-1 text-center">
                <p className="text-xl font-semibold text-slate-900">{patientProfile.name}</p>
                <p className="text-sm text-slate-500">{(age ?? "--")} anos · Sorocaba, SP</p>
              </div>

              <div className="mt-4 space-y-3 rounded-[22px] bg-white p-4 text-sm text-slate-600 border">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    Objetivo
                  </span>
                  <span className="font-medium text-slate-900">{patientProfile.goal || "Perda de peso"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Scale className="h-4 w-4 text-emerald-600" />
                    Peso atual
                  </span>
                  <span className="font-medium text-slate-900">{patientProfile.weight} kg</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <BarChart3 className="h-4 w-4 text-emerald-600" />
                    IMC
                  </span>
                  <span className="font-medium text-slate-900">{formattedBmi} · {bmiStatus}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/patient/profile')}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Editar perfil
              </button>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-emerald-50/70 shadow-sm flex-1">
            <CardContent className="space-y-4 p-6 h-full">
              <div className="flex items-center gap-2 text-emerald-700">
                <Sparkles className="h-6 w-6" />
                <p className="text-lg font-semibold">Dica do dia</p>
              </div>
              <p className="text-base leading-7 text-slate-700">{tipOfTheDay}</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

const PatientMessagesContent: React.FC<{ patientProfile: ReturnType<typeof getPatientProfile> }> = ({ patientProfile }) => {
  const initialConversations = [
    {
      id: "1",
      nutritionist: mockNutritionists[0],
      unread: true,
      archived: false,
      date: "29/04/2026",
      lastMessage: "Olá! Obrigado por considerar meus serviços.",
      messages: [
        { from: "nutri", text: "Olá! Obrigado por considerar meus serviços." },
      ],
    },
    {
      id: "2",
      nutritionist: mockNutritionists[1],
      unread: false,
      archived: false,
      date: "28/04/2026",
      lastMessage: "Vamos aumentar as proteínas e organizar a rotina.",
      messages: [
        { from: "nutri", text: "Vamos aumentar as proteínas e organizar a rotina." },
      ],
    },
    {
      id: "3",
      nutritionist: mockNutritionists[2],
      unread: false,
      archived: true,
      date: "28/04/2026",
      lastMessage: "Posso te ajudar com o plano alimentar do bebê.",
      messages: [
        { from: "nutri", text: "Posso te ajudar com o plano alimentar do bebê." },
      ],
    },
  ];

  const [conversations, setConversations] = useState(initialConversations);
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(conversations[0]?.id ?? null);
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [convMenuPos, setConvMenuPos] = useState<{ x: number; y: number; id: string } | null>(null);
  const [messageMenuPos, setMessageMenuPos] = useState<{ x: number; y: number; index: number } | null>(null);
  const [replyTo, setReplyTo] = useState<{ conversationId: string; index: number; text: string } | null>(null);

  useState(() => setSelectedConversationId(conversations[0]?.id ?? null));

  const filtered = conversations.filter((c) => {
    if (filter === "unread") return c.unread && !c.archived;
    if (filter === "archived") return c.archived;
    return !c.archived;
  });

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId) ?? filtered[0] ?? null;

  const formatConversationDateLabel = (dateStr?: string) => {
    if (!dateStr) return "";
    // expected format: dd/MM/yyyy
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const [d, m, y] = parts;
      const dt = new Date(Number(y), Number(m) - 1, Number(d));
      try {
        return dt.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
      } catch (e) {
        return dateStr;
      }
    }
    return dateStr;
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: false } : c)));
  };

  const handleSendMessage = () => {
    if (!selectedConversation || !messageText.trim()) return;
    const next = conversations.map((c) =>
      c.id === selectedConversation.id
        ? { ...c, messages: [...c.messages, { from: "patient", text: messageText }], lastMessage: messageText }
        : c,
    );
    setConversations(next);
    setMessageText("");
    setReplyTo(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleArchiveConversation = (id: string) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, archived: true } : c)));
    if (selectedConversationId === id) {
      setSelectedConversationId(null);
    }
  };

  const toggleEmoji = (emoji: string) => setMessageText((t) => t + emoji);

  useEffect(() => {
    const handleDocumentPointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const isConvMenuButton = target?.closest('[data-menu="conv-menu-button"]');
      const isConvMenuContent = target?.closest('[data-menu="conv-menu-content"]');
      if (convMenuPos && !isConvMenuButton && !isConvMenuContent) {
        setConvMenuPos(null);
      }

      const isMessageMenuButton = target?.closest('[data-menu="msg-menu-button"]');
      const isMessageMenuContent = target?.closest('[data-menu="msg-menu-content"]');
      if (messageMenuPos && !isMessageMenuButton && !isMessageMenuContent) {
        setMessageMenuPos(null);
      }

      const isEmojiButton = target?.closest('[data-menu="emoji-button"]');
      const isEmojiContent = target?.closest('[data-menu="emoji-content"]');
      if (showEmojiPicker && !isEmojiButton && !isEmojiContent) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentPointerDown);
    return () => document.removeEventListener("mousedown", handleDocumentPointerDown);
  }, [convMenuPos, messageMenuPos, showEmojiPicker]);

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)_280px]">
        <aside className="rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Mensagens</h2>
            <div className="mt-4 flex items-center gap-5 text-sm font-medium text-gray-500">
              <button onClick={() => setFilter("all")} className={`pb-2 ${filter === "all" ? "border-b-2 border-emerald-500 text-gray-900" : ""}`}>Todas</button>
              <button onClick={() => setFilter("unread")} className={`pb-2 ${filter === "unread" ? "border-b-2 border-emerald-500 text-gray-900" : ""}`}>Não lidas <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs">{conversations.filter((c) => c.unread && !c.archived).length}</span></button>
              <button onClick={() => setFilter("archived")} className={`pb-2 ${filter === "archived" ? "border-b-2 border-emerald-500 text-gray-900" : ""}`}>Arquivadas</button>
            </div>
          </div>
          <div className="overflow-visible">
            {filtered.map((conversation) => (
              <div key={conversation.id} className={`relative flex w-full items-start gap-3 border-b border-gray-100 px-4 py-4 text-left transition-colors ${selectedConversation?.id === conversation.id ? "bg-emerald-50/60" : "hover:bg-gray-50"}`}>
                <button onClick={() => handleSelectConversation(conversation.id)} className="flex items-start gap-3 w-full text-left">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-semibold ${getNutritionistAvatarStyle(conversation.nutritionist.name)}`}>
                    {conversation.nutritionist.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-gray-900">{conversation.nutritionist.name}</p>
                      <span className="shrink-0 text-xs text-gray-500">{conversation.date}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{conversation.lastMessage}</p>
                  </div>
                </button>
                <div className="absolute right-1 top-2 flex pr-0">
                  <button
                    data-menu="conv-menu-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      setConvMenuPos(convMenuPos && convMenuPos.id === conversation.id ? null : { x: rect.right, y: rect.bottom + 6, id: conversation.id });
                    }}
                    className="inline-flex items-center justify-center h-8 w-8 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  {convMenuPos && convMenuPos.id === conversation.id && (
                    <div data-menu="conv-menu-content" className="absolute right-0 top-8 z-50 rounded-md bg-white shadow-lg ring-1 ring-black/5">
                      <button onClick={() => { 
                        setConversations((prev) => prev.map((c) => (c.id === conversation.id ? { ...c, archived: !c.archived } : c)));
                        setConvMenuPos(null); 
                      }} className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 whitespace-nowrap">
                        {conversation.archived ? "Desarquivar" : "Arquivar"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-col rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedConversation ? selectedConversation.nutritionist.name : "Selecione uma conversa"}</h3>
              <p className="text-sm text-gray-500">{selectedConversation ? `Conversa ativa · ${selectedConversation.nutritionist.location}` : ""}</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col bg-[#f7f7f7]">
            {selectedConversation ? (
              <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
                <div className="mx-auto w-fit rounded-full bg-white px-3 py-1 text-xs text-gray-500 shadow-sm">{selectedConversation ? formatConversationDateLabel(selectedConversation.date) : ""}</div>
                {selectedConversation.messages.map((message, index) => {
                  const isPatient = message.from === "patient";
                  const isReplyingToThis = replyTo && replyTo.conversationId === selectedConversation.id && replyTo.index === index;
                  return (
                    <div key={`${selectedConversation.id}-${index}`} className={`flex items-start gap-3 ${isPatient ? "justify-end" : "justify-start"}`}>
                      {!isPatient && (
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold ${getNutritionistAvatarStyle(selectedConversation.nutritionist.name)}`}>
                          {selectedConversation.nutritionist.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                        </div>
                      )}

                      <div className={`flex-1 ${isPatient ? "max-w-[60%] text-right" : ""}`}>
                          <div className={`rounded-2xl bg-white px-4 py-3 shadow-sm relative ${isReplyingToThis ? "ring-2 ring-emerald-300" : ""}`}>
                          {!isPatient && <div className="mb-1 text-sm font-semibold text-gray-900">{selectedConversation.nutritionist.name}</div>}
                          {isPatient && <div className="mb-1 text-sm font-semibold text-gray-900">Você</div>}
                          <p className="text-sm leading-6 text-gray-700">{message.text}</p>
                          <div className="absolute -top-1 -right-1">
                            {!isPatient && (
                              <>
                                <button data-menu="msg-menu-button" onClick={(e) => { e.stopPropagation(); const rect = (e.target as HTMLElement).getBoundingClientRect(); setMessageMenuPos(messageMenuPos && messageMenuPos.index === index ? null : { x: rect.right - 8, y: rect.bottom + 8, index }); }} className="inline-flex items-center justify-center h-8 w-8 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all"><MoreVertical className="h-5 w-5" /></button>
                                {messageMenuPos && messageMenuPos.index === index && (
                                  <div data-menu="msg-menu-content" className="absolute right-0 top-6 z-50 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                    <button onClick={() => { setReplyTo({ conversationId: selectedConversation.id, index, text: message.text }); setMessageMenuPos(null); }} className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Responder</button>
                                    <button onClick={() => { navigator.clipboard?.writeText(message.text); setMessageMenuPos(null); }} className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Copiar</button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {isPatient && (
                        <div className="h-12 w-12 overflow-hidden rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center justify-center">
                          {patientProfile.profileImageUrl ? (
                            <img src={patientProfile.profileImageUrl} alt={patientProfile.name} className="h-full w-full object-cover" />
                          ) : (
                            patientProfile.name.split(" ").map((s) => s[0]).slice(0,2).join("")
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">Selecione uma conversa para ver as mensagens.</div>
            )}

            <div className="border-t border-gray-200 bg-white px-4 py-4">
              <div className="flex items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 py-3 shadow-sm">
                <div className="relative">
                  <button data-menu="emoji-button" onClick={() => setShowEmojiPicker((s) => !s)} className="text-gray-400 hover:text-gray-600"><Smile className="h-5 w-5" /></button>
                  {showEmojiPicker && (
                    <div data-menu="emoji-content" className="absolute bottom-10 left-0 z-20 grid w-44 grid-cols-6 gap-1 rounded bg-white p-2 shadow">
                      {["😀","😁","👍","❤️","🔥","😅","😮","😢","👏","🙌"].map((em) => (
                        <button key={em} onClick={() => toggleEmoji(em)} className="p-1 text-lg">{em}</button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  {replyTo && <div className="mb-2 flex items-center justify-between rounded bg-emerald-50 px-3 py-2 text-sm text-gray-700">Respondendo: <span className="font-semibold truncate">{replyTo.text}</span> <button onClick={() => setReplyTo(null)} className="ml-2 text-gray-500">✕</button></div>}
                  <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyDown={handleKeyDown} className="min-h-[56px] w-full resize-none border-0 p-0 text-sm outline-none placeholder:text-gray-400" placeholder="Sua mensagem" />
                </div>
                <button onClick={handleSendMessage} className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white">➤</button>
              </div>
            </div>
          </div>
        </section>

        <aside className="min-w-0 rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">Detalhes</h3>
          </div>
          <div className="p-6 text-left">
            {selectedConversation ? (
              <div className="space-y-4">
                <div className={`mx-auto flex h-32 w-32 items-center justify-center rounded-2xl p-2 shadow-sm ${getNutritionistAvatarStyle(selectedConversation.nutritionist.name)}`}>
                  <div className="text-3xl font-bold">{selectedConversation.nutritionist.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">{selectedConversation.nutritionist.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{selectedConversation.nutritionist.attendance} · {selectedConversation.nutritionist.location}</p>
                </div>

                <div className="rounded-lg border border-gray-100 bg-white p-4 text-sm text-gray-700">
                  <p><strong>Especialidades:</strong> {selectedConversation.nutritionist.tags.join(", ")}</p>
                  <p className="mt-2"><strong>Telefone:</strong> {selectedConversation.nutritionist.phone}</p>
                  <p className="mt-2"><strong>Atendimento:</strong> {selectedConversation.nutritionist.attendance}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-gray-900">R$ {selectedConversation.nutritionist.price} por consulta</p>
                  <button className="rounded-xl bg-emerald-700 px-4 py-2 font-semibold text-white">Agendar</button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Selecione uma conversa para ver detalhes.</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

const PatientMealsContent = () => {
  const meals = sampleMeals;
  const p = sampleProgress;
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const caloriePercent = Math.min(100, Math.round((p.todayCalories / p.calorieGoal) * 100));

  const getMealDetails = (id: string) => {
    // Mock detailed data per meal id
    if (id === "m1") {
      return {
        calories: 350,
        protein: 25,
        carbs: 30,
        fats: 10,
        items: [
          { name: "Ovos mexidos", qty: "3 unidades", kcal: 220 },
          { name: "Tomate", qty: "1 tomate", kcal: 30 },
          { name: "Café preto", qty: "1 xícara", kcal: 10 },
        ],
      };
    }
    if (id === "m2") {
      return {
        calories: 650,
        protein: 40,
        carbs: 80,
        fats: 20,
        items: [
          { name: "Frango grelhado", qty: "120 g", kcal: 300 },
          { name: "Arroz integral", qty: "1 porção", kcal: 200 },
          { name: "Salada", qty: "1 porção", kcal: 150 },
        ],
      };
    }
    // default
    return {
      calories: 220,
      protein: 15,
      carbs: 25,
      fats: 8,
      items: [
        { name: "Iogurte", qty: "1 pote", kcal: 120 },
        { name: "Castanhas", qty: "20 g", kcal: 100 },
      ],
    };
  };

  return (
    <div className="space-y-6">
      <Card className="border-emerald-100/80 bg-white/90">
        <CardHeader>
          <CardTitle>Progresso de calorias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Consumidas hoje</p>
              <p className="text-3xl font-semibold tracking-tight">{p.todayCalories} kcal</p>
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

      <Card className="border-emerald-100/80 bg-white/90">
        <CardHeader>
          <CardTitle>Minhas Refeições</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Nutritionist who created the plan */}
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold ${getNutritionistAvatarStyle(mockNutritionists[0].name)}`}>
                {mockNutritionists[0].name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
              </div>
              <div>
              <div className="font-semibold">{mockNutritionists[0].name}</div>
              <div className="text-sm text-muted-foreground">{mockNutritionists[0].tags?.join(", ")}</div>
            </div>
          </div>
          <div className="grid gap-3">
            {meals.map((m) => (
              <div key={m.id} className="rounded-lg border">
                <button
                  type="button"
                  onClick={() => setExpandedMeal(expandedMeal === m.id ? null : m.id)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{m.name}</div>
                      <div className="text-sm text-gray-600">{m.time} • {m.calories} kcal</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{expandedMeal === m.id ? 'Fechar' : 'Detalhes'}</div>
                </button>
                {expandedMeal === m.id && (() => {
                  const details = getMealDetails(m.id);
                  return (
                    <div className="mt-2 rounded-b-lg border-t bg-white">
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-lg font-semibold text-slate-900">{m.name}</div>
                            <div className="text-sm text-slate-600 mt-1">{m.time}</div>
                          </div>
                          <div className="text-sm text-slate-700">
                            <div className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 border border-emerald-100">{details.calories} kcal</div>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm">
                            <div className="text-xs text-slate-500">CALORIAS</div>
                            <div className="mt-1 text-lg font-semibold text-slate-900">{details.calories} kcal</div>
                          </div>
                          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm">
                            <div className="text-xs text-slate-500">PROTEÍNA</div>
                            <div className="mt-1 text-lg font-semibold text-slate-900">{details.protein} g</div>
                          </div>
                          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm">
                            <div className="text-xs text-slate-500">CARBS / GORDURAS</div>
                            <div className="mt-1 text-lg font-semibold text-slate-900">{details.carbs} g · {details.fats} g</div>
                          </div>
                        </div>

                        <div className="mt-4 rounded-lg border border-slate-100 bg-white">
                          <div className="px-4 py-3 text-xs font-medium text-slate-500 border-b border-slate-100">ALIMENTO <span className="ml-40">QUANTIDADE</span></div>
                          <div className="divide-y">
                            {details.items.map((it, idx) => (
                              <div key={idx} className="flex items-center justify-between px-4 py-3 text-sm">
                                <div className="text-slate-700">{it.name}</div>
                                <div className="text-slate-500">{it.qty}</div>
                                <div className="text-slate-500 ml-6">{it.kcal}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PatientSavedNutritionistsContent: React.FC = () => {
  const [savedIds, setSavedIds] = useState<string[]>(() => getSavedNutritionistIds());
  const [selectedNutritionist, setSelectedNutritionist] = useState<typeof mockNutritionists[number] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const savedNutritionists = mockNutritionists.filter((nutritionist) => savedIds.includes(nutritionist.id));

  const handleOpenProfile = (nutritionist: typeof mockNutritionists[number]) => {
    setSelectedNutritionist(nutritionist);
    setDialogOpen(true);
  };

  const handleFavoriteChange = (nutritionistId: string, nextFavorite: boolean) => {
    setSavedIds((current) => {
      const nextIds = setNutritionistSaved(nutritionistId, nextFavorite);
      return nextIds;
    });
  };

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {savedNutritionists.map((nutritionist) => (
          <div key={nutritionist.id} className="relative">
            <NutritionistCard nutritionist={nutritionist} onViewProfile={handleOpenProfile} />
            <button
              type="button"
              onClick={() => handleFavoriteChange(nutritionist.id, false)}
              className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm"
              aria-label={`Remover ${nutritionist.name} dos salvos`}
            >
              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
            </button>
          </div>
        ))}
      </div>

      <NutritionistProfileDialog
        nutritionist={selectedNutritionist}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isFavorited={selectedNutritionist ? savedIds.includes(selectedNutritionist.id) : false}
        onFavoriteChange={(nextFavorite) => {
          if (!selectedNutritionist) return;
          handleFavoriteChange(selectedNutritionist.id, nextFavorite);
          if (!nextFavorite) {
            setDialogOpen(false);
          }
        }}
      />
    </div>
  );
};

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>(() => getTabFromSearch(location.search) ?? "home");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const patientProfile = getPatientProfile(user);
  const patientInitials = patientProfile.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  useEffect(() => {
    const handleDocumentPointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target?.closest('[data-menu="profile-menu"]')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentPointerDown);
    return () => document.removeEventListener("mousedown", handleDocumentPointerDown);
  }, []);

  useEffect(() => {
    const nextTab = getTabFromSearch(location.search);
    if (nextTab) {
      setActiveTab(nextTab);
    } else if (location.pathname === "/patient/dashboard") {
      setActiveTab("home");
    }
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId as TabType);
  };

  const offsetTabs: TabType[] = ["find", "preanalysis", "consultations", "messages", "meals", "saved"];

  const contentClassName =
    activeTab === "home"
      ? "px-6 py-6 lg:pl-8 lg:pr-6 xl:pl-10 xl:pr-8 xl:py-8"
      : offsetTabs.includes(activeTab)
        ? "px-4 py-4 lg:pl-8 lg:pr-4 xl:pl-10"
        : "p-8";

  const headerClassName = offsetTabs.includes(activeTab)
    ? "border-b border-slate-200 bg-white/90 px-4 lg:pl-8 xl:pl-10 py-3 backdrop-blur"
    : "border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur";

  return (
    <div className="grid min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_34%),linear-gradient(180deg,_#fafafa_0%,_#f3f7f4_100%)] lg:grid-cols-[224px_minmax(0,1fr)]">
      <PatientSidebar />

      <main className={activeTab === "find" ? "w-full min-w-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_34%),linear-gradient(180deg,_#fafafa_0%,_#f3f7f4_100%)]" : "w-full min-w-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_34%),linear-gradient(180deg,_#fafafa_0%,_#f3f7f4_100%)]"}>
        {activeTab !== "home" && (
          <header className={headerClassName}>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900">
                {activeTab === "messages" && "Mensagens"}
                {activeTab === "meals" && "Minhas refeições"}
                {activeTab === "saved" && "Favoritos"}
                {activeTab === "find" && "Encontrar"}
                {activeTab === "consultations" && "Consultas"}
                {activeTab === "preanalysis" && "Pré-análise IA"}
              </h1>
              {/* Profile Avatar Dropdown */}
              <div className="relative" data-menu="profile-menu">
                <button
                  onClick={() => setProfileDropdownOpen((current) => !current)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 font-semibold text-white transition-shadow hover:shadow-lg"
                >
                  {patientProfile.profileImageUrl ? (
                    <img src={patientProfile.profileImageUrl} alt={patientProfile.name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    patientInitials || "P"
                  )}
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>
        )}

        {/* Tab Content */}
        <div className={`${contentClassName} w-full min-w-0`}>
          {activeTab === "home" && (
            <PatientHomeContent
              patientProfile={patientProfile}
              patientInitials={patientInitials}
              onOpenTab={handleTabClick}
              onLogout={handleLogout}
            />
          )}
          {activeTab === "find" && <NutritionistSearch showSidebar={false} embedded />}
          {activeTab === "consultations" && <PatientConsultations />}
          {activeTab === "preanalysis" && <PreAnalysis />}
          {activeTab === "messages" && <PatientMessagesContent patientProfile={patientProfile} />}
          {activeTab === "meals" && <PatientMealsContent />}
          {activeTab === "saved" && <PatientSavedNutritionistsContent />}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
