import { Activity, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="relative hidden overflow-hidden bg-[#1d6946] text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_26%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.12),transparent_22%)]" />

        <div className="relative flex h-full flex-col justify-between px-14 py-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight">VitaCare</p>
              <p className="text-sm text-white/70">Acompanhamento nutricional inteligente</p>
            </div>
          </div>

          <div className="max-w-md space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Bem-vindo de volta</p>
            <h1 className="text-4xl font-semibold leading-tight text-balance">
              Acesse sua conta para continuar seu acompanhamento.
            </h1>
            <p className="text-base leading-7 text-white/78">
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
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/55">{item.label}</p>
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

          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-balance">Entrar</h2>
            <p className="text-sm text-muted-foreground">Use seu email e senha para acessar sua conta.</p>
          </div>

          <form className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password">Senha</Label>
                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              <Input id="password" type="password" placeholder="Sua senha" />
            </div>

            <Button type="submit" className="h-12 w-full rounded-xl">
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
  );
};

export default Login;
