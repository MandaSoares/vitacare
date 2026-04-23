import { useState } from "react";

import { Activity, ArrowLeft, Check, Stethoscope, User } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const steps = ["", "", "", ""];

const profiles = [
  {
    icon: User,
    key: "patient",
    title: "Paciente",
    description: "Buscar nutricionistas e acompanhamento",
  },
  {
    icon: Stethoscope,
    key: "nutritionist",
    title: "Nutricionista",
    description: "Gerenciar pacientes e consultas",
  },
];

const Register = () => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const canProceed = selectedProfile !== null;
  const totalSteps = 4;

  const handleNext = () => {
    if (!canProceed) {
      return;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="relative hidden overflow-hidden bg-[#1d6946] text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.1),transparent_28%),radial-gradient(circle_at_80%_74%,rgba(255,255,255,0.12),transparent_24%)]" />

        <div className="relative flex h-full flex-col justify-between px-14 py-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight">VitaCare</p>
              <p className="text-sm text-white/75">Cadastro de cliente e nutricionista</p>
            </div>
          </div>

          <div className="max-w-md space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Crie sua conta</p>
            <h1 className="text-4xl font-semibold leading-tight text-balance">
              Comece agora seu cuidado nutricional com estrutura e praticidade.
            </h1>
            <p className="text-base leading-7 text-white/80">
              Cadastre-se para acessar planos personalizados, acompanhar sua evolucao e manter sua rotina alimentar organizada.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Conta", value: "Rapida" },
              { label: "Perfil", value: "Personalizado" },
              { label: "Jornada", value: "Guiada" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/60">{item.label}</p>
                <p className="mt-2 text-sm font-medium text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-10">
        <div className="w-full max-w-md lg:max-w-[520px]">
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>

          <div className="mb-8">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    index <= currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          <header className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-balance text-[#293530]">
              Como deseja continuar?
            </h2>
            <p className="text-sm text-muted-foreground">
              Escolha seu perfil para prosseguir.
            </p>
          </header>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {profiles.map(({ icon: Icon, key, title, description }) => {
              const isSelected = selectedProfile === key;

              return (
              <button
                key={title}
                type="button"
                onClick={() => setSelectedProfile(key)}
                aria-pressed={isSelected}
                className={`group flex min-h-[116px] flex-col items-center justify-center rounded-2xl border px-5 py-6 text-center shadow-[0_12px_30px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.06)] ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/25"
                    : "border-border/80 bg-background hover:border-primary/30"
                }`}
                data-selected={isSelected}
              >
                <span
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {title}
                </span>
                <span className="mt-1 max-w-[150px] text-xs leading-5 text-muted-foreground">
                  {description}
                </span>
              </button>
              );
            })}
          </div>

          <Button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            className="mt-6 h-12 w-full rounded-xl bg-[#1d6946] text-white shadow-none hover:bg-[#165637] disabled:cursor-not-allowed disabled:bg-[#7f9a8a]"
          >
            <Check className="mr-2 h-4 w-4" />
            Próximo
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Register;
