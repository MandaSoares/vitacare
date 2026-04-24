import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, ArrowLeft, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, ShieldCheck, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Informe seu email.").email("Informe um email válido."),
  password: z.string().min(1, "Informe sua senha."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const dualRoleEmails = new Set(["nutri.paciente@vitacare.com", "dual@vitacare.com"]);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [accountChoiceOpen, setAccountChoiceOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async () => {
    const email = getValues("email").trim().toLowerCase();

    if (dualRoleEmails.has(email)) {
      setPendingEmail(email);
      setAccountChoiceOpen(true);
      return;
    }

    toast.success("Formulário validado", {
      description: "Os dados informados estão prontos para autenticação.",
    });
  };

  const handleAccountChoice = (role: "patient" | "nutritionist") => {
    const roleLabel = role === "patient" ? "paciente" : "nutricionista";

    toast.success(`Entrando como ${roleLabel}`, {
      description: `Usando a conta vinculada a ${pendingEmail}.`,
    });

    setAccountChoiceOpen(false);
    setPendingEmail("");
  };

  return (
    <>
      <Dialog open={accountChoiceOpen} onOpenChange={setAccountChoiceOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Escolha como deseja entrar</DialogTitle>
            <DialogDescription>
              Encontramos um email que pode acessar as contas de paciente e nutricionista.
              Selecione o perfil que deseja usar nesta entrada.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleAccountChoice("patient")}
              className="flex min-h-32 flex-col items-start justify-between rounded-2xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </span>
              <div className="mt-6 space-y-1">
                <p className="font-semibold text-foreground">Entrar como paciente</p>
                <p className="text-sm text-muted-foreground">Acessar a jornada, histórico e acompanhamento.</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleAccountChoice("nutritionist")}
              className="flex min-h-32 flex-col items-start justify-between rounded-2xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div className="mt-6 space-y-1">
                <p className="font-semibold text-foreground">Entrar como nutricionista</p>
                <p className="text-sm text-muted-foreground">Acessar o painel profissional e os atendimentos.</p>
              </div>
            </button>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAccountChoiceOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              <p className="text-sm text-white/75">Acompanhamento nutricional inteligente</p>
            </div>
          </div>

          <div className="max-w-md space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Bem-vindo de volta</p>
            <h1 className="text-4xl font-semibold leading-tight text-balance">
              Acesse sua conta para continuar seu acompanhamento.
            </h1>
            <p className="text-base leading-7 text-white/80">
              Entre para visualizar seus dados, progresso e orientações nutricionais em um unico painel.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Acesso", value: "Seguro" },
              { label: "Dados", value: "Centralizados" },
              { label: "Plano", value: "Personalizado" },
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
        <div className="w-full max-w-xl rounded-[2rem] border border-border/70 bg-background/95 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur sm:p-10">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>

          <header className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-balance text-[#293530]">
              Entrar
            </h2>
            <p className="text-sm text-muted-foreground">
              Use seu email e senha para acessar sua conta.
            </p>
          </header>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  aria-invalid={errors.email ? "true" : "false"}
                  className="h-12 pl-10"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-xs font-medium text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password">Senha</Label>
                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="sua senha"
                  autoComplete="current-password"
                  aria-invalid={errors.password ? "true" : "false"}
                  className="h-12 px-10 pr-12"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs font-medium text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="h-12 w-full rounded-xl" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Nao tem conta?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </main>
      </div>
    </>
  );
};

export default Login;
