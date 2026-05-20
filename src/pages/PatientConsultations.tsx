import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ChevronRight, MoreVertical } from "lucide-react";

const mockConsultations = [
  {
    id: "1",
    dateFull: "24 de Maio de 2024",
    day: "24",
    month: "MAI",
    weekday: "Sábado",
    time: "10:00",
    title: "Consulta presencial",
    nutritionist: "Dra. Juliana Alves",
    location: "Clínica VitaCare - Unidade Centro",
    status: "Confirmada",
  },
  {
    id: "2",
    dateFull: "28 de Junho de 2024",
    day: "28",
    month: "JUN",
    weekday: "Sexta",
    time: "14:30",
    title: "Consulta online",
    nutritionist: "Dra. Juliana Alves",
    location: "Online",
    status: "Agendada",
  },
  {
    id: "3",
    dateFull: "26 de Julho de 2024",
    day: "26",
    month: "JUL",
    weekday: "Sexta",
    time: "14:30",
    title: "Consulta presencial",
    nutritionist: "Dra. Juliana Alves",
    location: "Clínica VitaCare - Unidade Centro",
    status: "Agendada",
  },
];

const statusClass = (status: string) => {
  if (status === "Confirmada") return "bg-emerald-100 text-emerald-800 border border-emerald-200";
  if (status === "Agendada") return "bg-sky-50 text-sky-600 border border-sky-100";
  return "bg-gray-50 text-gray-600 border border-gray-100";
};

const PatientConsultations: React.FC = () => {
  const [tab, setTab] = useState("agendadas");

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Próxima consulta card */}
      <Card className="rounded-2xl bg-emerald-50/40 border border-emerald-100">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start md:items-center gap-5 flex-1">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <CalendarDays className="h-6 w-6" />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">Próxima consulta</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">24 de Maio de 2024</p>
                <p className="text-sm text-slate-600">Sábado, às 10:00</p>
                <div className="mt-4 text-sm text-slate-700">
                  <div className="font-medium">Nutricionista</div>
                  <div>Dra. Juliana Alves</div>
                </div>
              </div>
            </div>

            <div className="flex items-end md:items-center md:flex-col md:justify-between gap-3">
              <div className={`rounded-full px-4 py-2 text-sm font-medium ${statusClass('Confirmada')}`}>Confirmada</div>
              <button className="mt-6 rounded-lg border border-emerald-200 px-4 py-2 text-emerald-700 transition-colors hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800">Ver detalhes</button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs and list */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <button onClick={() => setTab('agendadas')} className={`pb-2 transition-colors hover:text-emerald-700 ${tab === 'agendadas' ? 'border-b-2 border-emerald-500 text-emerald-700' : 'text-slate-700'}`}>Agendadas</button>
            <button onClick={() => setTab('historico')} className={`pb-2 transition-colors hover:text-emerald-700 ${tab === 'historico' ? 'border-b-2 border-emerald-500 text-emerald-700' : 'text-slate-700'}`}>Histórico</button>
            <button onClick={() => setTab('canceladas')} className={`pb-2 transition-colors hover:text-emerald-700 ${tab === 'canceladas' ? 'border-b-2 border-emerald-500 text-emerald-700' : 'text-slate-700'}`}>Canceladas</button>
          </div>
        </div>

          <div className="mt-4 space-y-4">
          {mockConsultations.map((c) => (
            <div key={c.id} className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-start md:items-center gap-4">
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg border border-slate-100 bg-white text-emerald-700">
                  <div className="text-lg font-semibold">{c.day}</div>
                  <div className="text-xs uppercase text-emerald-700 font-medium">{c.month}</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{c.weekday}, às {c.time}</div>
                  <div className="text-sm text-slate-600 mt-1">{c.title}</div>
                  <div className="text-sm text-slate-600 mt-2">{c.nutritionist}<br/>{c.location}</div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center gap-4">
                <div className={`rounded-full px-3 py-1 text-sm font-medium ${statusClass(c.status)}`}>{c.status}</div>
                <button className="rounded-md border border-emerald-100 px-3 py-2 text-emerald-700 flex items-center gap-2 transition-colors hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800">Ver detalhes <ChevronRight className="h-4 w-4" /></button>
                <button className="text-gray-400 transition-colors hover:text-gray-700"><MoreVertical className="h-5 w-5" /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button className="w-full rounded-2xl border border-emerald-200 px-4 py-3 text-emerald-700 font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800">
            <CalendarDays className="h-4 w-4 text-emerald-700" />
            Agendar nova consulta
          </button>
        </div>
      </div>

      {/* Preparation card */}
      <Card className="rounded-2xl border border-slate-100 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <div className="h-8 w-8 rounded bg-white flex items-center justify-center text-emerald-700">
                  <CalendarDays className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Preparação para a consulta</p>
                <p className="text-sm text-slate-600 mt-1">Para aproveitar melhor sua consulta, envie seus registros alimentares e anotações sobre sua rotina.</p>
              </div>
            </div>
            <button className="rounded-lg border border-emerald-200 bg-white px-4 py-2 text-emerald-700 transition-colors hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800">Enviar informações</button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientConsultations;
