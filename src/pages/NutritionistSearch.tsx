import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, MapPin, Star, Award } from "lucide-react";
import { toast } from "sonner";
import NutritionistProfileDialog from "@/components/landing/NutritionistProfileDialog";
import type { Nutritionist as LandingNutritionist } from "@/components/landing/NutritionistProfileDialog";

interface Nutritionist extends LandingNutritionist {
  id: string;
  yearsExperience: number;
}

// Mock data - será substituído por API
const mockNutritionists: Nutritionist[] = [
  {
    id: "1",
    name: "Dra. Carolina Silva",
    crn: "CRN 10001",
    tags: ["Emagrecimento", "Esportiva"],
    rating: 4.8,
    reviews: 42,
    availability: [
      { day: "Segunda-feira", hours: "08:00 – 12:00" },
      { day: "Quarta-feira", hours: "08:00 – 12:00" },
    ],
    location: "São Paulo, SP",
    phone: "(11) 98765-4321",
    avatar: "CS",
    attendance: "Presencial e Online",
    price: 200,
    yearsExperience: 8,
  },
  {
    id: "2",
    name: "Nutri. Roberto Costa",
    crn: "CRN 10002",
    tags: ["Clínica", "Doenças crônicas"],
    rating: 4.9,
    reviews: 67,
    availability: [
      { day: "Terça-feira", hours: "09:00 – 13:00" },
      { day: "Quinta-feira", hours: "14:00 – 18:00" },
    ],
    location: "Rio de Janeiro, RJ",
    phone: "(21) 99876-5432",
    avatar: "RC",
    attendance: "Presencial e Online",
    price: 180,
    yearsExperience: 12,
  },
  {
    id: "3",
    name: "Nutri. Ana Martins",
    crn: "CRN 10003",
    tags: ["Pediatria", "Gestantes"],
    rating: 4.7,
    reviews: 38,
    availability: [
      { day: "Segunda-feira", hours: "08:00 – 12:00" },
    ],
    location: "Belo Horizonte, MG",
    phone: "(31) 98765-6543",
    avatar: "AM",
    attendance: "Presencial e Online",
    price: 170,
    yearsExperience: 6,
  },
  {
    id: "4",
    name: "Dr. Lucas Ferreira",
    crn: "CRN 10004",
    tags: ["Esportiva", "Clínica"],
    rating: 4.6,
    reviews: 51,
    availability: [
      { day: "Quarta-feira", hours: "10:00 – 14:00" },
      { day: "Sexta-feira", hours: "08:00 – 12:00" },
    ],
    location: "Curitiba, PR",
    phone: "(41) 98765-7654",
    avatar: "LF",
    attendance: "Presencial e Online",
    price: 190,
    yearsExperience: 7,
  },
  {
    id: "5",
    name: "Nutri. Mariana Oliveira",
    crn: "CRN 10005",
    tags: ["Vegetariana / Vegana", "Doenças crônicas"],
    rating: 4.9,
    reviews: 55,
    availability: [],
    location: "Salvador, BA",
    phone: "(71) 98765-8765",
    avatar: "MO",
    attendance: "Consultório",
    price: 220,
    yearsExperience: 10,
  },
];

const SPECIALTIES_FILTER = [
  "Emagrecimento",
  "Esportiva",
  "Clínica",
  "Vegetariana / Vegana",
  "Pediatria",
  "Gestantes",
  "Doenças crônicas",
];

const NutritionistCard = ({ nutritionist, onViewProfile }: { nutritionist: Nutritionist; onViewProfile: (nutritionist: Nutritionist) => void }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewProfile(nutritionist)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{nutritionist.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{nutritionist.crn}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Specialties */}
        <div className="flex flex-wrap gap-2">
          {nutritionist.tags.map((specialty) => (
            <Badge key={specialty} variant="outline" className="text-xs">
              {specialty}
            </Badge>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center cursor-help">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-sm">{nutritionist.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground">({nutritionist.reviews})</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{nutritionist.reviews} avaliações</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center cursor-help">
                <div className="flex items-center justify-center gap-1">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-semibold">{nutritionist.yearsExperience}a</span>
                </div>
                <p className="text-xs text-muted-foreground">Experiência</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{nutritionist.yearsExperience} anos de atuação</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center cursor-help">
                <div className="text-xs font-semibold text-green-600">R$ {nutritionist.price}</div>
                <p className="text-xs text-muted-foreground">Consulta</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Valor da primeira consulta</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {nutritionist.location}
        </div>

        {/* Action Button */}
        <Button className="w-full" onClick={(e) => {
          e.stopPropagation();
          onViewProfile(nutritionist);
        }}>
          Ver Perfil Completo
        </Button>
      </CardContent>
    </Card>
  );
};

export const NutritionistSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAttendances, setSelectedAttendances] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedNutritionist, setSelectedNutritionist] = useState<Nutritionist | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const hasActiveFilters = searchQuery !== "" || selectedAttendances.length > 0 || selectedSpecialties.length > 0;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedAttendances([]);
    setSelectedSpecialties([]);
  };

  // Filter logic
  const filteredNutritionists = useMemo(() => {
    return mockNutritionists.filter((nutritionist) => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        nutritionist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nutritionist.crn.toLowerCase().includes(searchQuery.toLowerCase());

      // Specialty filter
      const matchesSpecialty = selectedSpecialties.length === 0 || 
        selectedSpecialties.some((spec) => nutritionist.tags.includes(spec));

      // Attendance filter
      const matchesAttendance = selectedAttendances.length === 0 ||
        selectedAttendances.some((attendance) =>
          nutritionist.attendance.toLowerCase().includes(attendance.toLowerCase())
        );

      return matchesSearch && matchesAttendance && matchesSpecialty;
    });
  }, [searchQuery, selectedAttendances, selectedSpecialties]);

  const toggleAttendance = (attendance: string) => {
    setSelectedAttendances((prev) =>
      prev.includes(attendance)
        ? prev.filter((value) => value !== attendance)
        : [...prev, attendance]
    );
  };

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty) 
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  const removeAttendance = (attendance: string) => {
    setSelectedAttendances((prev) => prev.filter((value) => value !== attendance));
  };

  const removeSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) => prev.filter((value) => value !== specialty));
  };

  const handleViewProfile = (nutritionist: Nutritionist) => {
    setSelectedNutritionist(nutritionist);
    setDialogOpen(true);
  };

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Encontre um Nutricionista</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Busque e filtre nutricionistas cadastrados na plataforma
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou CRN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-base"
              />
            </div>

              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Filtros ativos:</span>
                  {searchQuery && (
                    <Badge variant="secondary" className="gap-2 rounded-full px-3 py-1">
                      Busca: {searchQuery}
                      <button type="button" onClick={() => setSearchQuery("")} className="text-xs font-semibold opacity-70 hover:opacity-100">
                        ×
                      </button>
                    </Badge>
                  )}
                  {selectedAttendances.map((attendance) => (
                    <Badge key={attendance} variant="secondary" className="gap-2 rounded-full px-3 py-1">
                      {attendance === "online" ? "Online" : "Presencial"}
                      <button type="button" onClick={() => removeAttendance(attendance)} className="text-xs font-semibold opacity-70 hover:opacity-100">
                        ×
                      </button>
                    </Badge>
                  ))}
                  {selectedSpecialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="gap-2 rounded-full px-3 py-1">
                      {specialty}
                      <button type="button" onClick={() => removeSpecialty(specialty)} className="text-xs font-semibold opacity-70 hover:opacity-100">
                        ×
                      </button>
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" className="h-8 px-2" onClick={clearFilters}>
                    Limpar tudo
                  </Button>
                </div>
              )}
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-base">Filtros</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Attendance Filter */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Tipo de atendimento</p>
                    <div className="space-y-2">
                      {[
                        { value: "online", label: "Online" },
                        { value: "presencial", label: "Presencial" },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedAttendances.includes(option.value)}
                            onChange={() => toggleAttendance(option.value)}
                            className="h-4 w-4 rounded"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Specialty Filter */}
                  <div className="space-y-2 border-t pt-4">
                    <p className="text-sm font-semibold">Especialidades</p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {SPECIALTIES_FILTER.map((specialty) => (
                        <label key={specialty} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSpecialties.includes(specialty)}
                            onChange={() => toggleSpecialty(specialty)}
                            className="h-4 w-4 rounded"
                          />
                          <span className="text-sm">{specialty}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={clearFilters}
                    >
                      Limpar Filtros
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-3">
              {filteredNutritionists.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {filteredNutritionists.length} nutricionista{filteredNutritionists.length !== 1 ? "s" : ""} encontrado{filteredNutritionists.length !== 1 ? "s" : ""}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredNutritionists.map((nutritionist) => (
                      <NutritionistCard
                        key={nutritionist.id}
                        nutritionist={nutritionist}
                        onViewProfile={handleViewProfile}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="py-12">
                    <CardContent className="text-center space-y-4">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                      <div>
                        <h3 className="font-semibold">Nenhum nutricionista encontrado</h3>
                        <p className="text-sm text-muted-foreground">
                          Não encontramos resultados com os filtros atuais.
                        </p>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {selectedSpecialties.length > 0 && (
                          <p>• Tente mudar a especialidade (você selecionou: {selectedSpecialties.join(", ")})</p>
                        )}
                        {selectedAttendances.length > 0 && (
                          <p>• Tente adicionar atendimento online ou presencial</p>
                        )}
                        {searchQuery && (
                          <p>• Tente buscar por outro profissional ou especialidade</p>
                        )}
                        {!selectedSpecialties.length && !selectedAttendances.length && !searchQuery && (
                          <p>• Nenhum nutricionista cadastrado no sistema ainda</p>
                        )}
                      </div>
                      {hasActiveFilters && (
                        <Button variant="outline" size="sm" onClick={clearFilters}>
                          Limpar todos os filtros
                        </Button>
                      )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Profile Dialog */}
          <NutritionistProfileDialog
            nutritionist={selectedNutritionist}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          />
        </div>
      </main>
    </TooltipProvider>
  );
};

export default NutritionistSearch;
