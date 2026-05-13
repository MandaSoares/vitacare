import React, { useEffect, useState } from "react";
import { sampleMeals, sampleProgress } from "@/lib/patientDashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Clock, Home, Heart, MessageSquare, Salad, Users, Smile, MoreVertical } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getPatientProfile } from "@/lib/patientProfileStore";
import NutritionistSearch, { NutritionistCard, getNutritionistAvatarStyle, mockNutritionists } from "./NutritionistSearch";
import NutritionistProfileDialog from "@/components/landing/NutritionistProfileDialog";
import { getSavedNutritionistIds, setNutritionistSaved } from "@/lib/savedNutritionistsStore";

type TabType = "home" | "messages" | "meals" | "saved";

interface SidebarItem {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

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
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_1fr_320px]">
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

        <section className="flex min-h-screen flex-col rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedConversation ? selectedConversation.nutritionist.name : "Selecione uma conversa"}</h3>
              <p className="text-sm text-gray-500">{selectedConversation ? `Conversa ativa · ${selectedConversation.nutritionist.location}` : ""}</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col bg-[#f7f7f7]">
            {selectedConversation ? (
              <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
                <div className="mx-auto w-fit rounded-full bg-white px-3 py-1 text-xs text-gray-500 shadow-sm">qua., abr. 29</div>
                {selectedConversation.messages.map((message, index) => {
                  const isPatient = message.from === "patient";
                  const isReplyingToThis = replyTo && replyTo.conversationId === selectedConversation.id && replyTo.index === index;
                  return (
                    <div key={`${selectedConversation.id}-${index}`} className={`flex items-start gap-3 ${isPatient ? "justify-end" : "justify-start"}`}>
                      {!isPatient && (
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold ${getNutritionistAvatarStyle(selectedConversation.nutritionist.name)}`}>
                          {selectedConversation.nutritionist.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                        </div>
                      )}

                      <div className={`flex-1 ${isPatient ? "max-w-[60%] text-right" : ""}`}>
                        <div className={`rounded-2xl bg-white px-4 py-3 shadow-sm relative ${isReplyingToThis ? "ring-2 ring-emerald-300" : ""}`}>
                          {!isPatient && <div className="mb-1 text-sm font-semibold text-gray-900">{selectedConversation.nutritionist.name}</div>}
                          {isPatient && <div className="mb-1 text-sm font-semibold text-gray-900">Você</div>}
                          <p className="text-sm leading-6 text-gray-700">{message.text}</p>
                          <div className="absolute -top-1 -right-1">
                            <button data-menu="msg-menu-button" onClick={(e) => { e.stopPropagation(); const rect = (e.target as HTMLElement).getBoundingClientRect(); setMessageMenuPos(messageMenuPos && messageMenuPos.index === index ? null : { x: rect.right - 8, y: rect.bottom + 8, index }); }} className="inline-flex items-center justify-center h-8 w-8 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all"><MoreVertical className="h-5 w-5" /></button>
                            {messageMenuPos && messageMenuPos.index === index && (
                              <div data-menu="msg-menu-content" className="absolute right-0 top-6 z-50 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                <button onClick={() => { setReplyTo({ conversationId: selectedConversation.id, index, text: message.text }); setMessageMenuPos(null); }} className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Responder</button>
                                <button onClick={() => { navigator.clipboard?.writeText(message.text); setMessageMenuPos(null); }} className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Copiar</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {isPatient && (
                        <div className="h-8 w-8 overflow-hidden rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center justify-center">
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

        <aside className="rounded-2xl border border-gray-200 bg-white">
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
  const caloriePercent = Math.min(100, Math.round((p.todayCalories / p.calorieGoal) * 100));

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
              <div key={m.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{m.name}</div>
                    <div className="text-sm text-gray-600">{m.time} • {m.calories} kcal</div>
                  </div>
                </div>
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
    <div className="space-y-4">
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
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const patientProfile = getPatientProfile(user);
  const patientInitials = patientProfile.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  const sidebarItems: SidebarItem[] = [
    { id: "home", label: "Início", icon: <Home className="h-5 w-5" /> },
    { id: "messages", label: "Mensagens", icon: <MessageSquare className="h-5 w-5" /> },
    { id: "meals", label: "Minhas refeições", icon: <Salad className="h-5 w-5" /> },
    { id: "saved", label: "Nutricionistas salvos", icon: <Users className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId as TabType);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white px-6 py-6">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
              V
            </div>
            <span className="text-lg font-bold text-gray-900">VitaCare</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-3">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-start gap-3 rounded-lg px-4 py-3 font-medium text-left transition-all ${
                  activeTab === item.id
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Header */}
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === "home" && "Encontre nutricionistas"}
              {activeTab === "messages" && "Mensagens"}
              {activeTab === "meals" && "Minhas refeições"}
              {activeTab === "saved" && "Nutricionistas salvos"}
            </h1>
            {/* Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-semibold hover:shadow-lg transition-shadow"
              >
                {patientProfile.profileImageUrl ? (
                  <img src={patientProfile.profileImageUrl} alt={patientProfile.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                  patientInitials || "P"
                )}
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="border-b border-gray-200 px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{patientProfile.name}</p>
                    <p className="text-xs text-gray-600">{patientProfile.email}</p>
                  </div>
                  <Link to="/patient/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileDropdownOpen(false)}>
                    Editar perfil
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === "home" && <NutritionistSearch />}
          {activeTab === "messages" && <PatientMessagesContent patientProfile={patientProfile} />}
          {activeTab === "meals" && <PatientMealsContent />}
          {activeTab === "saved" && <PatientSavedNutritionistsContent />}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
