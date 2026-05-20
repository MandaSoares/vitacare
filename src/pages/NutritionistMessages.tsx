import { useEffect, useState, type KeyboardEvent } from "react";
import { MoreVertical, Smile } from "lucide-react";
import { NutritionistSidebar } from "@/components/layout/NutritionistSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { mockPatients } from "@/lib/patients";
import { getNutritionistInitials, getNutritionistProfile } from "@/lib/nutritionistProfileStore";

interface Message {
  from: "nutri" | "patient";
  text: string;
}

interface Conversation {
  id: string;
  patientId: string;
  patient: typeof mockPatients[0];
  unread: boolean;
  archived: boolean;
  date: string;
  lastMessage: string;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    patientId: "1",
    patient: mockPatients[0],
    unread: true,
    archived: false,
    date: "29/04/2026",
    lastMessage: "Posso ajustar o plano para encaixar os horários do trabalho?",
    messages: [
      { from: "patient", text: "Posso ajustar o plano para encaixar os horários do trabalho?" },
      { from: "nutri", text: "Claro, posso adaptar o plano para você." },
    ],
  },
  {
    id: "2",
    patientId: "4",
    patient: mockPatients[3],
    unread: false,
    archived: true,
    date: "27/04/2026",
    lastMessage: "Obrigado pela orientação.",
    messages: [
      { from: "patient", text: "Obrigado pela orientação." },
    ],
  },
];

const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

const NutritionistMessages = () => {
  const { user } = useAuth();
  const nutritionistProfile = getNutritionistProfile(user);
  const nutritionistAvatarUrl = nutritionistProfile.profileImageUrl.trim() || undefined;
  const nutritionistInitials = getNutritionistInitials(nutritionistProfile.name) || "N";
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(mockConversations[0]?.id ?? null);
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [convMenuPos, setConvMenuPos] = useState<{ x: number; y: number; id: string } | null>(null);
  const [messageMenuPos, setMessageMenuPos] = useState<{ x: number; y: number; index: number } | null>(null);
  const [conversations, setConversations] = useState(mockConversations);

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
        ? { ...c, messages: [...c.messages, { from: "nutri" as const, text: messageText }], lastMessage: messageText }
        : c,
    );
    setConversations(next);
    setMessageText("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
    <div className="flex h-screen bg-slate-50">
      <NutritionistSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm shadow-slate-100">
          <h1 className="text-lg font-semibold text-slate-900">Mensagens</h1>
        </header>

        <main className="grid min-h-0 flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[360px_1fr] lg:p-4">
          <aside className="min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-4">
              <h2 className="text-xl font-semibold text-slate-900">Mensagens</h2>
              <div className="mt-4 flex items-center gap-5 text-sm font-medium text-slate-500">
                <button onClick={() => setFilter("all")} className={`pb-2 ${filter === "all" ? "border-b-2 border-emerald-500 text-slate-900" : ""}`}>Todas</button>
                <button onClick={() => setFilter("unread")} className={`pb-2 ${filter === "unread" ? "border-b-2 border-emerald-500 text-slate-900" : ""}`}>Não lidas <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-xs">{conversations.filter((c) => c.unread && !c.archived).length}</span></button>
                <button onClick={() => setFilter("archived")} className={`pb-2 ${filter === "archived" ? "border-b-2 border-emerald-500 text-slate-900" : ""}`}>Arquivadas</button>
              </div>
            </div>
            <div className="overflow-auto">
              {filtered.map((conversation) => (
                <div key={conversation.id} className={`relative flex w-full items-start gap-3 border-b border-slate-100 px-4 py-4 text-left transition-colors ${selectedConversation?.id === conversation.id ? "bg-emerald-50/60" : "hover:bg-slate-50"}`}>
                  <button onClick={() => handleSelectConversation(conversation.id)} className="flex w-full items-start gap-3 text-left">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                      {getInitials(conversation.patient.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-slate-900">{conversation.patient.name}</p>
                        <span className="shrink-0 text-xs text-slate-500">{conversation.date}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{conversation.lastMessage}</p>
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
                      className="inline-flex h-8 w-8 items-center justify-center rounded text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    {convMenuPos && convMenuPos.id === conversation.id && (
                      <div data-menu="conv-menu-content" className="absolute right-0 top-8 z-50 rounded-md bg-white shadow-lg ring-1 ring-black/5">
                        <button onClick={() => { setConversations((prev) => prev.map((c) => (c.id === conversation.id ? { ...c, archived: !c.archived } : c))); setConvMenuPos(null); }} className="block w-full whitespace-nowrap px-4 py-2 text-left text-sm hover:bg-slate-50">
                          {conversation.archived ? "Desarquivar" : "Arquivar"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedConversation ? selectedConversation.patient.name : "Selecione uma conversa"}
                </h3>
                <p className="text-sm text-slate-500">
                  {selectedConversation ? `Conversa ativa · ${selectedConversation.patient.notes ?? "Paciente"}` : ""}
                </p>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col bg-[#f7f7f7]">
              {selectedConversation ? (
                <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
                  <div className="mx-auto w-fit rounded-full bg-white px-3 py-1 text-xs text-slate-500 shadow-sm">qua., abr. 29</div>
                  {selectedConversation.messages.map((message, index) => {
                    const isNutri = message.from === "nutri";
                    return (
                      <div key={`${selectedConversation.id}-${index}`} className={`flex items-start gap-3 ${isNutri ? "justify-end" : "justify-start"}`}>
                        {!isNutri && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                            {getInitials(selectedConversation.patient.name)}
                          </div>
                        )}

                        <div className={`flex-1 ${isNutri ? "max-w-[60%] text-right" : "max-w-[60%] text-left"}`}>
                          <div
                            className={`relative rounded-2xl px-4 py-3 pr-4 shadow-sm ${
                              isNutri ? "bg-white" : "bg-white"
                            }`}
                          >
                            {!isNutri && <div className="mb-1 text-sm font-semibold text-slate-900">{selectedConversation.patient.name}</div>}
                            {isNutri && <div className="mb-1 ml-auto w-fit pr-1 text-sm font-semibold text-slate-900">Você</div>}
                            <p className={`text-sm leading-6 ${isNutri ? "text-right text-slate-700" : "text-left text-slate-700"}`}>{message.text}</p>
                          </div>
                        </div>

                        {isNutri && (
                          <div className="flex h-8 w-8 overflow-hidden rounded-full bg-orange-100 font-semibold text-orange-700">
                            {nutritionistAvatarUrl ? (
                              <img
                                src={nutritionistAvatarUrl}
                                alt={nutritionistProfile.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center">{nutritionistInitials}</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">Selecione uma conversa para ver as mensagens.</div>
              )}

              <div className="border-t border-slate-200 bg-white px-4 py-4">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
                  <div className="relative">
                    <button data-menu="emoji-button" onClick={() => setShowEmojiPicker((s) => !s)} className="text-slate-400 hover:text-slate-600">
                      <Smile className="h-5 w-5" />
                    </button>
                    {showEmojiPicker && (
                      <div data-menu="emoji-content" className="absolute bottom-10 left-0 z-20 grid w-44 grid-cols-6 gap-1 rounded bg-white p-2 shadow">
                        {["😀", "😁", "👍", "❤️", "🔥", "😅", "😮", "😢", "👏", "🙌"].map((em) => (
                          <button key={em} onClick={() => toggleEmoji(em)} className="p-1 text-lg">
                            {em}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="min-h-[56px] w-full resize-none border-0 p-0 text-sm outline-none placeholder:text-slate-400"
                      placeholder="Sua mensagem"
                    />
                  </div>
                  <button onClick={handleSendMessage} className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
                    ➤
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default NutritionistMessages;
