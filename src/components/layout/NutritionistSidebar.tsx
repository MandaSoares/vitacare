import { type ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, CalendarDays, HelpCircle, Leaf, Mail, Plus, Search, Settings, Users, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SidebarAction = {
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  active?: (pathname: string) => boolean;
};

const ACTIONS: SidebarAction[] = [
  { label: "Novo plano", icon: <Plus className="h-4 w-4" />, href: "/nutritionist/plan/create", active: (pathname) => pathname.startsWith("/nutritionist/plan/create") },
  { label: "Buscar paciente", icon: <Search className="h-4 w-4" />, href: "/patients", active: (pathname) => pathname.startsWith("/patients") },
  { label: "Ver pacientes", icon: <Users className="h-4 w-4" />, href: "/nutritionist/plans", active: (pathname) => pathname.startsWith("/nutritionist/plans") },
  { label: "Mensagens", icon: <Mail className="h-4 w-4" />, href: "/nutritionist/messages", active: (pathname) => pathname.startsWith("/nutritionist/messages") },
  { label: "Agenda", icon: <CalendarDays className="h-4 w-4" />, href: "/agenda", active: (pathname) => pathname.startsWith("/agenda") },
  { label: "Relatorios", icon: <BarChart3 className="h-4 w-4" />, href: "/reports", active: (pathname) => pathname.startsWith("/reports") },
];

export const NutritionistSidebar = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md text-emerald-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-white px-5 py-6 transition-transform lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <Link to="/dashboard" className="mb-6 flex items-center gap-2 rounded-xl">
            <Leaf className="h-6 w-6 text-emerald-700" />
            <p className="text-[28px] font-semibold tracking-tight text-emerald-700">VitaCare</p>
          </Link>

          <div className="space-y-2">
            {ACTIONS.map((action) => {
              const isActive = action.active?.(pathname) ?? false;

              if (action.href) {
                return (
                  <Button
                    key={action.label}
                    asChild
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                      isActive && "bg-slate-100 text-slate-900",
                    )}
                  >
                    <Link to={action.href}>
                      {action.icon}
                      {action.label}
                    </Link>
                  </Button>
                );
              }

              return (
                <Button
                  key={action.label}
                  variant="ghost"
                  className="w-full justify-start gap-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                >
                  {action.icon}
                  {action.label}
                </Button>
              );
            })}
          </div>

          <div className="mt-auto space-y-1 border-t border-slate-200 pt-4">
            <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              <HelpCircle className="h-4 w-4" />
              Ajuda
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
