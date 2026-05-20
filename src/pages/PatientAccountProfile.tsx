import { useMemo, useRef, useState } from "react";

import { CalendarDays, CircleUserRound, Save, Sparkles } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { PatientSidebar } from "@/components/layout/PatientSidebar";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getPatientProfile, savePatientProfile, type PatientProfile } from "@/lib/patientProfileStore";

const fieldClassName = "rounded-2xl border-emerald-200 bg-white/90 shadow-sm focus-visible:ring-emerald-500";

const PatientAccountProfile = () => {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const profile = useMemo(() => getPatientProfile(user), [user]);
  const [formData, setFormData] = useState<PatientProfile>(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | undefined>(profile.profileImageUrl);
  const profileImageInputRef = useRef<HTMLInputElement | null>(null);

  if (!user || user.role !== "patient") {
    return <Navigate to="/patient/dashboard" replace />;
  }

  const updateField = <K extends keyof PatientProfile>(field: K, value: PatientProfile[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result ?? "");
      setImagePreview(url);
      setFormData((current) => ({ ...current, profileImageUrl: url }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const savedProfile = savePatientProfile(user, formData);
      signIn({
        token: window.localStorage.getItem("vitacare:token") ?? `auth-token-${savedProfile.email}`,
        user: {
          id: savedProfile.email,
          name: savedProfile.name,
          email: savedProfile.email,
          role: "patient",
        },
      });

      toast.success("Perfil atualizado", {
        description: "Seus dados cadastrais foram salvos com sucesso.",
      });

      navigate("/patient/dashboard");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(74,124,89,0.16),_transparent_28%),linear-gradient(180deg,_#f9faf6_0%,_#eef4ee_100%)] text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[224px_minmax(0,1fr)]">
        <PatientSidebar />

        <main className="min-w-0 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-4xl space-y-6">
            <Card className="border-emerald-100/80 bg-white/90 shadow-[0_18px_60px_rgba(23,51,30,0.08)] backdrop-blur-sm">
              <CardHeader className="space-y-3 border-b border-emerald-100/80 bg-gradient-to-r from-emerald-50/80 to-white">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
                    <CircleUserRound className="h-5 w-5" />
                  </span>
                  <div>
                    <CardTitle className="text-2xl tracking-tight">Editar perfil</CardTitle>
                    <CardDescription>Atualize seus dados cadastrais e informações de acompanhamento.</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-8 pt-6">
                <section className="grid gap-6 md:grid-cols-[220px_1fr] md:items-start">
                  <div className="space-y-3">
                    <div className="h-40 w-40 overflow-hidden rounded-3xl bg-emerald-100 shadow-sm">
                      {imagePreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imagePreview} alt="Foto de perfil" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-emerald-700">
                          {formData.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profileImage">Foto de perfil</Label>
                      <div className="flex items-center gap-2">
                        <input
                          id="profileImage"
                          ref={profileImageInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => handleImageChange(event.target.files?.[0])}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            profileImageInputRef.current?.click();
                          }}
                          className="rounded-full bg-emerald-700 px-4 py-2 text-white"
                        >
                          Trocar Foto
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input id="name" className={fieldClassName} value={formData.name} onChange={(event) => updateField("name", event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" className={fieldClassName} value={formData.email} onChange={(event) => updateField("email", event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" className={fieldClassName} value={formData.phone} onChange={(event) => updateField("phone", event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input id="cpf" className={fieldClassName} value={formData.cpf} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Data de nascimento</Label>
                      <Input id="birthDate" type="date" className={fieldClassName} value={formData.birthDate} onChange={(event) => updateField("birthDate", event.target.value)} />
                    </div>
                  </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input id="weight" type="number" className={fieldClassName} value={formData.weight} onChange={(event) => updateField("weight", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input id="height" type="number" className={fieldClassName} value={formData.height} onChange={(event) => updateField("height", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal">Objetivo</Label>
                    <Input id="goal" className={fieldClassName} value={formData.goal} onChange={(event) => updateField("goal", event.target.value)} />
                  </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="activityLevel">Atividade física</Label>
                    <Input id="activityLevel" className={fieldClassName} value={formData.activityLevel} onChange={(event) => updateField("activityLevel", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Alergias alimentares</Label>
                    <Input id="allergies" className={fieldClassName} value={formData.allergies} onChange={(event) => updateField("allergies", event.target.value)} />
                  </div>
                </section>

                <section className="space-y-2">
                  <Label htmlFor="conditions">Condições clínicas</Label>
                  <Textarea
                    id="conditions"
                    className={fieldClassName}
                    value={formData.conditions}
                    onChange={(event) => updateField("conditions", event.target.value)}
                    rows={4}
                  />
                </section>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" className="rounded-full border-emerald-200 px-5 text-emerald-800 hover:bg-emerald-50" onClick={() => navigate("/patient/dashboard")}>Cancelar</Button>
                  <Button
                    type="button"
                    className="rounded-full bg-emerald-700 px-5 text-white hover:bg-emerald-800"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientAccountProfile;