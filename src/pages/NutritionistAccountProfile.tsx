import { useMemo, useState, type ChangeEvent } from "react";

import { ArrowLeft, CalendarDays, Eye, ImagePlus, Save, Stethoscope, UserRound, X } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import NutritionistProfileDialog from "@/components/landing/NutritionistProfileDialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  bannerPresets,
  getNutritionistInitials,
  getNutritionistProfile,
  saveNutritionistProfile,
  type NutritionistProfile,
} from "@/lib/nutritionistProfileStore";

const fieldClassName = "rounded-2xl border-emerald-200 bg-white/90 shadow-sm focus-visible:ring-emerald-500";

const expertiseOptions = [
  "Clínica",
  "Doenças crônicas",
  "Reeducação alimentar",
  "Nutrição funcional",
  "Esportiva",
  "Vegetariana e vegana",
  "Pediatria",
  "Outra",
];

const healthPlansOptions = ["Unimed", "Bradesco Saúde", "SulAmérica", "Amil", "Particular", "Outra"];

const availabilityOptions = [
  "Nao disponivel",
  ...Array.from({ length: 17 }, (_, index) => {
    const startHour = 6 + index;
    const endHour = startHour + 1;
    return `${startHour.toString().padStart(2, "0")}:00 - ${endHour.toString().padStart(2, "0")}:00`;
  }),
];

const weekDayFields = [
  { field: "mondayAvailability", label: "Segunda-feira" },
  { field: "tuesdayAvailability", label: "Terça-feira" },
  { field: "wednesdayAvailability", label: "Quarta-feira" },
  { field: "thursdayAvailability", label: "Quinta-feira" },
  { field: "fridayAvailability", label: "Sexta-feira" },
  { field: "saturdayAvailability", label: "Sábado" },
  { field: "sundayAvailability", label: "Domingo" },
] as const;

type WeekDayField = (typeof weekDayFields)[number]["field"];

const formatAvailabilitySlots = (slots: string[]): string => {
  const validSlots = slots.filter(Boolean);

  if (validSlots.length === 0 || validSlots.includes("Nao disponivel")) {
    return "Sem atendimento";
  }

  return validSlots.join(" / ");
};

const NutritionistAccountProfile = () => {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const profile = useMemo(() => getNutritionistProfile(user), [user]);
  const [formData, setFormData] = useState<NutritionistProfile>(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(profile.profileImageUrl || "");

  if (!user || user.role !== "nutritionist") {
    return <Navigate to="/dashboard" replace />;
  }

  const updateField = <K extends keyof NutritionistProfile>(field: K, value: NutritionistProfile[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const toggleListSelection = (field: "expertise" | "acceptedPlans", value: string) => {
    setFormData((current) => {
      const currentValues = current[field];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return { ...current, [field]: nextValues };
    });
  };

  const toggleAvailabilitySlot = (dayField: WeekDayField, slot: string) => {
    setFormData((current) => {
      const currentSlots = current[dayField];

      if (slot === "Nao disponivel") {
        const nextSlots = currentSlots.length === 1 && currentSlots[0] === slot ? [] : [slot];
        return { ...current, [dayField]: nextSlots };
      }

      const filteredSlots = currentSlots.filter((item) => item !== "Nao disponivel");
      const nextSlots = filteredSlots.includes(slot)
        ? filteredSlots.filter((item) => item !== slot)
        : [...filteredSlots, slot];

      return { ...current, [dayField]: nextSlots };
    });
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result ?? "");
      setImagePreview(url);
      setFormData((current) => ({ ...current, profileImageUrl: url }));
    };
    reader.readAsDataURL(file);
  };

  const handleBannerChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result ?? "");
      setFormData((current) => ({ ...current, bannerPreset: "custom", customBannerImageUrl: url }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const savedProfile = saveNutritionistProfile(user, formData);

      signIn({
        token: window.localStorage.getItem("vitacare:token") ?? `auth-token-${savedProfile.email}`,
        user: {
          id: savedProfile.email,
          name: savedProfile.name,
          email: savedProfile.email,
          role: "nutritionist",
        },
      });

      toast.success("Perfil atualizado", {
        description: "Seu perfil profissional foi salvo com sucesso.",
      });

      navigate("/dashboard");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedBanner = formData.bannerPreset === "custom"
    ? null
    : bannerPresets.find((preset) => preset.id === formData.bannerPreset) ?? bannerPresets[0];

  const previewNutritionist = useMemo(() => {
    const initials = getNutritionistInitials(formData.name);

    return {
      name: formData.name,
      crn: formData.crn,
      location: `${formData.city}${formData.state ? `, ${formData.state}` : ""}`,
      rating: 4.9,
      reviews: 128,
      price: Number(formData.serviceFirst || 0),
      avatar: initials,
      avatarUrl: formData.profileImageUrl || undefined,
      tags: [...formData.expertise.filter((item) => item !== "Outra"), ...(formData.otherExpertise ? [formData.otherExpertise] : [])],
      attendance: formData.attendance,
      formations: [formData.formationPrimary, formData.formationSecondary].filter(Boolean),
      plans: [...formData.acceptedPlans.filter((item) => item !== "Outra"), ...(formData.otherPlan ? [formData.otherPlan] : [])],
      availability: weekDayFields.map((day) => ({ day: day.label, hours: formatAvailabilitySlots(formData[day.field]) })),
      phone: formData.phone,
      bannerImageUrl: formData.bannerPreset === "custom" ? formData.customBannerImageUrl || undefined : undefined,
      bio: formData.bio,
      patientTypes: [formData.careForAdults ? "Adultos" : null, formData.careForChildren ? "Crianças" : null].filter(Boolean) as string[],
      serviceFirst: formData.serviceFirst,
      serviceReturn: formData.serviceReturn,
      servicePlan: formData.servicePlan,
      serviceBioimpedance: formData.serviceBioimpedance,
    };
  }, [formData]);

  return (
    <div className="min-h-screen bg-[#f3f5f4] text-slate-900">
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(74,124,89,0.16),_transparent_28%),linear-gradient(180deg,_#f9faf6_0%,_#eef4ee_100%)] px-4 py-6 text-foreground md:px-8 md:py-8">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-900/70 transition-colors hover:text-emerald-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao painel
          </Link>

          <Card className="overflow-hidden border-emerald-100/80 bg-white/90 shadow-[0_18px_60px_rgba(23,51,30,0.08)] backdrop-blur-sm">
            <div className="relative h-52 overflow-hidden">
              {formData.bannerPreset === "custom" && formData.customBannerImageUrl ? (
                <img src={formData.customBannerImageUrl} alt="Banner do perfil" className="h-full w-full object-cover" />
              ) : (
                <div className={`h-full w-full ${selectedBanner?.className ?? bannerPresets[0].className}`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Perfil profissional</p>
              </div>
            </div>

            <CardContent className="space-y-8 p-6 md:p-8">
              <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
                    <div className="mx-auto flex h-52 w-full items-center justify-center overflow-hidden rounded-3xl bg-emerald-100/70">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Foto de perfil" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-emerald-700 text-4xl font-semibold">
                          {getNutritionistInitials(formData.name)}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 space-y-2">
                      <Label htmlFor="profileImage">Foto de perfil</Label>
                      <label
                        htmlFor="profileImage"
                        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-emerald-200 px-4 py-4 transition-colors hover:border-emerald-400"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          <ImagePlus className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-medium">Selecionar imagem</p>
                          <p className="text-xs text-muted-foreground">JPG ou PNG</p>
                        </div>
                      </label>
                      <Input id="profileImage" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Banner do perfil</Label>
                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                      {bannerPresets.map((preset) => {
                        const isSelected = formData.bannerPreset === preset.id;

                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => updateField("bannerPreset", preset.id)}
                            className={`h-24 rounded-2xl border p-2 text-left transition-all ${
                              isSelected ? "border-emerald-500 ring-2 ring-emerald-200" : "border-emerald-100"
                            }`}
                          >
                            <div className={`h-14 rounded-xl ${preset.className}`} />
                            <p className="mt-2 text-xs font-medium text-foreground">{preset.name}</p>
                          </button>
                        );
                      })}
                    </div>

                    <label
                      htmlFor="bannerImage"
                      className="mt-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-emerald-200 px-4 py-4 transition-colors hover:border-emerald-400"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <ImagePlus className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-medium">Enviar banner próprio</p>
                        <p className="text-xs text-muted-foreground">Substitui os banners prontos</p>
                      </div>
                    </label>

                    <Input id="bannerImage" type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
                  </div>
                </div>

                <div className="space-y-8">
                  <section className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input id="name" className={fieldClassName} value={formData.name} onChange={(event) => updateField("name", event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" className={fieldClassName} value={formData.email} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="crn">CRN</Label>
                      <Input id="crn" className={fieldClassName} value={formData.crn} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" className={fieldClassName} value={formData.phone} onChange={(event) => updateField("phone", event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Especialidade principal</Label>
                      <Input id="specialty" className={fieldClassName} value={formData.specialty} onChange={(event) => updateField("specialty", event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="attendance">Formato de consulta</Label>
                      <Input id="attendance" className={fieldClassName} value={formData.attendance} onChange={(event) => updateField("attendance", event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input id="state" className={fieldClassName} value={formData.state} onChange={(event) => updateField("state", event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input id="city" className={fieldClassName} value={formData.city} onChange={(event) => updateField("city", event.target.value)} />
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Descrição e formação</h3>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Descrição profissional</Label>
                      <Textarea id="bio" rows={4} className={fieldClassName} value={formData.bio} onChange={(event) => updateField("bio", event.target.value)} />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="formationPrimary">Formação principal</Label>
                        <Input id="formationPrimary" className={fieldClassName} value={formData.formationPrimary} onChange={(event) => updateField("formationPrimary", event.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="formationSecondary">Formação complementar</Label>
                        <Input id="formationSecondary" className={fieldClassName} value={formData.formationSecondary} onChange={(event) => updateField("formationSecondary", event.target.value)} />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Serviços e público</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="serviceFirst">Primeira consulta (R$)</Label>
                        <Input id="serviceFirst" className={fieldClassName} value={formData.serviceFirst} onChange={(event) => updateField("serviceFirst", event.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="serviceReturn">Retorno nutricional (R$)</Label>
                        <Input id="serviceReturn" className={fieldClassName} value={formData.serviceReturn} onChange={(event) => updateField("serviceReturn", event.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="servicePlan">Plano alimentar personalizado (R$)</Label>
                        <Input id="servicePlan" className={fieldClassName} value={formData.servicePlan} onChange={(event) => updateField("servicePlan", event.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="serviceBioimpedance">Bioimpedância</Label>
                        <Input id="serviceBioimpedance" className={fieldClassName} value={formData.serviceBioimpedance} onChange={(event) => updateField("serviceBioimpedance", event.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Principais áreas de atuação</Label>
                      <div className="flex flex-wrap gap-2">
                        {expertiseOptions.map((option) => {
                          const isActive = formData.expertise.includes(option);

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => toggleListSelection("expertise", option)}
                              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                                isActive
                                  ? "border-emerald-700 bg-emerald-700 text-white"
                                  : "border-emerald-200 bg-white text-foreground hover:border-emerald-400"
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                      {formData.expertise.includes("Outra") && (
                        <Input
                          className={fieldClassName}
                          placeholder="Descreva a outra área de atuação"
                          value={formData.otherExpertise}
                          onChange={(event) => updateField("otherExpertise", event.target.value)}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Planos de saúde aceitos</Label>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {healthPlansOptions.map((plan) => (
                          <label key={plan} className="flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm">
                            <Checkbox checked={formData.acceptedPlans.includes(plan)} onCheckedChange={() => toggleListSelection("acceptedPlans", plan)} />
                            {plan}
                          </label>
                        ))}
                      </div>
                      {formData.acceptedPlans.includes("Outra") && (
                        <Input
                          className={fieldClassName}
                          placeholder="Digite o nome do outro plano"
                          value={formData.otherPlan}
                          onChange={(event) => updateField("otherPlan", event.target.value)}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Pacientes que atendo</Label>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <label className="flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm">
                          <Checkbox checked={formData.careForAdults} onCheckedChange={(checked) => updateField("careForAdults", checked === true)} />
                          Adultos
                        </label>
                        <label className="flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm">
                          <Checkbox checked={formData.careForChildren} onCheckedChange={(checked) => updateField("careForChildren", checked === true)} />
                          Crianças
                        </label>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Horários por semana</h3>
                    <div className="space-y-3">
                      {weekDayFields.map((day) => {
                        const selectedSlots = formData[day.field];

                        return (
                          <div key={day.field} className="space-y-2 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                              <Label>{day.label}</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button type="button" variant="outline" className="rounded-full border-emerald-200 px-4 text-emerald-800 hover:bg-emerald-50">
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    Selecionar horários
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 p-3" align="end">
                                  <div className="space-y-2">
                                    {availabilityOptions.map((option) => {
                                      const isChecked = selectedSlots.includes(option);
                                      const isUnavailable = option === "Nao disponivel";

                                      return (
                                        <label key={option} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-emerald-50">
                                          <Checkbox checked={isChecked} onCheckedChange={() => toggleAvailabilitySlot(day.field, option)} />
                                          <span className={isUnavailable ? "font-medium" : ""}>{isUnavailable ? "Não disponível" : option}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>

                            {selectedSlots.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {selectedSlots.map((slot) => (
                                  <Badge key={`${day.field}-${slot}`} variant="secondary" className="gap-1.5 pr-1">
                                    {slot === "Nao disponivel" ? "Não disponível" : slot}
                                    <button
                                      type="button"
                                      onClick={() => toggleAvailabilitySlot(day.field, slot)}
                                      className="rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                                      aria-label={`Remover horário ${slot}`}
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Nenhum horário selecionado.</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </section>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-emerald-300 bg-white px-5 text-emerald-900 shadow-sm transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-950 focus-visible:ring-emerald-500"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancelar
                </Button>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-emerald-300 bg-white px-5 text-emerald-900 shadow-sm transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-950 focus-visible:ring-emerald-500"
                    onClick={() => setIsPreviewOpen(true)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar como paciente
                  </Button>
                  <Button type="button" className="rounded-full bg-emerald-700 px-5 text-white hover:bg-emerald-800" onClick={handleSave} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <NutritionistProfileDialog
          nutritionist={previewNutritionist}
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
        />
      </main>
    </div>
  );
};

export default NutritionistAccountProfile;
