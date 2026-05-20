import { Link, useLocation } from "react-router-dom";
import { CalendarDays, HelpCircle, Leaf, Mail, Search, Settings, Star, Menu, Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Encontrar", href: "/patient/dashboard?tab=find", icon: <Search className="h-4 w-4" /> },
  { label: "Pré-análise IA", href: "/patient/dashboard?tab=preanalysis", icon: <Star className="h-4 w-4" /> },
  { label: "Consultas", href: "/patient/dashboard?tab=consultations", icon: <CalendarDays className="h-4 w-4" /> },
  { label: "Mensagens", href: "/patient/dashboard?tab=messages", icon: <Mail className="h-4 w-4" /> },
  { label: "Minhas refeições", href: "/patient/dashboard?tab=meals", icon: <Users className="h-4 w-4" /> },
  { label: "Favoritos", href: "/patient/dashboard?tab=saved", icon: <Users className="h-4 w-4" /> },
];

export const PatientSidebar = () => {
  const { pathname, search } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 rounded-md bg-white p-2 text-emerald-700 shadow-md"
        onClick={() => setIsOpen((current) => !current)}
      >
        <Menu className="h-6 w-6" />
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-white px-5 py-6 transition-transform lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <Link to="/patient/dashboard" className="mb-6 flex items-center gap-2 rounded-xl">
            <Leaf className="h-6 w-6 text-emerald-700" />
            <p className="text-[28px] font-semibold tracking-tight text-emerald-700">VitaCare</p>
          </Link>

          <div className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const [basePath, tabQuery = ""] = item.href.split("?");
              const isActive = pathname === basePath && (tabQuery === "" ? search === "" : search === `?${tabQuery}`);

              return (
                <Button
                  key={item.label}
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                    isActive && "bg-slate-100 text-slate-900",
                  )}
                >
                  <Link to={item.href}>
                    {item.icon}
                    {item.label}
                  </Link>
                </Button>
              );
            })}

          </div>

          <div className="mt-auto space-y-1 border-t border-slate-200 pt-4">
            <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900">
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900">
              <HelpCircle className="h-4 w-4" />
              Ajuda
            </Button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
};
