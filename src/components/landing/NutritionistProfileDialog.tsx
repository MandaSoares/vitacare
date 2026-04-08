import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Heart, Send, CalendarCheck, CheckCircle, Users, Baby, ExternalLink, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
export type Nutritionist = {
  name: string;
  crn: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  avatar: string;
  tags: string[];
  attendance: string;
  formations?: string[];
  plans?: string[];
  availability?: { day: string; hours: string }[];
  phone?: string;
};
type Props = {
  nutritionist: Nutritionist | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
const NutritionistProfileDialog = ({ nutritionist, open, onOpenChange }: Props) => {
  const [activeTab, setActiveTab] = useState("experiencia");
  const [showPhone, setShowPhone] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  if (!nutritionist) return null;
  const requireAuth = (callback: () => void) => {
    if (!user) {
      onOpenChange(false);
      navigate("/auth");
    } else {
      callback();
    }
  };
  const services = [
    { name: "Primeira consulta Nutrição", price: nutritionist.price },
    { name: "Retorno nutricional", price: Math.round(nutritionist.price * 0.6) },
    { name: "Plano alimentar personalizado", price: Math.round(nutritionist.price * 1.2) },
    { name: "Bioimpedância", price: null },
  ];
  const formations = nutritionist.formations || [
    "Graduação em Nutrição – Universidade Federal",
    "Pós-graduação em Nutrição Clínica e Funcional",
  ];
  const plans = nutritionist.plans || [
    "Unimed", "Bradesco Saúde", "SulAmérica",
  ];
  const availability = nutritionist.availability || [
    { day: "Segunda-feira", hours: "08:00 – 12:00 / 14:00 – 18:00" },
    { day: "Terça-feira", hours: "08:00 – 12:00 / 14:00 – 18:00" },
    { day: "Quarta-feira", hours: "08:00 – 12:00" },
    { day: "Quinta-feira", hours: "08:00 – 12:00 / 14:00 – 18:00" },
    { day: "Sexta-feira", hours: "08:00 – 12:00" },
  ];
  const phone = nutritionist.phone || "(11) 98765-4321";
  const reviews = [
    {
      initials: "M",
      name: "M.Silva",
      text: "Excelente profissional, muito atenciosa e detalhista. Recomendo!",
      date: "12 de março de 2026",
      rating: 5,
    },
    {
      initials: "A",
      name: "A.Costa",
      text: "Ótimo atendimento, me ajudou muito a melhorar minha alimentação.",
      date: "8 de março de 2026",
      rating: 5,
    },
  ];
  const hasPresencial = nutritionist.attendance.toLowerCase().includes("presencial");
  const handleGoogleMaps = () => {
    if (hasPresencial) {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(nutritionist.location)}`, "_blank");
    }
  };
  const handleFavorite = () => {
    requireAuth(() => {
      setIsFavorited(!isFavorited);
      toast({
        title: isFavorited ? "Removido dos favoritos" : "Adicionado aos favoritos",
        description: isFavorited
          ? `${nutritionist.name} foi removido(a) dos seus favoritos.`
          : `${nutritionist.name} foi salvo(a) nos seus favoritos.`,
      });
    });
  };
  const handleSubmitReview = () => {
    if (reviewRating === 0) {
      toast({ title: "Selecione uma nota", description: "Por favor, selecione de 1 a 5 estrelas.", variant: "destructive" });
      return;
    }
    toast({ title: "Opinião enviada!", description: "Obrigado pela sua avaliação." });
    setShowReviewForm(false);
    setReviewRating(0);
    setReviewText("");
  };
  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); setShowPhone(false); setShowReviewForm(false); }}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-2xl p-0 gap-0 [&]:scrollbar-thin [&]:scrollbar-thumb-border [&]:scrollbar-track-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&>button.absolute]:text-white [&>button.absolute]:bg-transparent [&>button.absolute]:rounded-none [&>button.absolute]:shadow-none [&>button.absolute]:hover:bg-transparent [&>button.absolute]:hover:text-white/80 [&>button.absolute]:hover:opacity-80 [&>button.absolute]:z-50 [&>button.absolute]:top-3 [&>button.absolute]:right-3 sm:rounded-2xl rounded-2xl">
        <div className="h-24 sm:h-28 bg-gradient-to-r from-primary/80 to-primary rounded-t-2xl relative overflow-hidden">
          <p className="absolute bottom-2 right-3 text-[10px] text-primary-foreground/50">Banner do profissional</p>
        </div>
        <div className="px-5 sm:px-6 pb-4 -mt-8 sm:-mt-10 relative">
          <DialogHeader>
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="relative shrink-0">
                <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-full bg-secondary border-4 border-background flex items-center justify-center">
                  <span className="text-lg sm:text-xl font-bold text-primary font-mono">
                    {nutritionist.avatar}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-primary flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                </div>
              </div>
              <div className="flex-1 min-w-0 pt-11 sm:pt-12 overflow-hidden">
                <div className="flex items-start justify-between gap-2">
                  <DialogTitle className="text-base sm:text-xl leading-tight truncate">{nutritionist.name}</DialogTitle>
                  <button
                    onClick={handleFavorite}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 mt-0.5 shrink-0"
                  >
                    <Heart className={`h-5 w-5 ${isFavorited ? "fill-destructive text-destructive" : ""}`} />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                  Nutricionista · {nutritionist.tags[0]}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                  <span className="truncate">{nutritionist.location}</span>
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                  Número de registro: {nutritionist.crn}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                          s <= Math.round(nutritionist.rating)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-primary underline cursor-pointer">
                    {nutritionist.reviews} opiniões
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-5">
            <Button
              size="lg"
              className="flex-1 rounded-xl gap-2 h-12 text-base sm:h-10 sm:text-sm"
              onClick={() => requireAuth(() => {
                toast({ title: "Agendamento", description: "Redirecionando para agendamento..." });
              })}
            >
              <CalendarCheck className="h-4 w-4" />
              Agendar consulta
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 rounded-xl gap-2 h-12 text-base sm:h-10 sm:text-sm"
              onClick={() => requireAuth(() => {
                toast({ title: "Chat", description: "Redirecionando para mensagens..." });
              })}
            >
              <Send className="h-4 w-4" />
              Enviar mensagem
            </Button>
          </div>
          <div className="flex items-start gap-3 mt-5 p-3 rounded-xl bg-secondary/50">
            <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Pacientes fiéis</p>
              <p className="text-xs text-muted-foreground">
                Pacientes deste especialista retornam para outras consultas.
              </p>
            </div>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-t border-b border-border">
            <TabsList className="w-full justify-start bg-transparent rounded-none h-auto p-0 px-2 sm:px-6 gap-0 overflow-x-auto flex-nowrap">
              {[
                { value: "experiencia", label: "Experiência" },
                { value: "servicos", label: "Serviços" },
                { value: "planos", label: "Planos" },
                { value: "consultorio", label: "Consultório" },
                { value: "opinioes", label: "Opiniões" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2.5 sm:px-4 py-3 text-xs sm:text-sm whitespace-nowrap shrink-0"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <TabsContent value="experiencia" className="p-4 sm:p-6 mt-0 space-y-5">
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Formação</p>
              <ul className="space-y-2">
                {formations.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Formada em Nutrição com especialização em {nutritionist.tags.join(", ")}.
              Atuo com foco na reeducação alimentar personalizada, buscando promover saúde e
              qualidade de vida através de uma abordagem humanizada e baseada em evidências científicas.
            </p>
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Experiência em:</p>
              <ul className="list-disc list-inside space-y-1">
                {nutritionist.tags.map((tag) => (
                  <li key={tag} className="text-sm text-foreground">{tag}</li>
                ))}
                <li className="text-sm text-foreground">Reeducação alimentar</li>
                <li className="text-sm text-foreground">Nutrição funcional</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Principais áreas de atuação</p>
              <div className="flex flex-wrap gap-2">
                {[...nutritionist.tags, "Reeducação Alimentar", "Nutrição Funcional"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Pacientes que atendo</p>
              <div className="space-y-1.5">
                <p className="text-sm text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" /> Adultos
                </p>
                <p className="text-sm text-foreground flex items-center gap-2">
                  <Baby className="h-4 w-4 text-muted-foreground" /> Crianças
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Formatos de consulta</p>
              <p className="text-sm text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {nutritionist.attendance}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="servicos" className="p-4 sm:p-6 mt-0 space-y-0">
            <h3 className="text-lg font-semibold text-foreground mb-4">Serviços e preços</h3>
            <div className="divide-y divide-border">
              {services.map((service) => (
                <div key={service.name} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{service.name}</p>
                    {service.price && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        R$ {service.price}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="rounded-full"
                    onClick={() => requireAuth(() => {
                      toast({ title: "Agendamento", description: `Agendando ${service.name}...` });
                    })}
                  >
                    Agendar consulta
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="planos" className="p-4 sm:p-6 mt-0 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Planos de saúde aceitos</h3>
            {plans.length > 0 ? (
              <div className="space-y-2">
                {plans.map((plan) => (
                  <div key={plan} className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{plan}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-secondary/50 text-center">
                <p className="text-sm text-muted-foreground">Este profissional não aceita planos de saúde.</p>
                <p className="text-xs text-muted-foreground mt-1">Apenas consultas particulares.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="consultorio" className="p-4 sm:p-6 mt-0 space-y-5">
            <h3 className="text-lg font-semibold text-foreground">Consultório</h3>
            <div>
              <p className="text-sm font-semibold text-foreground">Consultório Nutrição</p>
              <p className="text-sm text-muted-foreground mt-1">{nutritionist.location}</p>
              {hasPresencial && (
                <button
                  onClick={handleGoogleMaps}
                  className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer mt-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Ver no Google Maps
                </button>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Disponibilidade</p>
              <div className="space-y-2">
                {availability.map((slot) => (
                  <div key={slot.day} className="flex flex-col sm:flex-row sm:items-start sm:justify-between text-sm py-2 border-b border-border/50 last:border-0 gap-0.5 sm:gap-0">
                    <span className="font-medium text-foreground">{slot.day}</span>
                    <span className="text-muted-foreground sm:text-right text-xs sm:text-sm">{slot.hours}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Número de telefone</p>
              {showPhone ? (
                <p className="text-sm text-foreground mt-1">{phone}</p>
              ) : (
                <button
                  onClick={() => setShowPhone(true)}
                  className="text-sm text-primary hover:underline cursor-pointer mt-1"
                >
                  Mostrar número
                </button>
              )}
            </div>
          </TabsContent>
          <TabsContent value="opinioes" className="p-4 sm:p-6 mt-0 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Opiniões</h3>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => requireAuth(() => setShowReviewForm(true))}
              >
                Enviar opinião
              </Button>
            </div>
            {showReviewForm && (
              <div className="p-4 rounded-xl border border-border space-y-3">
                <p className="text-sm font-semibold text-foreground">Sua avaliação</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setReviewRating(s)}>
                      <Star
                        className={`h-6 w-6 cursor-pointer transition-colors ${
                          s <= reviewRating ? "fill-primary text-primary" : "text-muted-foreground/30 hover:text-primary/50"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Conte como foi sua experiência..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => { setShowReviewForm(false); setReviewRating(0); setReviewText(""); }}>
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSubmitReview}>
                    Enviar
                  </Button>
                </div>
              </div>
            )}
            <div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-5 w-5 ${
                      s <= Math.round(nutritionist.rating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {nutritionist.reviews} opiniões
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
              <CheckCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Todas as opiniões são importantes, por isso os especialistas não podem pagar para alterar ou excluir uma opinião.
              </p>
            </div>
            <div className="divide-y divide-border">
              {reviews.map((review, idx) => (
                <div key={idx} className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">{review.initials}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{review.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap">
                        Consulta verificada 
                      </span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            s <= review.rating ? "fill-primary text-primary" : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground mt-2">{review.text}</p>
                  <p className="text-xs text-muted-foreground mt-1.5">{review.date}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full rounded-xl gap-2">
              <MessageSquare className="h-4 w-4" />
              Ver todos os comentários
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
export default NutritionistProfileDialog;
