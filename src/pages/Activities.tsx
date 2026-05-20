import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, TrendingUp, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NutritionistSidebar } from "@/components/layout/NutritionistSidebar";

const activitiesByDate = {
  'Hoje - 24 de Maio': [
    { id: 'a1', title: 'Novo paciente cadastrado', subtitle: 'Carlos Mendes', tag: 'Novo paciente', time: 'há 2h' },
    { id: 'a2', title: 'Plano criado', subtitle: 'João Silva · Plano de Emagrecimento', tag: 'Plano criado', time: 'há 6h' },
  ],
  'Ontem - 23 de Maio': [
    { id: 'b1', title: 'Plano concluído', subtitle: 'Ana Costa · Plano de Reeducação Alimentar', tag: 'Plano concluído', time: 'há 1d' },
  ],
  '20 de Maio': [
    { id: 'c1', title: 'Plano criado', subtitle: 'Mariana Oliveira · Plano de Hipertrofia', tag: 'Plano criado', time: 'há 2d' },
    { id: 'c2', title: 'Mensagem enviada', subtitle: 'Para: Pedro Almeida', tag: 'Mensagem enviada', time: 'há 2d' },
  ],
};

const Activities: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f3f5f4] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[224px_minmax(0,1fr)]">
        <NutritionistSidebar />

        <main className="px-6 py-8 lg:pl-12">
          <div className="w-full space-y-6">
            <header>
              <h1 className="text-3xl font-bold text-slate-900">Atividade Recente</h1>
              <p className="mt-1 text-sm text-slate-500">Histórico completo de ações na plataforma</p>
            </header>

            <div className="grid grid-cols-3 gap-4">
              <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
                <CardContent className="p-5">
                  <p className="text-sm text-slate-500">Atividades hoje</p>
                  <p className="mt-2 text-3xl font-bold">5</p>
                  <p className="text-sm text-slate-400">Total de ações realizadas</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
                <CardContent className="p-5">
                  <p className="text-sm text-slate-500">Planos criados</p>
                  <p className="mt-2 text-3xl font-bold">3</p>
                  <p className="text-sm text-slate-400">Nos últimos 7 dias</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
                <CardContent className="p-5">
                  <p className="text-sm text-slate-500">Pacientes novos</p>
                  <p className="mt-2 text-3xl font-bold">2</p>
                  <p className="text-sm text-slate-400">Nos últimos 7 dias</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {Object.keys(activitiesByDate).map((date) => (
                <section key={date}>
                  <h3 className="text-sm font-semibold text-slate-600 mb-3">{date}</h3>
                  <div className="space-y-3">
                    {activitiesByDate[date].map((act: any) => (
                      <Card
                        key={act.id}
                        className={`rounded-2xl border-slate-200 bg-white shadow-sm ${
                          act.tag === 'Novo paciente' ? 'border-l-4 border-emerald-300' : act.tag === 'Plano criado' ? 'border-l-4 border-sky-300' : act.tag === 'Plano concluído' ? 'border-l-4 border-violet-300' : ''
                        }`}
                      >
                        <CardContent className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"> 
                              {act.tag === 'Novo paciente' && <Users className="h-5 w-5" />}
                              {act.tag === 'Plano criado' && <Plus className="h-5 w-5" />}
                              {act.tag === 'Plano concluído' && <TrendingUp className="h-5 w-5" />}
                              {act.tag === 'Mensagem enviada' && <Mail className="h-5 w-5" />}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-base font-semibold text-slate-800">{act.title}</p>
                              <p className="text-sm text-slate-500 mt-1">{act.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-500">{act.time}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {(() => {
              const totalActivities = Object.values(activitiesByDate).flat().length;
              const pageSize = 10;
              if (totalActivities <= pageSize) return null;
              return (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Mostrando 1 a 10 de {totalActivities} atividades</p>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost">&lt;</Button>
                    <Button className="bg-white border rounded-full px-3 py-1">1</Button>
                    <Button variant="ghost">&gt;</Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Activities;
