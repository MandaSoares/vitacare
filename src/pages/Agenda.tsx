import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NutritionistSidebar } from "@/components/layout/NutritionistSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar, Clock, MapPin, Phone, Mail, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  time: string;
  duration: string;
  type: "online" | "presencial";
  status: "confirmado" | "pendente" | "concluído" | "cancelado";
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "João Silva",
    patientEmail: "joao@email.com",
    patientPhone: "(11) 98765-4321",
    date: "2026-05-20",
    time: "09:00",
    duration: "60",
    type: "online",
    status: "confirmado",
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Maria Santos",
    patientEmail: "maria@email.com",
    patientPhone: "(11) 97654-3210",
    date: "2026-05-20",
    time: "10:30",
    duration: "45",
    type: "presencial",
    status: "confirmado",
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Carlos Oliveira",
    patientEmail: "carlos@email.com",
    patientPhone: "(11) 96543-2109",
    date: "2026-05-21",
    time: "14:00",
    duration: "60",
    type: "online",
    status: "pendente",
  },
  {
    id: "4",
    patientId: "4",
    patientName: "Ana Costa",
    patientEmail: "ana@email.com",
    patientPhone: "(11) 95432-1098",
    date: "2026-05-21",
    time: "15:30",
    duration: "45",
    type: "presencial",
    status: "confirmado",
  },
  {
    id: "5",
    patientId: "1",
    patientName: "Roberto Ferreira",
    patientEmail: "roberto@email.com",
    patientPhone: "(11) 94321-0987",
    date: "2026-05-22",
    time: "10:00",
    duration: "60",
    type: "online",
    status: "concluído",
  },
  {
    id: "6",
    patientId: "2",
    patientName: "João Silva",
    patientEmail: "joao@email.com",
    patientPhone: "(11) 98765-4321",
    date: "2026-05-27",
    time: "11:00",
    duration: "60",
    type: "presencial",
    status: "confirmado",
  },
];

const statusColors: Record<string, string> = {
  confirmado: "bg-green-100 text-green-800",
  pendente: "bg-yellow-100 text-yellow-800",
  concluído: "bg-blue-100 text-blue-800",
  cancelado: "bg-red-100 text-red-800",
};

const Agenda: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date("2026-05-20"));
  const [selectedDate, setSelectedDate] = useState(new Date("2026-05-20"));
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [cancelingAppointmentId, setCancelingAppointmentId] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Get first day and last day of the month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Create calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const appointmentsForDate = mockAppointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    const matches =
      aptDate.getFullYear() === selectedDate.getFullYear() &&
      aptDate.getMonth() === selectedDate.getMonth() &&
      aptDate.getDate() === selectedDate.getDate();

    if (!matches) return false;
    if (filterStatus && apt.status !== filterStatus) return false;
    return true;
  });

  const hasAppointmentOnDate = (day: number) => {
    return mockAppointments.some((apt) => {
      const aptDate = new Date(apt.date);
      return (
        aptDate.getFullYear() === currentDate.getFullYear() &&
        aptDate.getMonth() === currentDate.getMonth() &&
        aptDate.getDate() === day
      );
    });
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentDate(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  const handleSelectDate = (day: number) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
  };

  const handleMessageClick = (patientId: string) => {
    navigate(`/nutritionist/messages?patientId=${patientId}`);
  };

  const formattedDate = selectedDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const monthYear = currentDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const handleCancelConfirm = () => {
    setShowCancelConfirm(false);
    setCancelingAppointmentId(null);
  };

  return (
    <div className="min-h-screen bg-[#f3f5f4] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[224px_minmax(0,1fr)]">
        <NutritionistSidebar />
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.08),_transparent_35%),linear-gradient(180deg,_rgba(250,250,250,1)_0%,_rgba(244,247,250,1)_100%)] px-4 py-6 text-foreground sm:px-6 lg:px-8 lg:pl-12">
          <div className="w-full space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Agenda de Consultas</h1>

            <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
              {/* Calendar */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={handlePrevMonth} className="h-8 w-8 p-0">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-sm font-semibold capitalize">{monthYear}</h2>
                    <Button variant="ghost" size="sm" onClick={handleNextMonth} className="h-8 w-8 p-0">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 gap-2">
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
                      <div key={day} className="text-center text-xs font-semibold text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, idx) => {
                      const isSelected =
                        day !== null &&
                        day === selectedDate.getDate() &&
                        selectedDate.getMonth() === currentDate.getMonth() &&
                        selectedDate.getFullYear() === currentDate.getFullYear();

                      const hasAppointment = day !== null && hasAppointmentOnDate(day);

                      return (
                        <button
                          key={idx}
                          onClick={() => day !== null && handleSelectDate(day)}
                          className={`h-10 rounded-lg text-sm font-medium transition-colors ${
                            day === null
                              ? "text-transparent"
                              : isSelected
                                ? "bg-emerald-700 text-white"
                                : hasAppointment
                                  ? "border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50"
                                  : "text-foreground hover:bg-accent"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Appointments */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold capitalize mb-4">{formattedDate}</h2>

                  {/* Status Filter */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      variant={filterStatus === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus(null)}
                      className="rounded-2xl"
                    >
                      Todos
                    </Button>
                    {Object.keys(statusColors).map((status) => (
                      <Button
                        key={status}
                        variant={filterStatus === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus(status)}
                        className="rounded-2xl capitalize"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>

                  {/* Appointments List */}
                  <div className="space-y-4">
                    {appointmentsForDate.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Calendar className="mx-auto h-12 w-12 text-muted-foreground/30" />
                          <h3 className="mt-4 font-semibold">Nenhuma consulta neste dia</h3>
                          <p className="text-sm text-muted-foreground">
                            Não há consultas agendadas para {formattedDate.toLowerCase()}
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      appointmentsForDate.map((appointment) => (
                        <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
                                  <Badge className={statusColors[appointment.status]}>
                                    {appointment.status}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-emerald-600" />
                                    <span>
                                      {appointment.time} ({appointment.duration} min)
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-emerald-600" />
                                    <span className="capitalize">{appointment.type}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-emerald-600" />
                                    <span>{appointment.patientPhone}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-emerald-600" />
                                    <span>{appointment.patientEmail}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-xl gap-2"
                                  onClick={() => handleMessageClick(appointment.patientId)}
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  Mensagem
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-xl text-red-600 hover:text-red-700"
                                  onClick={() => {
                                    setCancelingAppointmentId(appointment.id);
                                    setShowCancelConfirm(true);
                                  }}
                                >
                                  Cancelar Consulta
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Consulta</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja cancelar esta consulta?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
            <p className="text-sm font-medium text-amber-900 mb-3">
              Antes de cancelar, por favor confirme:
            </p>
            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded" />
                <span>O paciente foi informado sobre o cancelamento?</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded" />
                <span>Já foi enviada uma mensagem avisando o cancelamento?</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="rounded-2xl">Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="rounded-2xl bg-red-600 text-white hover:bg-red-700"
            >
              Confirmar Cancelamento
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Agenda;
