import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, MapPin, Star, Award, Heart } from "lucide-react";
import { toast } from "sonner";
import NutritionistProfileDialog from "@/components/landing/NutritionistProfileDialog";
import { NutritionistSidebar } from "@/components/layout/NutritionistSidebar";
import { getSavedNutritionistIds, setNutritionistSaved } from "@/lib/savedNutritionistsStore";
import type { Nutritionist as LandingNutritionist } from "@/components/landing/NutritionistProfileDialog";

export interface Nutritionist extends LandingNutritionist {
  id: string;
  yearsExperience: number;
  avatarUrl?: string;
}

export const getNutritionistAvatarStyle = (seed: string) => {
  const palettes = [
    "bg-emerald-100 text-emerald-800",
    "bg-sky-100 text-sky-800",
    "bg-rose-100 text-rose-800",
    "bg-amber-100 text-amber-800",
    "bg-violet-100 text-violet-800",
  ];

  const index = Math.abs(seed.split("").reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0)) % palettes.length;
  return palettes[index];
};

// Mock data - será substituído por API
export const mockNutritionists: Nutritionist[] = [
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
    avatarUrl: undefined,
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
    avatarUrl: undefined,
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
    avatarUrl: undefined,
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
    avatarUrl: undefined,
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
    avatarUrl: undefined,
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

export const NutritionistCard = ({ nutritionist, onViewProfile, isFavorited, onFavoriteChange }: { nutritionist: Nutritionist; onViewProfile: (nutritionist: Nutritionist) => void; isFavorited?: boolean; onFavoriteChange?: (nutritionistId: string, isFavorited: boolean) => void }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewProfile(nutritionist)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 flex items-center gap-3">
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full font-semibold ${getNutritionistAvatarStyle(nutritionist.name)}`}>
              {nutritionist.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
            </div>
            <div>
              <CardTitle className="text-lg">{nutritionist.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{nutritionist.crn}</p>
            </div>
          </div>
          {onFavoriteChange && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteChange(nutritionist.id, !isFavorited);
              }}
              className="ml-2 rounded-full p-1 hover:bg-gray-100"
            >
              <Heart className={`h-5 w-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
            </button>
          )}
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

export const NutritionistSearch = ({ showSidebar = true, embedded = false }: { showSidebar?: boolean; embedded?: boolean } = {}) => {
  const [savedIds, setSavedIds] = useState<string[]>(() => getSavedNutritionistIds());
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

  useEffect(() => {
    if (embedded) {
      return;
    }

    const previousBodyBackground = document.body.style.backgroundColor;
    const previousHtmlBackground = document.documentElement.style.backgroundColor;

    document.body.style.backgroundColor = "#ffffff";
    document.documentElement.style.backgroundColor = "#ffffff";

    return () => {
      document.body.style.backgroundColor = previousBodyBackground;
      document.documentElement.style.backgroundColor = previousHtmlBackground;
    };
  }, [embedded]);

    const handleFavoriteChange = (nutritionistId: string, nextFavorite: boolean) => {
      setSavedIds((current) => {
        const nextIds = setNutritionistSaved(nutritionistId, nextFavorite);
        return nextIds;
      });
    };

  return (
    <TooltipProvider>
      <div className={embedded ? "w-full min-w-0 px-4 lg:px-6 xl:px-8 text-slate-900" : "min-h-screen bg-white text-slate-900"}>
        <div className={showSidebar ? "grid min-h-screen lg:grid-cols-[224px_minmax(0,1fr)]" : (embedded ? "w-full" : "min-h-screen") }>
          {showSidebar && <NutritionistSidebar />}
          <main className={embedded ? "w-full min-w-0 px-0 py-0 text-foreground" : "min-h-screen bg-white px-4 py-8 text-foreground sm:px-6 lg:px-8"}>
            <div className={embedded ? "w-full min-w-0 space-y-6 pl-4 lg:pl-8 xl:pl-10" : "mx-auto w-full max-w-7xl space-y-8"}>
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

          <div className={embedded ? "space-y-6" : "grid gap-8 lg:grid-cols-4"}>
            {/* Sidebar Filters */}
            <div className={embedded ? "w-full" : "lg:col-span-1"}>
              <Card className={embedded ? "w-full" : "sticky top-4"}>
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
            <div className={embedded ? "w-full" : "lg:col-span-3"}>
              {filteredNutritionists.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {filteredNutritionists.length} nutricionista{filteredNutritionists.length !== 1 ? "s" : ""} encontrado{filteredNutritionists.length !== 1 ? "s" : ""}
                  </p>
                  <div className={embedded ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
                    {filteredNutritionists.map((nutritionist) => (
                      <NutritionistCard
                        key={nutritionist.id}
                        nutritionist={nutritionist}
                        onViewProfile={handleViewProfile}
                         isFavorited={savedIds.includes(nutritionist.id)}
                         onFavoriteChange={handleFavoriteChange}
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
             isFavorited={selectedNutritionist ? savedIds.includes(selectedNutritionist.id) : false}
             onFavoriteChange={(nextFavorite) => {
               if (!selectedNutritionist) return;
               handleFavoriteChange(selectedNutritionist.id, nextFavorite);
             }}
          />
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default NutritionistSearch;
