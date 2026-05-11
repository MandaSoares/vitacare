export interface Patient {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  planStatus: "active" | "inactive" | "pending";
  joinDate: string;
  lastConsultation: string | null;
  notes?: string;
}

export const mockPatients: Patient[] = [
  {
    id: "1",
    name: "João Silva",
    cpf: "123.456.789-00",
    email: "joao@email.com",
    phone: "(11) 98765-4321",
    planStatus: "active",
    joinDate: "2025-01-15",
    lastConsultation: "2026-04-20",
    notes: "Emagrecimento, acompanhamento mensal",
  },
  {
    id: "2",
    name: "Maria Santos",
    cpf: "987.654.321-11",
    email: "maria@email.com",
    phone: "(11) 97654-3210",
    planStatus: "active",
    joinDate: "2025-02-10",
    lastConsultation: "2026-05-05",
    notes: "Nutrição clínica, diabetes",
  },
  {
    id: "3",
    name: "Carlos Oliveira",
    cpf: "456.789.123-22",
    email: "carlos@email.com",
    phone: "(11) 96543-2109",
    planStatus: "inactive",
    joinDate: "2024-06-20",
    lastConsultation: null,
    notes: "Sem atividade há 6 meses",
  },
  {
    id: "4",
    name: "Ana Costa",
    cpf: "789.123.456-33",
    email: "ana@email.com",
    phone: "(11) 95432-1098",
    planStatus: "pending",
    joinDate: "2026-05-01",
    lastConsultation: null,
    notes: "Aguardando primeira consulta",
  },
  {
    id: "5",
    name: "Roberto Ferreira",
    cpf: "321.654.987-44",
    email: "roberto@email.com",
    phone: "(11) 94321-0987",
    planStatus: "active",
    joinDate: "2025-03-12",
    lastConsultation: "2026-04-28",
    notes: "Nutrição esportiva, treino",
  },
];